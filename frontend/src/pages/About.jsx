import React from "react";
import image1 from "../assets/images.jpg";


export default function About() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 min-h-screen">

      {/* TOP HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center gap-10 mb-20">
        {/* LEFT TEXT */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            About <span className="text-indigo-600">Our E-Learning Platform</span>
          </h1>

          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            We provide high-quality online courses designed to help learners build skills,
            gain confidence, and achieve career success. Our platform combines interactive
            content, real-world projects, and expert guidance to make learning effective
            and enjoyable.
          </p>

          <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-md transition">
            Explore Courses
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 flex justify-center">
          <img
            src={image1}
            alt="Students learning online"
            className="w-full max-w-md"
          />
        </div>
      </section>

      {/* OUR MISSION SECTION */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
          Our mission is to make world-class education accessible to everyone. Whether you’re
          a beginner or a working professional, we aim to empower you with skills that matter.
          We believe learning should be flexible, affordable, and engaging.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">What We Offer</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white border rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Interactive Courses</h3>
            <p className="text-gray-600">
              Courses designed with quizzes, assignments, and real-world projects.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Skilled Instructors</h3>
            <p className="text-gray-600">
              Learn from industry professionals with real experience.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Flexible Learning</h3>
            <p className="text-gray-600">
              Access your courses anytime, anywhere, at your own pace.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet the Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          <div className="text-center bg-white p-6 border rounded-2xl shadow-md">
            <img
              src="https://cdn-icons-png.flaticon.com/512/194/194938.png"
              alt="Lead Instructor"
              className="w-28 h-28 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">Jane Doe</h3>
            <p className="text-indigo-600 font-medium">Lead Instructor</p>
            <p className="text-gray-600 mt-2 text-sm">
              Expert in course design and curriculum development.
            </p>
          </div>

          <div className="text-center bg-white p-6 border rounded-2xl shadow-md">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Developer"
              className="w-28 h-28 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">John Smith</h3>
            <p className="text-indigo-600 font-medium">Full-Stack Developer</p>
            <p className="text-gray-600 mt-2 text-sm">
              Handles platform features, user experience, and performance.
            </p>
          </div>

          <div className="text-center bg-white p-6 border rounded-2xl shadow-md">
            <img
              src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
              alt="Support Team"
              className="w-28 h-28 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">Support Team</h3>
            <p className="text-indigo-600 font-medium">Student Assistance</p>
            <p className="text-gray-600 mt-2 text-sm">
              Helping students with course questions, accounts, and more.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
