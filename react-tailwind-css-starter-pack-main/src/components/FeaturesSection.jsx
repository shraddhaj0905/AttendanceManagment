import React from 'react';

const Feature = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-md p-6 card-hover">
    <div className="w-12 h-12 rounded-full bg-attendblue-light flex items-center justify-center mb-4">
      <span className="text-attendblue">{icon}</span>
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: "📊",
      title: "Real-time Tracking",
      description: "Track attendance in real-time with instant updates for both teachers and students."
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Access your attendance records from any device, anywhere and anytime."
    },
    {
      icon: "📈",
      title: "Detailed Analytics",
      description: "Get comprehensive reports and insights on attendance patterns."
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      description: "Automated alerts for absence patterns and attendance issues."
    },
    {
      icon: "👥",
      title: "Easy Integration",
      description: "Seamlessly integrates with existing school management systems."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Enhanced security measures to protect student and faculty data."
    }
  ];

  return (
    <section id="features" className="py-16 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our attendance management system comes with everything you need for efficient and accurate tracking.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
