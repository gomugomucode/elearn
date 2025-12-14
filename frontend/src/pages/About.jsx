import React from "react";
import { Link } from "react-router-dom";

/* ---------- SVG ICONS ---------- */
const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

const UserAvatarIcon = ({ size = "w-14 h-14" }) => (
  <svg className={`${size} text-gray-400`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0113 0" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 6l-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h6l2-2" />
    <path d="M12 6l2-2h6a2 2 0 012 2v12a2 2 0 01-2 2h-6l-2-2" />
  </svg>
);

const InstructorIcon = () => (
  <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0113 0" />
  </svg>
);

const DeviceIcon = () => (
  <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8" />
  </svg>
);

export default function About() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16 min-h-screen bg-gradient-to-b from-indigo-50 to-white">

      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row items-center gap-12 mb-24">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            About <span className="text-indigo-600">Our E-Learning Platform</span>
          </h1>
          <p className="mt-6 text-xl text-gray-700 leading-relaxed">
            Empowering learners worldwide with high-quality, interactive online courses.
            Build real skills through expert-led content, hands-on projects, and a supportive
            community — all designed to fit your schedule and goals.
          </p>
          <Link to="/course">
            <button className="mt-8 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 shadow-lg transition transform hover:-translate-y-1">
              Explore Courses
            </button>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          {/* Hero Illustration */}
          <svg className="w-full max-w-lg h-96 text-indigo-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
            <path d="M11 12.98L3 9v6l8 4 8-4V9l-8 3.98z" />
          </svg>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="mb-24 py-12 bg-white rounded-3xl shadow-xl px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
        <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto text-center">
          To democratize education by making world-class learning accessible, affordable, and engaging for everyone — 
          from beginners to seasoned professionals. We believe flexible, high-impact education can transform lives.
        </p>
      </section>

      {/* FEATURES */}
      <section className="mb-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-center">
            <BookIcon />
            <h3 className="text-2xl font-semibold text-indigo-700 mt-4 mb-3">Interactive Courses</h3>
            <p className="text-gray-600 text-lg">
              Engaging content with quizzes, real-world projects, and collaborative assignments.
            </p>
          </div>
          <div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-center">
            <InstructorIcon />
            <h3 className="text-2xl font-semibold text-indigo-700 mt-4 mb-3">Expert Instructors</h3>
            <p className="text-gray-600 text-lg">
              Learn from industry leaders and seasoned professionals with proven expertise.
            </p>
          </div>
          <div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-center">
            <DeviceIcon />
            <h3 className="text-2xl font-semibold text-indigo-700 mt-4 mb-3">Flexible Learning</h3>
            <p className="text-gray-600 text-lg">
              Study anytime, anywhere, at your own pace — on any device.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mb-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What Our Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { name: "Sarah Mitchell", role: "Web Development Student" },
            { name: "Alex Rivera", role: "Data Science Student" },
            { name: "Emily Chen", role: "UI/UX Design Student" },
          ].map((user, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-lg flex flex-col">
              <div className="flex items-center mb-6">
                <UserAvatarIcon />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">{user.name}</h4>
                  <p className="text-indigo-600 text-sm">{user.role}</p>
                </div>
              </div>

              <p className="text-gray-700 italic flex-grow">
                “The structured courses and practical projects helped me gain confidence and job-ready skills.”
              </p>

              <div className="flex mt-4">
                {[...Array(5)].map((_, idx) => (
                  <StarIcon key={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-24">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            { q: "How do I enroll in a course?", a: "Browse our course catalog, choose a course, and click 'Enroll Now'. You can sign up or log in to begin learning." },
            { q: "Are the courses self-paced?", a: "Yes, all courses are fully self-paced so you can learn according to your schedule." },
            { q: "Do you offer certificates?", a: "Yes. After completing a course and final assessment, you receive a verifiable certificate." },
            { q: "What if I need help during a course?", a: "You can reach instructors, access discussion forums, and contact our support team anytime." },
            { q: "Can I access courses on mobile devices?", a: "Absolutely. Our platform works seamlessly on desktops, tablets, and smartphones." }
          ].map((faq, i) => (
            <details key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <summary className="px-8 py-6 text-lg font-semibold cursor-pointer hover:text-indigo-600">{faq.q}</summary>
              <div className="px-8 pb-6 text-gray-600">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* TEAM / INSTRUCTORS */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12">Meet Our Instructors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { name: "Jane Doe", role: "Senior Web Development Instructor" },
            { name: "John Smith", role: "Data Science & AI Mentor" },
            { name: "Support Team", role: "Student Guidance & Career Support" }
          ].map((teacher, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-lg text-center">
              <div className="flex justify-center mb-6">
                <UserAvatarIcon size="w-20 h-20" />
              </div>
              <h3 className="text-2xl font-semibold">{teacher.name}</h3>
              <p className="text-indigo-600 font-medium">{teacher.role}</p>
              <p className="text-gray-600 mt-3">
                Dedicated to helping students succeed through clear guidance and real-world knowledge.
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
