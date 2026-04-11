This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin Device Notifications

The project can send admin alerts to phones even when the admin panel is closed.

The admin panel is now installable as an admin-only PWA at `/admin`.

Alerts are triggered automatically for new bookings and enquiries from server actions.

To enable browser push notifications on the admin device, set these variables:

```bash
VAPID_SUBJECT=mailto:you@example.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_vapid_key
VAPID_PRIVATE_KEY=your_private_vapid_key
```

Install/admin push behavior:

- Open `/admin` in a supported browser.
- Use the in-panel prompt to enable device notifications.
- Install the app from the browser menu when the PWA install icon appears.
- New bookings and enquiries will trigger browser push notifications on subscribed admin devices.

Set these environment variables for WhatsApp Cloud API:

```bash
WHATSAPP_ACCESS_TOKEN=your_meta_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WHATSAPP_TO_NUMBER=919999999999

# Optional fallback for automation tools
ADMIN_ALERT_WEBHOOK_URL=https://your-webhook-url
```

Notes:

- `WHATSAPP_TO_NUMBER` should be the admin phone number in international format, without `+`.
- WhatsApp Cloud API may require an approved template if the recipient has not started a recent conversation window.
- If WhatsApp is not configured, submissions still work and only in-app admin notifications are stored.

Notes:

- Browser push and WhatsApp can be used together.
- If push is not enabled, the admin still gets in-app notifications and any configured WhatsApp alert.



 