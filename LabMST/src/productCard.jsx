import React from "react";

const ProductCard = ({ name, price, description, instock }) => {
   return (
      <div className="min-w-[320px] max-w-lg w-full rounded p-6 bg-white">
         <h2 className="text-2xl font-semibold mb-2">{name}</h2>
         <p className="text-lg text-gray-700 mb-4">Price: ${price}</p>
         <p className="text-sm text-gray-500 mb-6">{description}</p>

         {instock ? (
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
               Buy Now
            </button>
         ) : (
            <p className="text-red-500 text-sm">Out of Stock</p>
         )}
      </div>
   );
};

export default ProductCard;
