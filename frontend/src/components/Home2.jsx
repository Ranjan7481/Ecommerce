import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setBestDeals, setSelectedProduct } from "../utils/productSlice";
import { addToCart } from "../utils/cartSlice";

import bookslogo from "../assets/books.png";
import furniturelogo from "../assets/furniture.png";
import handbaglogo from "../assets/handbag.png";
import sneakerslogo from "../assets/sneakers.png";
import techlogo from "../assets/tech.png";
import travellogo from "../assets/travel.png";

const categories = [
  { name: "Furniture", image: furniturelogo },
  { name: "Hand Bag", image: handbaglogo },
  { name: "Books", image: bookslogo },
  { name: "Tech", image: techlogo },
  { name: "Sneakers", image: sneakerslogo },
  { name: "Travel", image: travellogo },
];

const renderStars = (rating) => {
  const r = Number(rating || 0);
  const full = Math.floor(r);
  const half = r % 1 !== 0;
  return (
    <>
      {"★".repeat(full)}
      {half ? "½" : ""}
    </>
  );
};

const Home2 = () => {
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 3;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bestDeals = useSelector((state) => state.product.bestDeals || []);

  const fetchBestDeals = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/best-deals`, {
        withCredentials: true,
      });
      dispatch(setBestDeals(res.data.data || []));
      setCurrentPage(1); // reset page on fresh load
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load deals.");
    }
  };

  useEffect(() => {
    fetchBestDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  const totalPages = Math.max(1, Math.ceil(bestDeals.length / dealsPerPage));
  const indexOfLast = currentPage * dealsPerPage;
  const indexOfFirst = indexOfLast - dealsPerPage;
  const currentDeals = bestDeals.slice(indexOfFirst, indexOfLast);

  const goToNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const goToPrevious = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  return (
    <div className="bg-white mt-10 font-['Roboto'] px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-start mb-8">Shop Our Top Categories</h2>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-16">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <img src={cat.image} alt={cat.name} className="w-48 h-40 object-cover mx-auto" />
              <div className="absolute inset-1/2 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Header + errors */}
        <div className="border-t border-gray-300 pt-12">
          <h2 className="text-2xl font-bold text-start">Today's Best Deals For You!</h2>
          {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}

          {/* Deals grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-8">
            {currentDeals.map((prod) => {
              // ONLY backend image (base64 or URL). If none, render empty gray box.
              const image =
                prod?.productPhoto?.length > 100
                  ? `data:image/jpeg;base64,${prod.productPhoto}`
                  : prod?.image || null;

              const price = Number(prod.price || 0);
              const name = prod.ProductName || "Product";

              return (
                <div
                  key={prod._id}
                  onClick={() => {
                    dispatch(setSelectedProduct(prod));
                    navigate(`/product/${prod._id}`);
                  }}
                  className="cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-[260px] sm:h-[320px] bg-gray-100">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                        {/* no image */}
                      </div>
                    )}

                    {/* Quick add */}
                    <button
                      className="absolute top-3 right-3 text-gray-200/90 hover:text-white text-xl bg-black/30 hover:bg-black/40 rounded-full w-9 h-9 grid place-items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                          addToCart({
                            _id: prod._id,
                            name,
                            price,
                            image: image || "",
                          })
                        );
                      }}
                      title="Add to Cart"
                      aria-label="Add to Cart"
                    >
                      ♡
                    </button>
                  </div>

                  {/* Details */}
                  <div className="bg-white p-4">
                    <h3 className="text-sm text-gray-700 line-clamp-1">{name}</h3>

                    <p className="mt-1.5 tracking-wide text-gray-900 font-semibold">
                      ₹{price.toFixed(2)}
                    </p>

                    <div className="flex items-center mt-2 text-green-600 text-xs">
                      <span className="mr-2">{renderStars(prod.stars || 4)}</span>
                      <span className="text-gray-500">(121)</span>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <button
                        className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            addToCart({
                              _id: prod._id,
                              name,
                              price,
                              image: image || "",
                            })
                          );
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home2;
