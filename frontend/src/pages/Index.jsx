import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ReviewsSection from "@/components/landing/ReviewsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
 
 
export default function Index() {
  return (
   <main className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <ReviewsSection />
    <CTASection />
    <Footer />
    </main>
        
   
  );
}

 