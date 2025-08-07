// src/components/Home4.jsx
import React, { useEffect, useState } from "react";
import cardlogo from "../assets/card.png";
import img1logo from "../assets/img1.png";
import img2logo from "../assets/img2.png";
import img3logo from "../assets/img.png";
import { BASE_URL } from "../utils/constant";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMostSelling, setTrending } from "../utils/productSlice";
import { addToCart } from "../utils/cartSlice";

const services = [
  { title: "Frequently Asked Questions", description: "Updates on safe Shopping in our Stores", image: img1logo },
  { title: "Online Payment Process", description: "Updates on safe Shopping in our Stores", image: img2logo },
  { title: "Home Delivery Options", description: "Updates on safe Shopping in our Stores", image: img3logo },
];

// Helpers (backend-only images)
const getName = (p) => p?.name ?? p?.ProductName ?? "Product";
const getDesc = (p) => p?.description ?? "";
const getPrice = (p) => Number(p?.price ?? 0);
const getImage = (p) => {
  if (p?.productPhoto && p.productPhoto.length > 100) {
    return `data:image/jpeg;base64,${p.productPhoto}`;
  }
  return p?.image || null; // backend-only
};

const Home4 = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const mostSelling = useSelector((state) => state.product.mostSelling || []);
  const trending = useSelector((state) => state.product.trending || []);

  const [mostPage, setMostPage] = useState(1);
  const [trendPage, setTrendPage] = useState(1);
  const itemsPerPage = 3;

  const fetchMostSelling = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/most-selling`, { withCredentials: true });
      dispatch(setMostSelling(res.data?.data || []));
      setMostPage(1);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch most selling products");
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/trending`, { withCredentials: true });
      dispatch(setTrending(res.data?.data || []));
      setTrendPage(1);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch trending products");
    }
  };

  useEffect(() => {
    fetchMostSelling();
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const onAddToCart = (prod) => {
    const payload = {
      _id: prod._id,
      name: getName(prod),
      price: getPrice(prod),
      image: getImage(prod) || "", // strict to backend
    };
    dispatch(addToCart(payload));
  };

  const ProductCards = ({ data }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {data.map((prod) => {
        const name = getName(prod);
        const price = getPrice(prod);
        const desc = getDesc(prod);
        const image = getImage(prod);
        return (
          <div key={prod._id} className="bg-gray-100 p-6 rounded-lg relative hover:shadow-lg transition">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => onAddToCart(prod)}
              title="Add to Cart"
            >
              ♡
            </button>

            <div className="flex justify-center mb-4 relative h-48 bg-gray-100">
              {image ? (
                <img src={image} alt={name} className="h-full object-contain" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  {/* no image */}
                </div>
              )}
            </div>

            <h3 className="text-md font-semibold text-gray-800 mb-1">{name}</h3>
            <p className="text-sm text-gray-600 mb-2">{desc}</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900">₹{price}</p>
              <button
                className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100"
                onClick={() => onAddToCart(prod)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const Pagination = ({ page, setPage, totalItems }) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${page === p ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white font-['Roboto']">
      {/* Cashback */}
      <div className="bg-orange-100 py-10 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Get 5% Cash Back</h2>
          <p className="text-lg text-gray-600 mb-4">on Shopcart.com</p>
          <button className="bg-green-700 text-white px-6 py-2 rounded-full text-md hover:bg-green-800">
            Learn More
          </button>
        </div>
        <div><img src={cardlogo} alt="Shopcart Card" className="w-72 md:w-80" /></div>
      </div>

      {/* Most Selling */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Most Selling Products</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ProductCards data={paginate(mostSelling, mostPage)} />
        <Pagination page={mostPage} setPage={setMostPage} totalItems={mostSelling.length} />
      </div>

      {/* Trending */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Products for you!</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ProductCards data={paginate(trending, trendPage)} />
        <Pagination page={trendPage} setPage={setTrendPage} totalItems={trending.length} />
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Services To Help You Shop</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg overflow-hidden shadow hover:shadow-md transition">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{s.description}</p>
              </div>
              <img src={s.image} alt={s.title} className="w-full h-48 object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home4;
