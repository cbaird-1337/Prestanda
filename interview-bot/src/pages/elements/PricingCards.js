import React from 'react';

const PricingCards = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 z-10">
      {/* Card 1 */}
      <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-lg rounded-lg px-8 pt-6 pb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Free</h2>
        <ul className="list-none space-y-2 mb-6">
          <li className="text-base">5 automated interviews per month</li>
          <li className="text-base">5 psychometric assessments per month</li>
        </ul>
        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500">
          Get Started
        </button>
      </div>
      
      {/* Card 2 */}
      <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-lg rounded-lg px-8 pt-6 pb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Pay as you go</h2>
        <ul className="list-none space-y-2 mb-6">
          <li className="text-base">$2 per interview screening</li>
          <li className="text-base">$4 per psychometric assessment</li>
        </ul>
        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500">
          Get Started
        </button>
      </div>

      {/* Card 3 */}
      <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-lg rounded-lg px-8 pt-6 pb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Monthly or Annual Commit</h2>
        <ul className="list-none space-y-2 mb-6">
          <li className="text-base">As low as $0.95 per interview screening</li>
          <li className="text-base">As low as $2.95 per psychometric assessment</li>
        </ul>
        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500">
          Inquire for details
        </button>
      </div>
    </div>
  );
};

export default PricingCards;
