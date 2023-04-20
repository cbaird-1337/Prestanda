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
      text: "Custom text for Feature 1",
    },
    {
      icon: featureIcon2,
      text: "Custom text for Feature 2",
    },
    {
      icon: featureIcon3,
      text: "Custom text for Feature 3",
    },
    {
      icon: featureIcon4,
      text: "Custom text for Feature 4",
    },
    {
      icon: featureIcon5,
      text: "Custom text for Feature 5",
    },
    {
      icon: featureIcon6,
      text: "Custom text for Feature 6",
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
