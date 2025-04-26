import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import RecentPostsSection from '@/components/home/RecentPostsSection';
import CallToActionSection from '@/components/home/CallToActionSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <RecentPostsSection />
      <CallToActionSection />
    </>
  );
}
