// src/sections/CTC.jsx
import "./CTC.css";

import { FaStar, FaRegStar, FaGem } from "react-icons/fa";
import { IoSparklesSharp } from "react-icons/io5";

const CTC = () => {
  return (
    <section className="ctc-section">
      <div className="ctc-container">
        {/* Image Side */}
        <div className="ctc-image-wrapper">
          <img
            src="/images/about-illustration.png"
            alt="Students learning online with digital devices"
            className="ctc-image"
          />
        </div>


        {/* Content Side */}
        <div className="ctc-content">
          <span className="ctc-badge">
  <IoSparklesSharp className="ctc-badge-icon" /> Trusted by 10,000+ Nepali Learners
</span>
          <h2 className="ctc-title">Our Mission</h2>
          <p className="ctc-paragraph">
            To empower every Nepali student with high-quality, affordable, and accessible digital education – no matter where they are.
          </p>
          <p className="ctc-paragraph">
            Whether you're preparing for board exams, entrance tests, or learning new tech skills, we're here to help you grow.
          </p>
          <button className="ctc-button">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default CTC;