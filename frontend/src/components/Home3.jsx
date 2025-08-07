import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setWeeklyPopular } from "../utils/productSlice";
import { addToCart } from "../utils/cartSlice";
import { BASE_URL } from "../utils/constant";

// Brand logos
import stapleslogo from "../assets/staples.png";
import sproutslogo from "../assets/sprouts.png";
import targetlogo from "../assets/target.png";
import grocerylogo from "../assets/grocery.png";
import mollielogo from "../assets/mollie.png";
import sportslogo from "../assets/sports.png";
import containerslogo from "../assets/container.png";
import bevmologo from "../assets/bevmo.png";

// Offer images (static banners)
import furniturelogo from "../assets/fur.png";
import bookslogo from "../assets/books.png";
import clotheslogo from "../assets/clothes.png";
import handbaglogo from "../assets/handbag.png";

// === BRANDS & DEALS ===
const brands = [
  { name: "Staples", logo: stapleslogo },
  { name: "Sprouts", logo: sproutslogo },
  { name: "Grocery outlet", logo: grocerylogo },
  { name: "Mollie stones", logo: mollielogo },
  { name: "Sports Basement", logo: sportslogo },
  { name: "Container Store", logo: containerslogo },
  { name: "Target", logo: targetlogo },
  { name: "Bevmo!", logo: bevmologo },
];

const deals = [
  { save: "$100", image: furniturelogo, bg: "bg-yellow-100" },
  { save: "$29", image: bookslogo, bg: "bg-red-100" },
  { save: "$67", image: clotheslogo, bg: "bg-rose-100" },
  { save: "$59", image: handbaglogo, bg: "bg-green-100" },
];

// Helpers
const getName = (p) => p?.name ?? p?.ProductName ?? "Product";
const getDesc = (p) => p?.description ?? "";
const getPrice = (p) => Number(p?.price ?? 0);
const getImage = (p) => {
  if (p?.productPhoto && p.productPhoto.length > 100) {
    return `data:image/jpeg;base64,${p.productPhoto}`;
  }
  return p?.image || null; // backend-only
};
const renderStars = (rating) => {
  const full = Math.floor(Number(rating || 0));
  const half = Number(rating || 0) % 1 !== 0;
  return (
    <>
      {"★".repeat(full)}
      {half ? "½" : ""}
    </>
  );
};

const Home3 = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const products = useSelector((state) => state.product.weeklyPopular || []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

  const fetchWeeklyDeals = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/weekly-popular`, {
        withCredentials: true,
      });
      dispatch(setWeeklyPopular(res.data?.data || []));
      setCurrentPage(1);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch deals");
    }
  };

  useEffect(() => {
    fetchWeeklyDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAdd = (prod) => {
    const payload = {
      _id: prod._id,
      name: getName(prod),
      price: getPrice(prod),
      image: getImage(prod) || "", // strict to backend
    };
    dispatch(addToCart(payload));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      {/* === BRAND SECTION === */}
      <h2 className="text-2xl font-bold mb-6">Choose By Brand</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-gray-100 rounded-lg px-4 py-3 hover:shadow-md transition"
          >
            <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain" />
            <div>
              <p className="font-semibold">{brand.name}</p>
              <p className="text-sm text-gray-500">Delivery within 24 hours</p>
            </div>
          </div>
        ))}
      </div>

      {/* === DEALS SECTION === */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Get Up To 70% Off</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {deals.map((deal, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow hover:shadow-md transition">
              <div className={`${deal.bg} p-4`}>
                <p className="text-sm font-medium">Save</p>
                <p className="text-3xl font-bold">{deal.save}</p>
                <p className="mt-2 font-semibold text-sm">
                  Explore Our Furniture & Home Furnishing Range
                </p>
              </div>
              <img src={deal.image} alt={`Deal ${index}`} className="w-full h-48 object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* === WEEKLY POPULAR PRODUCTS === */}
      <div className="mt-16">
        <h2 className="text-2xl font-extrabold text-start mb-6">Weekly Popular Products</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentItems.map((prod) => {
            const name = getName(prod);
            const price = getPrice(prod);
            const desc = getDesc(prod);
            const image = getImage(prod);

            return (
              <div
                key={prod._id}
                className="bg-gray-50 rounded-lg p-6 shadow hover:shadow-lg transition relative"
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                  onClick={() => onAdd(prod)}
                  title="Add to Cart"
                >
                  ♡
                </button>

                <div className="mb-4 relative h-48 bg-gray-100">
                  {image ? (
                    <img src={image} alt={name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                      {/* no image */}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-sm text-gray-600 mt-1">{desc}</p>
                <div className="flex items-center mt-2 text-green-500 text-sm">
                  {renderStars(prod.stars || 4)}
                  <span className="text-gray-500 ml-2">(121)</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold">₹{price}</span>
                  <button
                    className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100"
                    onClick={() => onAdd(prod)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* === PAGINATION CONTROLS === */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded ${
                  currentPage === p ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home3;
