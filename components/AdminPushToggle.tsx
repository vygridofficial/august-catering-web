'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Download, Loader2, Smartphone, TestTube2 } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function urlBase64ToUint8Array(base64String: string) {
  const sanitized = base64String.trim().replace(/^['"]|['"]$/g, '');
  const padding = '='.repeat((4 - (sanitized.length % 4)) % 4);
  const base64 = (sanitized + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function waitForActivation(registration: ServiceWorkerRegistration, timeoutMs = 15000) {
  if (registration.active) return registration;

  const worker = registration.installing || registration.waiting;
  if (!worker) {
    throw new Error('Service worker registration did not start.');
  }

  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error('Service worker activation timed out.'));
    }, timeoutMs);

    const onStateChange = () => {
      if (worker.state === 'activated') {
        window.clearTimeout(timeoutId);
        resolve();
      }
      if (worker.state === 'redundant') {
        window.clearTimeout(timeoutId);
        reject(new Error('Service worker became redundant before activation.'));
      }
    };

    worker.addEventListener('statechange', onStateChange);
    onStateChange();
  });

  return registration;
}

async function getAdminServiceWorkerRegistration(timeoutMs = 15000) {
  const scopes = ['/admin', '/admin/', '/'];

  let lastError: unknown = null;
  for (const scope of scopes) {
    try {
      const registration = await navigator.serviceWorker.register('/admin-sw.js', { scope });
      if (registration.active) return registration;
      return waitForActivation(registration, timeoutMs);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Failed to register service worker for admin scopes.');
}

export function AdminPushToggle() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [installReady, setInstallReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      if (!mounted) return;
      setSupported(isSupported);

      if (!isSupported) {
        setLoading(false);
        return;
      }

      try {
        const standalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(standalone);

        const registration = await getAdminServiceWorkerRegistration();
        const permission = Notification.permission;
        const subscription = await registration.pushManager.getSubscription();
        if (!mounted) return;
        setEnabled(Boolean(subscription) && permission === 'granted');
      } catch (error) {
        console.error('Admin push setup failed:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const installPrompt = event as BeforeInstallPromptEvent;
      setInstallEvent(installPrompt);
      setInstallReady(true);
    };

    const onAppInstalled = () => {
      setInstallEvent(null);
      setInstallReady(false);
      toast.success('Admin app installed on this device.');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    bootstrap();

    return () => {
      mounted = false;
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (isStandalone) {
      toast.success('Admin app is already installed on this device.');
      return;
    }

    if (!installEvent) {
      toast.info('Install prompt unavailable. Use your browser menu and choose Install app / Add to Home Screen.');
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      toast.success('Install accepted.');
      setInstallReady(false);
      setInstallEvent(null);
    }
  };

  const handleEnable = async () => {
    if (!supported || !vapidPublicKey) {
      toast.error('Browser notifications are not available on this device.');
      return;
    }

    setSubmitting(true);
    try {
      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        toast.error('Notification permission was not granted.');
        return;
      }

      const publicKey = vapidPublicKey.trim().replace(/^['"]|['"]$/g, '');
      if (publicKey.length < 80) {
        throw new Error('VAPID public key looks invalid. Check your .env.local value.');
      }

      const registration = await getAdminServiceWorkerRegistration();
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const res = await fetchWithTimeout('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      });

      if (!res.ok) {
        const details = await res.text();
        throw new Error(details || 'Failed to save subscription');
      }

      setEnabled(true);
      toast.success('Device notifications enabled for admin.');
    } catch (error) {
      console.error('Unable to enable push notifications:', error);
      toast.error(error instanceof Error ? error.message : 'Could not enable device notifications.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisable = async () => {
    setSubmitting(true);
    try {
      const registration = await getAdminServiceWorkerRegistration();
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetchWithTimeout('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }

      setEnabled(false);
      toast.success('Device notifications disabled.');
    } catch (error) {
      console.error('Unable to disable push notifications:', error);
      toast.error(error instanceof Error ? error.message : 'Could not disable device notifications.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestNotification = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/push/test', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Test notification failed');
      }

      toast.success(data?.message || 'Test notification sent.');
    } catch (error: unknown) {
      console.error('Test push failed:', error);
      const message = error instanceof Error ? error.message : 'Could not send test notification.';
      toast.error(message);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-border/70 bg-background/60 backdrop-blur-xl p-4 sm:p-5 flex items-center gap-3 text-sm text-foreground/50">
        <Loader2 className="animate-spin" size={16} /> Checking device notifications...
      </div>
    );
  }

  if (!supported) {
    return (
      <div className="rounded-3xl border border-border/70 bg-background/60 backdrop-blur-xl p-4 sm:p-5 flex items-center gap-3 text-sm text-foreground/50">
        <Smartphone size={16} /> This browser does not support push notifications.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-background/60 backdrop-blur-xl p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className={`p-2 rounded-2xl ${enabled ? 'bg-primary/10 text-primary' : 'bg-foreground/5 text-foreground/50'}`}>
          <Bell size={18} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold">{enabled ? 'Device notifications enabled' : 'Enable device notifications'}</p>
          <p className="text-sm text-foreground/50">Get instant alerts on this phone or browser when a booking or enquiry comes in.</p>
          {!installReady ? (
            <p className="text-xs text-foreground/35 mt-1">If install is not shown, update the browser, reopen /admin, and use the browser menu Install app option.</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {enabled ? (
          <button
            type="button"
            onClick={handleDisable}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            <BellOff size={16} /> {submitting ? 'Saving...' : 'Disable'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEnable}
            disabled={submitting || !vapidPublicKey}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-colors disabled:opacity-50"
          >
            <Bell size={16} /> {submitting ? 'Saving...' : 'Enable'}
          </button>
        )}

        <button
          type="button"
          onClick={handleInstall}
          disabled={false}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          <Download size={16} /> {isStandalone ? 'Installed' : 'Install Admin App'}
        </button>

        <button
          type="button"
          onClick={handleTestNotification}
          disabled={testing || !enabled}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          <TestTube2 size={16} /> {testing ? 'Testing...' : 'Test Push'}
        </button>
      </div>
    </div>
  );
}
