import React from 'react';
import CategoryCard from '../components/CategoryCard';

const CategoriesSection = () => {
  const categories = [
    { title: 'Electrician', image: './images/electri.png' },
    { title: 'Plumber', image: './images/plumber.jpeg' },
    { title: 'Carpenter', image: './images/carpenter.jpeg' },
    { title: 'Cleaner', image: './images/cleaner.jpeg' }
  ];

  return (
    <section className="py-4 bg-green-500 text-center">
      <h2 className="text-2xl font-bold mb-8">Top Categories</h2>
      <div className="flex justify-center gap-8 flex-wrap">
        {categories.map((cat, i) => (
          <CategoryCard key={i} title={cat.title} image={cat.image} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
