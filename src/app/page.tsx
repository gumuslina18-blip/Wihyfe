import Hero from '@/components/Hero';
import FeaturesShowcase from '@/components/FeaturesShowcase';
import PackagesSection from '@/components/PackagesSection';
import WebsitesSection from '@/components/WebsitesSection';
import WebsiteLiveShowcase from '@/components/WebsiteLiveShowcase';
import BotCards from '@/components/BotCards';
import LiveAuditTicker from '@/components/LiveAuditTicker';
import AdditionalServices from '@/components/AdditionalServices';
import WhyUs from '@/components/WhyUs';
import DdosDefenseRadar from '@/components/DdosDefenseRadar';
import DashboardPreview from '@/components/DashboardPreview';
import BeforeAfterComparison from '@/components/BeforeAfterComparison';
import InteractiveWorkflow from '@/components/InteractiveWorkflow';
import BotArchitectureExploded from '@/components/BotArchitectureExploded';
import TeamSection from '@/components/TeamSection';
import Process from '@/components/Process';
import GlobalNetworkRadar from '@/components/GlobalNetworkRadar';
import FaqAccordion from '@/components/FaqAccordion';
import PartnersSection from '@/components/PartnersSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesShowcase />
      <PackagesSection />
      <WebsitesSection />
      <WebsiteLiveShowcase />
      <BotCards />
      <AdditionalServices />
      <WhyUs />
      <DdosDefenseRadar />
      <LiveAuditTicker />
      <DashboardPreview />
      <BeforeAfterComparison />
      <InteractiveWorkflow />
      <BotArchitectureExploded />
      <TeamSection />
      <Process />
      <GlobalNetworkRadar />
      <FaqAccordion />
      <PartnersSection />
    </>
  );
}

