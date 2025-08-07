import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get("/api/orders", { withCredentials: true });
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Your Orders</h1>
      {orders.map(order => (
        <div key={order._id} className="border p-3 my-2">
          <p>Order ID: {order._id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.totalAmount}</p>
          <Link to={`/orders/${order._id}`} className="text-blue-600 underline">View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
