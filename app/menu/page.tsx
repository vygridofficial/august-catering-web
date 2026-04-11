import { Metadata } from 'next';
import { MenuPageClient } from '@/components/MenuPageClient';

export const metadata: Metadata = {
  title: "Our Catering Menu | Gourmet Kerala & International Cuisine",
  description: "Explore the Gateway Kitchen menu. From traditional Kerala Sadhya and Biryani to Continental, Chinese, and bespoke fusion dishes for your events.",
  openGraph: {
    title: "Culinary Menu | Gateway Kitchen Caterers",
    description: "Browse our diverse range of premium catering options for weddings, corporate events, and parties in Ernakulam.",
    images: [{ url: "/images/hero-food.png" }]
  }
};

export default function MenuPage() {
  return <MenuPageClient />;
}
