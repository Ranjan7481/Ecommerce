import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { addOrder } from "../utils/orderSlice";
import { selectCartItems, clearCart } from "../utils/cartSlice";

const Checkout = () => {
  const { state } = useLocation(); // { from: "cart" } OR { product, quantity }
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((s) => s.user?.data || null);
  const cartItems = useSelector(selectCartItems);

  // Buy Now payload (if present)
  const singleProduct = state?.product || null;
  const singleQty = state?.quantity || 1;

  const isFromCart = state?.from === "cart";

  // Build checkout items (UI + payload source)
  const checkoutItems = useMemo(() => {
    if (isFromCart) {
      return cartItems.map((it) => ({
        product: it._id,
        name: it.name || it.ProductName || "Product",
        price: Number(it.price || 0),
        quantity: Number(it.quantity || 1),
        image:
          it.image ||
          (it.productPhoto?.length > 100
            ? `data:image/jpeg;base64,${it.productPhoto}`
            : undefined),
      }));
    }
    if (singleProduct) {
      return [
        {
          product: singleProduct._id,
          name: singleProduct.ProductName || singleProduct.name || "Product",
          price: Number(singleProduct.price || 0),
          quantity: Number(singleQty || 1),
          image:
            singleProduct.image ||
            (singleProduct.productPhoto?.length > 100
              ? `data:image/jpeg;base64,${singleProduct.productPhoto}`
              : undefined),
        },
      ];
    }
    return [];
  }, [isFromCart, cartItems, singleProduct, singleQty]);

  // If nothing to checkout, go back to cart
  useEffect(() => {
    if (checkoutItems.length === 0) navigate("/cart", { replace: true });
  }, [checkoutItems.length, navigate]);

  // Auth guard
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        replace: true,
        state: { from: "/checkout", checkoutState: state || null },
      });
    }
  }, [user, navigate, state]);

  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const itemsSubtotal = useMemo(
    () =>
      checkoutItems.reduce(
        (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1),
        0
      ),
    [checkoutItems]
  );

  const shipping = itemsSubtotal > 0 ? 49 : 0;
  const total = itemsSubtotal + shipping;

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!form.name?.trim()) return "Please enter your full name.";
    if (!form.phone?.trim() || !/^\d{10,}$/.test(form.phone.trim()))
      return "Please enter a valid phone number.";
    if (!form.address?.trim()) return "Please enter your address.";
    if (checkoutItems.length === 0) return "No items to checkout.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validateForm();
    if (errMsg) return alert(errMsg);

    const payload = {
      items: checkoutItems.map((it) => ({
        product: it.product,
        quantity: Number(it.quantity || 1),
      })),
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      },
    };

    try {
      const res = await axios.post(`${BASE_URL}/createOrders`, payload, {
        withCredentials: true,
      });
      if (isFromCart) dispatch(clearCart());
      dispatch(addOrder(res.data.order));
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Order creation failed:", err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to place order. Please try again."
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 my-10 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/* Items Summary */}
      <div className="mb-6 space-y-4">
        {checkoutItems.map((it) => (
          <div key={it.product} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={it.image || "https://via.placeholder.com/80x80?text=No+Image"}
                alt={it.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{it.name}</p>
                <p className="text-sm text-gray-600">
                  ₹ {Number(it.price || 0).toFixed(2)} × {it.quantity}
                </p>
              </div>
            </div>
            <div className="font-semibold">
              ₹ {(Number(it.price || 0) * Number(it.quantity || 1)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mb-6">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹ {itemsSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>₹ {shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base mt-2">
          <span>Total</span>
          <span>₹ {total.toFixed(2)}</span>
        </div>
      </div>

      {/* Address Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          rows={3}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
