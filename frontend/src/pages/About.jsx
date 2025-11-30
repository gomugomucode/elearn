import React from 'react';
import '../App.css';

export default function About() {
  return (
    <main className="page-container about-page">
      <h1>About Us</h1>

      <section className="about-hero">
        <div className="about-text">
          <h2>Our mission</h2>
          <p>
            We create accessible, high-quality online learning experiences that help learners build skills,
            gain confidence, and reach their goals. Our platform combines engaging content, hands-on exercises,
            and supportive instructors.
          </p>
        </div>
        <div className="about-image" aria-hidden="true">
          {/* Replace with a real image in assets and update the src */}
          <img src="/src/assets/placeholder-about.jpg" alt="Students learning together" />
        </div>
      </section>

      <section className="team">
        <h2>Meet the team</h2>
        <ul>
          <li><strong>Lead Instructor:</strong> Jane Doe — curriculum & course design</li>
          <li><strong>Developer:</strong> John Smith — platform engineering</li>
          <li><strong>Support:</strong> Support Team — student success</li>
        </ul>
      </section>

      <section className="values">
        <h2>Our values</h2>
        <ol>
          <li>Student-first design</li>
          <li>Continuous improvement</li>
          <li>Accessibility for all</li>
        </ol>
      </section>
    </main>
  );
}