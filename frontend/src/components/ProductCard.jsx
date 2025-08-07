import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductCard = () => {
  const product = useSelector((state) => state.product?.selectedProduct || null);
  const authUser = useSelector((state) => state.user?.data || null);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState("");

  const stock = useMemo(() => {
    const n = Number(product?.stock ?? 0);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [product]);

  const isOutOfStock = stock === 0;

  const isLoggedIn = Boolean(authUser) || Boolean(localStorage.getItem("token"));

  const handleBuyNow = () => {
    if (!product) return;
    if (!quantity) return;

    const qty = parseInt(quantity, 10);
    if (!Number.isFinite(qty) || qty <= 0) return;

    // Save user intent (so after login we can restore exactly this checkout)
    localStorage.setItem(
      "redirectAfterLogin",
      JSON.stringify({
        pathname: "/checkout",
        product,
        quantity: qty,
      })
    );

    if (!isLoggedIn) {
      // Not logged in → go to login
      navigate("/login");
      return;
    }

    // Logged in → go to checkout with state
    navigate("/checkout", { state: { product, quantity: qty } });
  };

  if (!product) {
    return <p className="text-center mt-10">No product selected.</p>;
  }

  const displayImage =
    product.productPhoto && product.productPhoto.length > 100
      ? `data:image/jpeg;base64,${product.productPhoto}`
      : "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white shadow-xl rounded-2xl overflow-hidden transition hover:scale-[1.02] duration-200">
      <div className="flex flex-col md:flex-row">
        <img
          src={displayImage}
          alt={product.ProductName || "Product"}
          className="w-full md:w-1/2 h-64 object-contain bg-gray-100"
        />

        <div className="p-6 flex flex-col justify-between w-full">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {product.ProductName || "Unnamed Product"}
            </h2>

            {product.description ? (
              <p className="text-sm text-gray-500 mb-3">{product.description}</p>
            ) : (
              <p className="text-sm text-gray-400 mb-3">No description.</p>
            )}

            <p className="text-xl font-semibold text-green-600 mb-1">
              ₹{Number(product.price ?? 0)}
            </p>
            <p className="text-sm text-gray-600 mb-4">Available stock: {stock}</p>

            {isOutOfStock ? (
              <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select</option>
                  {Array.from({ length: stock }, (_, i) => i + 1).map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock || !quantity}
            className={`mt-6 w-full py-2 rounded text-white font-medium transition ${
              isOutOfStock || !quantity
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isOutOfStock ? "Unavailable" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
