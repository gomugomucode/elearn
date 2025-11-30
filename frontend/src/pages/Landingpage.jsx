// Landingpage.jsx
import CTC from "../sections/CTC";

import Hero from "../sections/Hero";
import Navbar from "../components/Navbar";
import Features from "../sections/Features";

const Landingpage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <CTC />
    </>
  );
};

export default Landingpage;