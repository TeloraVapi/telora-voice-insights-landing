
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Sarah Martinez',
    role: 'E-commerce Manager',
    company: 'Urban Style Co.',
    content: "Telora helped us increase our customer satisfaction by 40%. The voice feedback is so much more personal than surveys.",
    rating: 5,
    avatar: '👩‍💼'
  },
  {
    name: 'Mike Chen',
    role: 'Founder',
    company: 'TechGear Plus',
    content: "We discovered product issues we never knew existed. Telora's insights helped us improve our products and reduce returns by 25%.",
    rating: 5,
    avatar: '👨‍💻'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Customer Success Lead',
    company: 'Wellness Brands',
    content: "The AI voice is incredibly natural. Our customers love sharing feedback this way, and we get 3x more responses than email surveys.",
    rating: 5,
    avatar: '👩‍🎨'
  }
];

const SocialProof = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Loved by E-commerce Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of merchants who are already getting better customer insights
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative h-64 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`absolute inset-0 p-8 transition-all duration-1000 ${
                  index === currentTestimonial
                    ? 'opacity-100 translate-x-0'
                    : index < currentTestimonial
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="text-center">
                  {/* Stars */}
                  <div className="flex justify-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl text-gray-700 mb-8 italic leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div className="text-left">
                      <div className="font-semibold text-navy-900">{testimonial.name}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                      <div className="text-indigo-500 font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial 
                    ? 'bg-indigo-500' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              ></button>
            ))}
          </div>
        </div>

        {/* Shopify Partner Badge */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-lg shadow-sm border">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#95BF47">
              <path d="M15.337 16.874c-.632 0-1.054-.397-1.054-1.109 0-.871.529-1.377 1.322-1.377.475 0 .817.133 1.054.264v2.222zm3.096-7.986c-.474-.132-.897-.198-1.32-.198-1.85 0-3.092 1.19-3.092 3.06 0 1.588.872 2.541 2.276 2.541.737 0 1.32-.264 1.793-.63v.397c0 .317.264.581.581.581.316 0 .58-.264.58-.581V8.888zm-5.91 7.458c-.501 0-.871-.264-.871-.712 0-.581.528-.845 1.322-.845.422 0 .845.066 1.268.198v.712c0 .581-.79.647-1.719.647zm2.699-1.454v-.581c0-1.455-.474-2.145-1.455-2.145-.712 0-1.241.264-1.663.712l-.369-.396c.529-.58 1.32-.977 2.223-.977 1.453 0 2.408 1.03 2.408 2.991v1.983c0 .316-.264.58-.58.58-.318 0-.564-.264-.564-.58zm-7.061.198c-.896 0-1.587-.423-1.587-1.322 0-.898.528-1.455 1.983-1.719.817-.132 1.319-.264 1.319-.58 0-.317-.264-.449-.713-.449-.58 0-.976.264-1.32.581l-.396-.449c.475-.475 1.109-.792 1.982-.792 1.056 0 1.72.58 1.72 1.454v2.937c0 .316-.264.58-.58.58-.317 0-.58-.264-.58-.58v-.198c-.317.449-.898.537-1.828.537z"/>
            </svg>
            <span className="text-gray-700 font-medium">Shopify Partner</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
