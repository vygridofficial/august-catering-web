'use client';

import { AdminPushToggle } from '@/components/AdminPushToggle';

export default function AdminSettingsPage() {
  return (
    <div className="w-full max-w-6xl space-y-8">
      <header>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-foreground/60">Configure admin device setup and notification delivery options.</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-heading font-semibold tracking-tight">Device Notifications & Install</h2>
        <p className="text-sm text-foreground/55 max-w-3xl">
          Enable browser push notifications for this admin device and install the admin panel as an app.
        </p>
        <AdminPushToggle />
      </section>
    </div>
  );
}
