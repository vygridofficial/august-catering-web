import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Toaster } from 'sonner';
import { SocialSidebar } from '@/components/SocialSidebar';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
  ? process.env.NEXT_PUBLIC_SITE_URL 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "https://augustcatering.com";

export const metadata: Metadata = {
  title: {
    default: "August Catering | Event Catering",
    template: "%s | August Catering"
  },
  description: "Premium catering for weddings, corporate events, and parties in Ernakulam. Delivering unforgettable culinary experiences across Kerala.",
  keywords: ["catering", "wedding catering Ernakulam", "premium food service Kerala", "event catering Kochi", "August Catering"],
  authors: [{ name: "August Catering" }],
  creator: "August Catering Team",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: "August Catering",
    title: "August Catering | Premium Wedding & Event Catering",
    description: "Unforgettable culinary experiences for your special occasions. From weddings to corporate galas.",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "August Catering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "August Catering | Premium Event Catering",
    description: "Premium catering services in Kerala. Weddings, corporate events and private parties.",
    images: ["/logo.jpeg"],
  },
  icons: {
    icon: [
      { url: "/logo.jpeg", type: "image/jpeg" },
    ],
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-clip selection:bg-amber-500 selection:text-black">
        <SmoothScroll>
          {/* Header will go here */}
          <main className="flex-grow">{children}</main>
          {/* Footer will go here */}
        </SmoothScroll>
        <Toaster richColors position="bottom-right" theme="dark" />
        <SocialSidebar />
      </body>
    </html>
  );
}
