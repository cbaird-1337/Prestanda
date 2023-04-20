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
      title: "Automated Screening",
      text: "Automated first call phone or chat based interview screening",
    },
    {
      icon: featureIcon2,
      title: "Customized Questions",
      text: "Generate unique interview questions catered specifically to your role, and to each candidates background",
    },
    {
      icon: featureIcon3,
      title: "Job Fit Analysis",
      text: "Automated job fit recommendations provided by our system that rate the candidates fit based on your unique job description",
    },
    {
      icon: featureIcon4,
      title: "User-Friendly",
      text: "Easy, simple to use interface that doesnt overwhelm with features. We do what we say, and we do it well!",
    },
    {
      icon: featureIcon5,
      title: "Flexible Pricing",
      text: "Pay as you go pricing model, no contracts or obligations (bulk discounts are available upon inquiry)",
    },
    {
      icon: featureIcon6,
      title: "Integrations",
      text: "We integrate with your preferred candidate tracking system to help you more easily track and manage your job candidates",
    },
  ];

  return (
    <section className="features section">
      <div className="container">
        <div className="features-inner section-inner has-bottom-divider">
          <div className="features-wrap">
            {featureItems.map(({ icon, title, text }, index) => (
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
                    <h4 className="feature-title mt-24 features-white-text feature-title-text">{title}</h4>
                    <p className="text-sm mb-0 features-white-text">{text}</p>
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
