import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginSignup from "./components/LoginSignup";
import Home from "./components/Home"; // optional
import ProductCard from "./components/ProductCard";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/Checkout";
import ProfilePage from "./components/ProfilePage";
import ProductAdmin from "./components/ProductAdmin";
import AddProductForm from "./components/AddProductForm";
import EditProduct from "./components/EditProduct";
import Home1 from "./components/Home1";
import Home2 from "./components/Home2";
import Home3 from "./components/Home3";
import Home4 from "./components/Home4";
import Body from "./components/Body"; // layout with navbar/footer
import Categories from "./components/Categories";
import AllHomeSections from "./components/AllHomeSections";

import OrderSuccess from "./components/OrderSuccess";
import OrderHistory from "./components/OrderHistory";
import OrderDetails from "./components/OrderDetails";

import { Provider } from "react-redux";
import appStore from "./utils/appStore";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          {/* Shared layout */}
          <Route path="/" element={<Body />}>
            <Route index element={<AllHomeSections />} />
            <Route path="product/:id" element={<ProductCard />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="addproduct" element={<AddProductForm />} />
            <Route path="editproduct/:id" element={<EditProduct />} />
            <Route path="productadmin" element={<ProductAdmin />} />
            <Route path="category/:category" element={<Categories />} />

            {/* 🆕 Orders related routes */}
         
            <Route path="/orders" element={<OrderDetails />} />

            {/* Optional individual home sections */}
            <Route path="home1" element={<Home1 />} />
            <Route path="home2" element={<Home2 />} />
            <Route path="home3" element={<Home3 />} />
            <Route path="home4" element={<Home4 />} />

            {/* Catch-all */}
            <Route path="*" element={<h1 className="text-center mt-10 text-2xl">404 - Page Not Found</h1>} />
          </Route>

          {/* Routes without layout */}
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
