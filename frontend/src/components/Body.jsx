import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Body = () => {
  return (
    <>
      <Navbar />
     
        <Outlet /> {/* This renders the current route's component */}
      <Footer />
    </>
  );
};

export default Body;
