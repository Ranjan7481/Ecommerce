// src/components/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant"; // use your BASE_URL
import { useDispatch } from "react-redux";
import { removeOrder } from "../utils/orderSlice";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelMsg, setCancelMsg] = useState("");
  const [removing, setRemoving] = useState({});
  const dispatch = useDispatch();
  // { [orderId]: true }

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/orders`, {
        withCredentials: true,
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/orders/${orderId}`, {
        withCredentials: true,
      });
      setTimeout(() => {
        dispatch(removeOrder(orderId));
      }, 2000);

      setCancelMsg(res.data?.message || "Order cancelled");
    } catch (err) {
      console.error("Cancel error:", err.response?.data || err.message);
      setCancelMsg(err.response?.data?.error || "Failed to cancel order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-4">Loading orders...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Your Orders</h1>
      {cancelMsg && <p className="text-red-600 mb-4">{cancelMsg}</p>}

      {!orders.length ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 mb-6 rounded shadow bg-white"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-3">
              <div>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹{order.totalAmount}
                </p>
                <p className="text-sm text-gray-500">
                  Placed: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* ✅ Customer (shipping/contact) details */}
              <div className="md:text-right">
                <p className="font-semibold">Shipping Details</p>
                <p>{order.customer?.name || "-"}</p>
                <p>{order.customer?.phone || "-"}</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {order.customer?.address || "-"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2">Items</p>
              <div className="space-y-2">
                {order.items?.map((it) => (
                  <div key={it._id} className="ml-1">
                    <p>
                      🔹 {it.product?.ProductName || "Unknown"} — Qty:{" "}
                      {it.quantity} — ₹{it.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {order.status === "pending" && (
              <button
                className={`mt-4 px-4 py-2 rounded text-white ${
                  removing[order._id]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={() => cancelOrder(order._id)}
                disabled={!!removing[order._id]}
              >
                {removing[order._id] ? "Cancelling…" : "Cancel Order"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderDetails;
