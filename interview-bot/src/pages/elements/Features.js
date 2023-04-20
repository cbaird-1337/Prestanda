import React from "react";
import "./Features.css";
import "./scroll-animation.css";
import ScrollTrigger from "react-scroll-trigger";
import featureIcon1 from "./images/feature-icon-01.svg";
import featureIcon2 from "./images/feature-icon-02.svg";
import featureIcon3 from "./images/feature-icon-03.svg";
import featureIcon4 from "./images/feature-icon-04.svg";
import featureIcon5 from "./images/feature-icon-05.svg";
import featureIcon6 from "./images/feature-icon-06.svg";

const Features = () => {
  const onEnterViewport = (id) => {
    document.getElementById(id).classList.add("is-revealing");
  };

  const featureItems = [
    {
      icon: featureIcon1,
      text: "Automated first call interview screening",
    },
    {
      icon: featureIcon2,
      text: "Generate unique interview questions catered specifically to your role, and to each candidates background",
    },
    {
      icon: featureIcon3,
      text: "Automated job fit recommendations",
    },
    {
      icon: featureIcon4,
      text: "Easy, simple to use interface",
    },
    {
      icon: featureIcon5,
      text: "Pay as you go",
    },
    {
      icon: featureIcon6,
      text: "Integrate with your preferred candidate tracking system",
    },
  ];

  return (
    <section className="features section">
      <div className="container">
        <div className="features-inner section-inner has-bottom-divider">
          <div className="features-wrap">
            {featureItems.map(({ icon, text }, index) => (
              <ScrollTrigger
                key={index}
                onEnter={() => onEnterViewport(`feature-${index}`)}
              >
                <div
                  className={`feature text-center`}
                  id={`feature-${index}`}
                >
                  <div className="feature-inner">
                    <div className="feature-icon">
                      <img src={icon} alt={`Feature ${index + 1}`} />
                    </div>
                    <h4 className="feature-title mt-24">Be Productive</h4>
                    <p className="text-sm mb-0">{text}</p>
                  </div>
                </div>
              </ScrollTrigger>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
