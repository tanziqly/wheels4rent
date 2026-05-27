import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import CatalogSection from "@/components/sections/CatalogSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import BookingForm from "@/components/sections/BookingForm";
import DiscountSection from "@/components/sections/DiscountSection";
import ReviewsSlider from "@/components/sections/ReviewsSlider";
import UseCasesSection from "@/components/sections/UseCasesSection";
import TeamSection from "@/components/sections/TeamSection";
import ConditionsSection from "@/components/sections/ConditionsSection";
import FAQAccordion from "@/components/sections/FAQAccordion";
import HowItWorks from "@/components/sections/HowItWorks";
import PlacesSection from "@/components/sections/PlacesSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <div className="section-divider" />
        <CatalogSection />
        <div className="section-divider" />
        <BenefitsSection />
        <div className="section-divider" />
        <BookingForm />
        <div className="section-divider" />
        <DiscountSection />
        <div className="section-divider" />
        <ReviewsSlider />
        <div className="section-divider" />
        <UseCasesSection />
        <div className="section-divider" />
        <TeamSection />
        <div className="section-divider" />
        <ConditionsSection />
        <div className="section-divider" />
        <FAQAccordion />
        <div className="section-divider" />
        <HowItWorks />
        <div className="section-divider" />
        <PlacesSection />
      </main>
      <Footer />
    </>
  );
}
