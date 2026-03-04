import Header from "@/components/Header";
import CategoryPills from "@/components/CategoryPills";
import BentoGrid from "@/components/BentoGrid";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background gradient-dark">
      <Header />
      <CategoryPills />
      <BentoGrid />
      <StatsSection />
      <ServicesSection />
      <Footer />
    </div>
  );
};

export default Index;
