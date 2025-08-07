import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../utils/cartSlice";
import { useNavigate, Link } from "react-router-dom";

const CartPage = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discountPct, setDiscountPct] = useState(0);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1), 0),
    [cartItems]
  );

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (code === "WELCOME10") setDiscountPct(10);
    else if (code === "FEST20") setDiscountPct(20);
    else setDiscountPct(0);
  };

  const discount = (subtotal * discountPct) / 100;
  const shipping = subtotal > 0 ? 49 : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  const handleQtyChange = (id, value) => {
    const qty = Math.max(1, Number(value) || 1);
    dispatch(updateQuantity({ id, quantity: qty }));
  };

  const dec = (id, current) => handleQtyChange(id, current - 1);
  const inc = (id, current) => handleQtyChange(id, current + 1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        {cartItems.length > 0 && (
          <button
            onClick={() => dispatch(clearCart())}
            className="text-sm text-red-600 hover:underline"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-gray-600">
          <p>Your cart is empty.</p>
          <Link
            to="/products"
            className="inline-block mt-4 text-indigo-600 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center justify-between bg-white shadow p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.image ||
                      (item.productPhoto?.length > 100
                        ? `data:image/jpeg;base64,${item.productPhoto}`
                        : "https://via.placeholder.com/96?text=No+Image")
                    }
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-gray-500">₹ {Number(item.price || 0).toFixed(2)}</p>
                    {item.size && (
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-xs text-gray-500">Color: {item.color}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  {/* Qty buttons */}
                  <div className="flex items-center">
                    <button
                      onClick={() => dec(item._id, item.quantity)}
                      className="px-2 py-1 border rounded-s text-sm"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQtyChange(item._id, e.target.value)}
                      className="w-16 px-2 py-1 border-y text-center"
                    />
                    <button
                      onClick={() => inc(item._id, item.quantity)}
                      className="px-2 py-1 border rounded-e text-sm"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Per-line total */}
                  <div className="text-right min-w-24">
                    <p className="text-sm text-gray-600">Line total</p>
                    <p className="font-semibold">
                      ₹ {(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon + Summary */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coupon */}
            <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3">Have a coupon?</h3>
              <div className="flex items-center gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon (WELCOME10 / FEST20)"
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Apply
                </button>
              </div>
              {discountPct > 0 && (
                <p className="text-green-700 text-sm mt-2">
                  Applied {discountPct}% off
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>- ₹ {discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹ {shipping.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>₹ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                disabled={cartItems.length === 0}
                onClick={() => navigate("/checkout", { state: { from: "cart" } })}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center mt-3 text-sm text-gray-600 hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
