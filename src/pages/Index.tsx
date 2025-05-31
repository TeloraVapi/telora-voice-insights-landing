
import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import ProductDemo from '@/components/ProductDemo';
import Pricing from '@/components/Pricing';
import SocialProof from '@/components/SocialProof';
import FuturePlatforms from '@/components/FuturePlatforms';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      <main>
        <Hero />
        <HowItWorks />
        <ProductDemo />
        <Pricing />
        <SocialProof />
        <FuturePlatforms />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
