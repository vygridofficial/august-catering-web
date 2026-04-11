'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, rememberMe })
      });
      
      if (res.ok) {
        toast.success('Authentication successful. Redirecting...');
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Authentication failed');
      }
    } catch {
      toast.error('Network error during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Dynamic Ambiance Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-foreground/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-background/55 backdrop-blur-2xl border border-border/50 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          {/* Subtle Glow inside the card */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60" />
          
          <div className="relative z-10">
            <Link href="/" className="mb-10 flex justify-center">
              <div className="flex flex-col items-center justify-center text-center gap-3">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                  <Image
                    src="/logo-1.png"
                    alt="August Catering Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-[0.18em] text-foreground uppercase leading-none">
                    Admin
                  </h1>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-foreground/40">
                    August Catering Control
                  </p>
                </div>
              </div>
            </Link>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">Restricted Access</label>
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-4 text-foreground/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Master Password"
                    className="w-full bg-foreground/5 border border-border/50 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-foreground/30"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-foreground/70 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span>Remember me on this device</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-background font-medium py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-xl hover:shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Unlock Dashboard'}
                {!loading && <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
