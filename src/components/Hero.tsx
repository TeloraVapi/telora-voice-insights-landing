
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-shift bg-[length:400%_400%]"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Turn post-purchase{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              silence
            </span>
            <br />
            into voice-powered{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              insight
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
            AI voice feedback that calls your customers after delivery.
            Get real insights, build loyalty, and turn feedback into growth.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 relative overflow-hidden group shadow-lg shadow-indigo-500/25"
              onClick={() => scrollToSection('login')}
            >
              <span className="relative z-10 flex items-center gap-2">
                Login with Shopify
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.25 6.5C14.11 6.5 14 6.39 14 6.25C14 6.11 14.11 6 14.25 6H17.75C17.89 6 18 6.11 18 6.25V9.75C18 9.89 17.89 10 17.75 10C17.61 10 17.5 9.89 17.5 9.75V6.81L10.15 14.15C10.06 14.24 9.94 14.24 9.85 14.15C9.76 14.06 9.76 13.94 9.85 13.85L17.19 6.5H14.25Z"/>
                </svg>
              </span>
              <div className="absolute inset-0 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              onClick={() => scrollToSection('how-it-works')}
            >
              See How it Works
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ArrowDown className="w-6 h-6 text-gray-400 mx-auto" />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-indigo-400 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-pink-400 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
    </section>
  );
};

export default Hero;
