import React from 'react';

const PricingCards = () => {
  return (
    <div className="flex flex-col items-center space-y-12">
      <h1 className="text-4xl font-bold text-[#c0b081]">Pricing</h1>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 z-50">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-[#0270d7] via-[#0270d7] to-[#004a9e] shadow-lg rounded-lg px-8 pt-8 pb-10 text-center w-[20rem] h-[28rem] flex flex-col justify-between"> {/* Increase height and add flex classes */}
          <h2 className="text-2xl font-semibold mb-4 text-[#c0b081]">Free</h2>
          <div className="flex-grow"> 
           <ul className="list-none space-y-2 text-[#dcd0d0] w-full">
            <li className="text-base"><strong>Our default plan:</strong></li>
            <li className="text-base">5 Automated interviews per month</li>
            <li className="text-base">5 Psychometric assessments per month</li>
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
           <ul className="list-none space-y-2 text-[#dcd0d0] w-full">
            <li className="text-base"><strong>No need for contracts or commitments, only pay for what you use, as you use it:</strong></li>
            <li className="text-base">$2 per interview screening</li>
            <li className="text-base">$4 per psychometric assessment</li>
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
           <ul className="list-none space-y-2 text-[#dcd0d0] w-full">
            <li className="text-base"><strong>Looking for a bit more flexibility with higher screening volume? Contact us to find out more about our custom pricing:</strong></li>
            <li className="text-base">As low as $0.95 per interview screening</li>
            <li className="text-base">As low as $2.95 per psychometric assessment</li>
          </ul>
          </div>
          <button className="bg-[#444444] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#666666]">
            Inquire for details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingCards;
