import { Metadata } from 'next';
import { AboutPageClient } from '@/components/AboutPageClient';

export const metadata: Metadata = {
  title: "About Our Culinary Journey",
  description: "Gateway Kitchen has been delivering premium catering services in Thiruvaniyoor, Ernakulam for over 21 years. Discover our story, our mission, and the milestones that define our excellence.",
  openGraph: {
    title: "About Us | Gateway Kitchen Caterers",
    description: "21+ years of culinary excellence in Kerala. Learn about our commitment to quality and storytelling through food.",
    images: [{ url: "/images/about_section_1774869943402.png" }]
  }
};

export default function AboutPage() {
  return <AboutPageClient />;
}
