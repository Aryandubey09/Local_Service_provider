import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (category.trim() !== '') {
      navigate(`/category/${category.replace(/\s+/g, '-')}`);
    }
  };

  return (
    <section className="bg-blue-100 py-13 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Find Trusted Local Professionals</h1>
      <div className="flex justify-center gap-4 flex-wrap">
        <input
          type="text"
          placeholder="What service do you need?"
          className="px-4 py-2 rounded-md w-64"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
       
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-900 text-white px-6 py-2 rounded-md shadow-lg hover:from-blue-500 hover:to-blue-700 transition duration-300"
          onClick={handleSearch}
        >
          Search Now
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
