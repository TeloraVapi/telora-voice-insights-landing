
import React from 'react';

const platforms = [
  { name: 'WooCommerce', logo: '🛒' },
  { name: 'BigCommerce', logo: '🏪' },
  { name: 'Amazon', logo: '📦' },
  { name: 'Magento', logo: '🎯' },
  { name: 'Squarespace', logo: '⬜' },
  { name: 'Wix', logo: '🌐' }
];

const FuturePlatforms = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-navy-900 mb-4">Coming Soon</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expanding to more e-commerce platforms to serve businesses everywhere
          </p>
        </div>

        {/* Scrolling Platform Logos */}
        <div className="relative overflow-hidden">
          <div className="flex space-x-12 animate-marquee">
            {[...platforms, ...platforms].map((platform, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 opacity-50 hover:opacity-75 transition-opacity duration-200 flex-shrink-0"
              >
                <div className="text-4xl filter grayscale">
                  {platform.logo}
                </div>
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default FuturePlatforms;
