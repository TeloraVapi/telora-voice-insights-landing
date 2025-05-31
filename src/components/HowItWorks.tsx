
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { LogIn, Settings, Phone, BarChart3 } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Connect',
    description: 'One-click Shopify OAuth integration',
    icon: LogIn,
    detail: 'Merchant clicks "Login with Shopify" for instant connection'
  },
  {
    number: 2,
    title: 'Customize', 
    description: 'Set your questions and timing',
    icon: Settings,
    detail: 'Configure feedback questions and delay (e.g., 3 days after delivery)'
  },
  {
    number: 3,
    title: 'Call',
    description: 'AI voice calls your customers',
    icon: Phone,
    detail: 'Telora\'s friendly AI voice automatically rings customers'
  },
  {
    number: 4,
    title: 'Insight',
    description: 'Get transcripts and smart summaries',
    icon: BarChart3,
    detail: 'View transcripts, GPT summaries, publish praise or act on issues'
  }
];

const HowItWorks = () => {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = stepRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setVisibleSteps(prev => {
              const newVisible = [...prev];
              newVisible[index] = entry.isIntersecting;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    stepRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            How Telora Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to transform your customer feedback process
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={el => stepRefs.current[index] = el}
              className={`transition-all duration-700 ${
                visibleSteps[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Card className="p-8 h-full border-2 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100 group cursor-pointer transform hover:-translate-y-2">
                {/* Step Number */}
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <step.icon className="w-12 h-12 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4 font-medium">
                  {step.description}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.detail}
                </p>

                {/* Hover Effect Line */}
                <div className="mt-6 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Card>
            </div>
          ))}
        </div>

        {/* Connection Lines for Desktop */}
        <div className="hidden lg:block relative mt-8">
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-16">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex-1 flex justify-center">
                <div className="w-32 h-0.5 bg-gradient-to-r from-indigo-200 to-purple-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
