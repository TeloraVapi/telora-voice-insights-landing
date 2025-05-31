
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small stores',
    monthlyPrice: 29,
    annualPrice: 24,
    features: [
      'Up to 100 calls/month',
      'Basic voice AI',
      'Email transcripts',
      'Standard support',
      'Shopify integration'
    ],
    popular: false
  },
  {
    name: 'Pro',
    description: 'Most popular for growing businesses',
    monthlyPrice: 79,
    annualPrice: 66,
    features: [
      'Up to 500 calls/month',
      'Advanced voice AI',
      'Real-time dashboard',
      'Smart summaries',
      'Priority support',
      'Custom questions',
      'Analytics & insights'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For high-volume stores',
    monthlyPrice: 199,
    annualPrice: 166,
    features: [
      'Unlimited calls',
      'Custom voice training',
      'Advanced analytics',
      'API access',
      'Dedicated support',
      'Custom integrations',
      'Multi-store management',
      'White-label options'
    ],
    popular: false
  }
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleCards(prev => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-pricing-card]').forEach((card, index) => {
      card.setAttribute('data-index', index.toString());
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your business. Upgrade or downgrade at any time.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-lg ${!isAnnual ? 'text-navy-900 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                isAnnual ? 'bg-indigo-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                isAnnual ? 'translate-x-7' : 'translate-x-0'
              }`}></div>
            </button>
            <span className={`text-lg ${isAnnual ? 'text-navy-900 font-semibold' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                Save 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              data-pricing-card
              className={`transition-all duration-700 ${
                visibleCards[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Card className={`relative p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-2 border-indigo-500 shadow-lg shadow-indigo-100' 
                  : 'border-2 border-gray-200 hover:border-indigo-200'
              }`}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-navy-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-navy-900">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                    {isAnnual && (
                      <div className="text-sm text-gray-500 mt-1">
                        Billed annually at ${plan.annualPrice * 12}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white'
                  }`}
                >
                  Get Started
                </Button>

                {/* Money Back Guarantee */}
                <p className="text-center text-sm text-gray-500 mt-4">
                  14-day free trial • No credit card required
                </p>
              </Card>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a custom solution for your enterprise?
          </p>
          <Button variant="outline" className="border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
