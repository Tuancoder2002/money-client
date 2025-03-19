import React from "react";

const LandingSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white min-h-screen flex items-center">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Wellcome to Make Money</h1>
          <p className="text-lg md:text-xl mb-8">
            We built this template to help you create modern and beautiful marketing page.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <button className="bg-white text-blue-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition duration-200">
              Get it now
            </button>
            <button className="bg-transparent border border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-blue-500 transition duration-200">
              Features
            </button>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe1p_vb876ICfId00kqjwP55z-yxb_JJcjzA&s" alt="Landing Page Illustration" className="w-full max-w-md" />
        </div>
      </div>
    </div>
  );
};

export default LandingSection;