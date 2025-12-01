import React from 'react';

export default function About() {
  return (
    <main className="pt-24 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-20 py-16 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">About Us</h1>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We create accessible, high-quality online learning experiences that help learners build skills,
            gain confidence, and reach their goals. Our platform combines engaging content, hands-on exercises,
            and supportive instructors.
          </p>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="/src/assets/about.jpg"
            alt="Students learning together"
            className="rounded-lg shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 lg:px-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl mb-2">Jane Doe</h3>
              <p className="text-gray-600">Lead Instructor — Curriculum & Course Design</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl mb-2">John Smith</h3>
              <p className="text-gray-600">Developer — Platform Engineering</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl mb-2">Support Team</h3>
              <p className="text-gray-600">Student Success & Assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-6 lg:px-20 py-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Values</h2>
        <ol className="list-decimal list-inside space-y-4 text-gray-700 text-lg">
          <li><span className="font-semibold">Student-first design:</span> Prioritize learners in every decision.</li>
          <li><span className="font-semibold">Continuous improvement:</span> Constantly enhance courses and platform.</li>
          <li><span className="font-semibold">Accessibility for all:</span> Ensure everyone can learn without barriers.</li>
        </ol>
      </section>
    </main>
  );
}
