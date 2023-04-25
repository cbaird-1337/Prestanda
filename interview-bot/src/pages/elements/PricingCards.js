import React from 'react';

const PricingCards = () => {
  return (
    <div className="flex flex-col items-center space-y-12">
      <h1 className="text-5xl font-bold text-[#e6e4df]">Pricing</h1>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 z-50">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-[#0270d7] via-[#0270d7] to-[#004a9e] shadow-lg rounded-lg px-8 pt-8 pb-10 text-center w-[20rem] h-[28rem] flex flex-col justify-between"> {/* Increase height and add flex classes */}
          <h2 className="text-2xl font-semibold mb-4 text-[#c0b081]">Free</h2>
          <div className="flex-grow"> 
           <ul className="list-none space-y-2 text-[#dcd0d0] w-full" style={{listStyleType: 'disc'}}>
            <li className="text-base text-black"><strong>Our default 'free forever' plan:</strong></li>
            <li className="text-base">* 5 Automated interviews /month</li>
            <li className="text-base">* 5 Psychometric assessments /month</li>
            <li className="text-base">* Candidate job fit recommendations</li>
            <li className="text-base">* Psychometric assessment reports</li>
          </ul>
          </div>
          <button className="bg-[#444444] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#666666]">
            Get Started
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-br from-[#0270d7] via-[#0270d7] to-[#004a9e] shadow-lg rounded-lg px-8 pt-8 pb-10 text-center w-[20rem] h-[28rem] flex flex-col justify-between"> {/* Increase height and add flex classes */}
          <h2 className="text-2xl font-semibold mb-4 text-[#c0b081]">Pay as you Go</h2>
          <div className="flex-grow"> 
           <ul className="list-none space-y-2 text-[#dcd0d0] w-full" style={{listStyleType: 'disc'}}>
            <li className="text-base text-black"><strong>No need for contracts or commitments, only pay for what you use, as you use it:</strong></li>
            <li className="text-base">* $2 /interview screening</li>
            <li className="text-base">* $4 /psychometric assessment</li>
            <li className="text-base">* Candidate job fit recommendations</li>
            <li className="text-base">* Psychometric assessment report</li>
          </ul>
          </div>
          <button className="bg-[#444444] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#666666]">
            Get Started
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-br from-[#0270d7] via-[#0270d7] to-[#004a9e] shadow-lg rounded-lg px-8 pt-8 pb-10 text-center w-[20rem] h-[28rem] flex flex-col justify-between"> {/* Increase height and add flex classes */}
          <h2 className="text-2xl font-semibold mb-4 text-[#c0b081]">Monthly or Annual Commit</h2>
          <div className="flex-grow"> 
           <ul className="list-none space-y-2 text-[#dcd0d0] w-full" style={{listStyleType: 'disc'}}>
            <li className="text-base text-black"><strong>Looking for more flexibility with higher screening volumes? Contact us below:</strong></li>
            <li className="text-base">* As low as $0.95 /interview screening</li>
            <li className="text-base">* As low as $2.95 /psychometric assessment</li>
          </ul>
          </div>
          <button className="bg-[#444444] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#666666]">
            Inquire for Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingCards;
