import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSearchResults } from "../utils/productSlice";

// Function to render stars
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  return (
    <>
      {"★".repeat(fullStars)}
      {halfStar ? "½" : ""}
    </>
  );
};

const Categories = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.product.searchResults);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7777/search/category?category=${category.toLowerCase()}`
        );
        dispatch(setSearchResults(res.data.data));
      } catch (err) {
        console.error("Error fetching category products:", err);
      }
    };

    fetchCategoryProducts();
  }, [category, dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-start mb-10 capitalize">
        {category} Products
      </h2>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {searchResults.map((prod) => (
            <div
              key={prod._id}
              className="bg-gray-50 rounded-lg p-6 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-end mb-4">
                <button className="text-gray-400 hover:text-gray-600 text-xl">
                  ♡
                </button>
              </div>
              <div className="mb-4">
                {prod?.colorVariants?.[0]?.photo && (
                  <img
                    src={
                      prod.colorVariants[0].photo.length > 100
                        ? `data:image/jpeg;base64,${prod.colorVariants[0].photo}`
                        : prod.colorVariants[0].photo.startsWith("/uploads/")
                        ? `http://localhost:5000${prod.colorVariants[0].photo}`
                        : "/default-avatar.png"
                    }
                    alt="Product"
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>
              <h3 className="text-lg font-semibold">{prod.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{prod.description}</p>
              <div className="flex items-center mt-2 text-green-500 text-sm">
                {renderStars(prod.stars)}
                <span className="text-gray-500 ml-2">(121)</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold">{prod.price}</span>
                <button className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
};

export default Categories;
