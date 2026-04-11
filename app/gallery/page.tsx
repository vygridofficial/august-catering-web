import { Metadata } from 'next';
import { GalleryPageClient } from '@/components/GalleryPageClient';

export const metadata: Metadata = {
  title: "Event Gallery | Our Culinary Showcase",
  description: "Browse through August Catering's visual showcase. Experience our stunning event setups, premium catering layouts, and gourmet dishes beautifully captured in Thiruvaniyoor, Ernakulam.",
  openGraph: {
    title: "Culinary Gallery | August Catering Caterers",
    description: "Visual feasts of our premium catering and elegant event designs. See the story we tell through food.",
    images: [{ url: "/images/wedding-catering.png" }]
  }
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
