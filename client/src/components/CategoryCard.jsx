import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CategoryCard = ({ title, image, description }) => {
  const defaultImage = "https://via.placeholder.com/150/cccccc/ffffff?text=" + encodeURIComponent(title);

  return (
    <Link 
      to={`/category/${title.toLowerCase()}`} 
      className="group block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
      aria-label={`Browse ${title} services`}
    >
      <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100">
        <div className="relative overflow-hidden rounded-lg mb-3 pt-[75%]">
          <img
            src={image || defaultImage}
            alt={`${title} category`}
            className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="flex-grow">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
          {description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center text-blue-600 mt-auto">
          <span className="text-sm font-medium">Explore</span>
          <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
