import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { InvitationSection } from "@/components/InvitationSection";
import { CouplePhotosSection } from "@/components/CouplePhotosSection";
import { OurStorySection } from "@/components/OurStorySection";
import { BridalPartySection } from "@/components/BridalPartySection";
import { RsvpForm } from "@/components/RsvpForm";
import { GiftRegistrySection } from "@/components/GiftRegistrySection";
import { PhotoGallerySection } from "@/components/PhotoGallerySection";
import { FAQSection } from "@/components/FAQSection";
import { AccommodationsSection } from "@/components/AccommodationsSection";
import { GuestbookSection } from "@/components/GuestbookSection";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ThemeToggle />
      <main>
        <HeroSection />
        <InvitationSection />
        <CouplePhotosSection />
        <OurStorySection />
        <BridalPartySection />
        <RsvpForm />
        <GiftRegistrySection />
        <PhotoGallerySection />
        <FAQSection />
        <AccommodationsSection />
        <GuestbookSection />
      </main>
      <Footer />
    </div>
  );
}
