import React from "react";
import homelogo from "../assets/home.png"; // Make sure this is the exact image shown

const Home1 = () => {
  return (
    <div className="w-full bg-gradient-to-b from-[#d3effb] to-[#fdfefe]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 py-12">
        {/* Left Text Section */}
        <div className="max-w-xl text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 leading-tight">
            Shopping And <br />
            Department Store.
          </h1>
          <p className="text-gray-600 text-md mt-4">
            Shopping is a bit of a relaxing hobby for me, which <br />
            is sometimes troubling for the bank balance.
          </p>
          <button className="mt-6 px-6 py-2 rounded-full bg-green-900 text-white font-semibold text-sm hover:bg-green-800 transition">
            Learn More
          </button>
        </div>

        {/* Right Image Section */}
        <div className="w-full md:w-1/2">
          <img src={homelogo} alt="Shopping Display" className="w-full h-auto object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Home1;
