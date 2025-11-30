// src/sections/Features.jsx
import "./Features.css";

// Import icons from react-icons
import { FaChalkboardTeacher, FaLaptop, FaComments } from "react-icons/fa";
import { GiTeacher, GiDiscussion } from "react-icons/gi";
import { MdOutlineAccessTime, MdOutlineOndemandVideo } from "react-icons/md";

const Features = () => {
  const features = [
    {
      title: "Expert-Led Courses",
      desc: "Learn from top educators and industry leaders with real-world experience.",
      icon: <FaChalkboardTeacher />,
    },
    {
      title: "Interactive Learning",
      desc: "Engage with quizzes, videos, and live doubt-clearing sessions.",
      icon: <GiDiscussion />,
    },
    {
      title: "Flexible Access",
      desc: "Study anytime, anywhere – on mobile, tablet, or laptop.",
      icon: <MdOutlineAccessTime />,
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-title">Why Choose Us?</h2>
        <p className="features-subtitle">
          We blend global standards with local understanding to make learning easy, fun, and effective.
        </p>

        <div className="features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-card-icon">{feat.icon}</div>
              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;