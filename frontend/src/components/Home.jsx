// pages/Home.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setSelectedProduct } from "../utils/productSlice";
import { BASE_URL } from "../utils/constant";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/allproducts`, {
          withCredentials: true,
        });
        dispatch(setProducts(res.data.data));
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchAllProducts();
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    product.ProductName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              onClick={() => dispatch(setSelectedProduct(product))}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
            >
              <img
                src={
                  product.productPhoto?.length > 100
                    ? `data:image/jpeg;base64,${product.productPhoto}`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={product.ProductName}
                className="w-full h-52 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {product.ProductName}
              </h2>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-bold text-lg">
                  ₹{product.price}
                </span>
                <span
                  className={`text-sm font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-600">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
