import React from 'react';
import { Link } from 'react-router-dom';

const PricingCards = () => {
  return (
    <div className="flex flex-col items-center space-y-12">
      <h1 className="text-4xl font-bold text-[#b3b2af]">Pricing</h1>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 z-50">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-[#0270d7] via-[#0270d7] to-[#004a9e] shadow-lg rounded-sm px-8 pt-8 pb-10 text-center w-[20rem] h-[28rem] flex flex-col justify-between"> {/* Increase height and add flex classes */}
          <h2 className="text-3xl font-semibold mb-4 text-[#c0b081]">FREE</h2>
          <div className="flex-grow flex items-center justify-center">
            <ul className="list-none space-y-2 text-[#dcd0d0] w-full" style={{listStyleType: 'disc'}}>
                <li className="text-base"> 5 Automated screening calls /month</li>
                <li className="text-base"> 5 Psychometric assessments /month</li>
                <li className="text-base"> Job fit recommendations</li>
                <li className="text-base"> Psychometric assessment reports</li>
            </ul>
            </div>
          <Link to="/Signup" className="bg-[#444444] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#666666] block text-center">
             Get Started
          </Link>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-br from-[#0270d7] via-[#0270d7] to-[#004a9e] shadow-lg rounded-sm px-8 pt-8 pb-10 text-center w-[20rem] h-[28rem] flex flex-col justify-between"> {/* Increase height and add flex classes */}
          <h2 className="text-3xl font-semibold mb-4 text-[#c0b081]">Pay As You Go</h2>
          <div className="flex-grow flex items-center justify-center">
            <ul className="list-none space-y-2 text-[#dcd0d0] w-full" style={{listStyleType: 'disc'}}>
                <li className="text-base"> $1.95 per automated screening call</li>
                <li className="text-base"> $3.95 per psychometric assessment</li>
                <li className="text-base"> Job fit recommendations</li>
                <li className="text-base"> Psychometric assessment report</li>
            </ul>
            </div>
          <Link to="/Signup" className="bg-[#444444] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#666666] block text-center">
            Get Started
          </Link>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-br from-[#0270d7] via-[#0270d7] to-[#004a9e] shadow-lg rounded-sm px-8 pt-8 pb-10 text-center w-[20rem] h-[28rem] flex flex-col justify-between"> {/* Increase height and add flex classes */}
          <h2 className="text-3xl font-semibold mb-4 text-[#c0b081]">Monthly or Annual Commit</h2>
          <div className="flex-grow flex items-center justify-center">
            <ul className="list-none space-y-2 text-[#dcd0d0] w-full" style={{listStyleType: 'disc'}}>
                <li className="text-base"> Discounts applied in per-month increments of 250 calls or assessments</li>
                <li className="text-base"> As low as $1 per call screening</li>
                <li className="text-base"> As low as $3 per psychometric assessment</li>
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
