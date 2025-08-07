import { useLocation, Link } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const { order } = state;

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl text-green-600 font-bold">Order Placed Successfully!</h1>
      <p>Order ID: {order._id}</p>
      <Link to="/orders" className="text-blue-600 underline">View Order History</Link>
    </div>
  );
};

export default OrderSuccess;
