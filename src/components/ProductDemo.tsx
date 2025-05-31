
import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';

const ProductDemo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [waveformActive, setWaveformActive] = useState(false);

  const fullText = "AI is calling customer Sarah Chen...";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start the demo sequence
          setTimeout(() => {
            setWaveformActive(true);
            setIsTyping(true);
          }, 500);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('product-demo');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isTyping && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else if (typedText.length === fullText.length) {
      setTimeout(() => {
        setTypedText('');
        setIsTyping(false);
        setTimeout(() => setIsTyping(true), 1000);
      }, 3000);
    }
  }, [isTyping, typedText, fullText]);

  return (
    <section id="product-demo" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            See Telora in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how easy it is to get voice feedback from your customers
          </p>
        </div>

        {/* Mac Window Mockup */}
        <div className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="max-w-4xl mx-auto">
            {/* Window Chrome */}
            <div className="bg-gray-200 rounded-t-lg p-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1 text-center">
                <span className="text-sm text-gray-600">telora.ai/dashboard</span>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-white rounded-b-lg shadow-2xl p-8 min-h-[400px] relative overflow-hidden">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-navy-900">Customer Feedback Dashboard</h3>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Live Calls: 3 Active
                </div>
              </div>

              {/* Recent Calls */}
              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold text-gray-700">Recent Feedback Calls</h4>
                
                {/* Call Item 1 - Active */}
                <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-navy-900">Sarah Chen</p>
                        <p className="text-sm text-gray-600">Order #1247 • Wireless Headphones</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-indigo-600 font-medium">
                        {typedText}
                        {isTyping && <span className="animate-pulse">|</span>}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Started 2m ago</div>
                    </div>
                  </div>
                  
                  {/* Waveform Animation */}
                  {waveformActive && (
                    <div className="mt-4 flex items-center space-x-1">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-indigo-400 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 24 + 8}px`,
                            animationDelay: `${i * 100}ms`,
                            animationDuration: '1s'
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Call Item 2 - Completed */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-navy-900">Mike Johnson</p>
                        <p className="text-sm text-gray-600">Order #1246 • Running Shoes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-600 font-medium">Completed</div>
                      <div className="text-xs text-gray-500 mt-1">Positive feedback</div>
                    </div>
                  </div>
                </div>

                {/* Call Item 3 - Pending */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">⏱</span>
                      </div>
                      <div>
                        <p className="font-medium text-navy-900">Emma Wilson</p>
                        <p className="text-sm text-gray-600">Order #1245 • Coffee Maker</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 font-medium">Scheduled</div>
                      <div className="text-xs text-gray-500 mt-1">Tomorrow 2:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-500">847</div>
                    <div className="text-sm text-gray-600">Calls This Month</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">94%</div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-500">4.8★</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Phone = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

export default ProductDemo;
