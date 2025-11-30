
import { useState } from "react";
import "./Hero.css";
import { Link } from "react-router-dom";

const Hero = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-toggle" onClick={() => setFlipped(!flipped)}
          onDoubleClick={(e) => {
            e.preventDefault();
            alert("हुन त तपाईंले ५ पटक क्लिक गर्नुभयो, तर यो अहिले नै free होइन 😅");
          }}>
          <h1 className="hero-title">
            {flipped ? (
              <>
                Digital <span>सिकाइ</span>, Real <span>सफलता</span>
              </>
            ) : (
              <>
                Learn <span>Online</span>, Grow <span>हरेक दिन</span>
              </>
            )}
          </h1>
        </div>

        <p className="hero-subtitle">
          {flipped
            ? "पढ्ने बहानामा फोन चलाउने? हो, तर यो पल्ट class लाइभ छ!"
            : "From your couch to your career – master new skills anytime, anywhere, in any language."
          }
        </p>

        <div className="hero-buttons">
          
          <Link to='/login' className="hero-btn-primary">
            {flipped ? "सिकाइ सुरु गर्नुहोस् (अब फेसबुक स्क्रोल गर्ने बहाना छैन!)" : "Start Learning Now"}
          </Link>
          <button className="hero-btn-secondary">
            {flipped ? "मुक्त डेमो हेर्नुहोस् (झुटो भिडियो होइन, वास्तविक ज्ञान)" : "Watch Free Demo"}
          </button>
        </div>

        <p className="hero-footer">
          {flipped
            ? "पढाइ अब तपाईंको नानीको 'के गर्छस्?' भन्ने प्रश्नबाट मुक्ति हो। 😌"
            : "No deadlines. No stress. Just learning that fits your life. 🌱"}
        </p>
      </div>
    </section>
  );
};

export default Hero;

