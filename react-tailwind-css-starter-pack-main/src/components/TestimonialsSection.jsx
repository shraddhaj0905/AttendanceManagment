import React, { useState, useEffect } from 'react';

const Testimonial = ({ quote, name, role, image }) => (
  <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center card-hover">
    <div className="mb-6">
      <img 
        src={image} 
        alt={name} 
        className="w-20 h-20 rounded-full object-cover border-4 border-attendpurple-light"
      />
    </div>
    <blockquote className="text-gray-700 mb-4 italic">"{quote}"</blockquote>
    <div>
      <h4 className="font-bold">{name}</h4>
      <p className="text-gray-500 text-sm">{role}</p>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "AttendHub has revolutionized how we track attendance. No more paperwork and manual entries!",
      name: "Sarah Johnson",
      role: "High School Teacher",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "As a student, I love getting instant notifications about my attendance record. Very user-friendly!",
      name: "Michael Chen",
      role: "University Student",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "The analytics feature has helped us identify attendance patterns and improve student engagement.",
      name: "Dr. Emily Rodriguez",
      role: "University Professor",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <section id="testimonials" className="py-16 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See what our users have to say about AttendHub.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
        
        {/* Mobile Testimonial Slider (visible on small screens only) */}
        <div className="md:hidden mt-8">
          <div className="flex justify-center mb-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 mx-1 rounded-full ${
                  index === currentIndex ? 'bg-attendpurple' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <Testimonial {...testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;