import React from "react";
import { MdLocalGroceryStore } from "react-icons/md";

import amazonlogo from "../assets/amazon.png";
import gogglepaylogo from "../assets/gpay.png";
import razorpaylogo from "../assets/razor.png";
import stripelogo from "../assets/stripe.png";
import visalogo from "../assets/visa.png";
import mastercardlogo from "../assets/ball.png";
import kalaralogo from "../assets/klarna.png";
import iphone from "../assets/i.png";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MdLocalGroceryStore className="text-green-600 text-3xl" />
              <h2 className="text-2xl font-bold text-green-800">Shopcart</h2>
            </div>
            <p className="text-sm w-96 text-gray-600 mb-6">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            </p>

            {/* Accepted Payments with Logos */}
            <div className="flex  w-3xs flex-wrap items-center gap-4 mb-6">
              <h3 className="font-semibold mb-2">Accepted Payments</h3>
              <div className="flex flex-wrap items-center gap-2">
                <img src={stripelogo} alt="Stripe" className="h-6 w-auto border rounded p-1" title="Stripe" />
                <img src={visalogo} alt="Visa" className="h-6 w-auto border rounded p-1" title="Visa" />
                <img src={mastercardlogo} alt="MasterCard" className="h-6 w-auto border rounded p-1" title="MasterCard" />
                <img src={amazonlogo} alt="Amazon Pay" className="h-6 w-auto border rounded p-1" title="Amazon Pay" />
                <img src={kalaralogo} alt="Klarna" className="h-6 w-auto border rounded p-1" title="Klarna" />
                <img src={razorpaylogo} alt="Razorpay" className="h-6 w-auto border rounded p-1" title="Razorpay" />
                <img src={iphone} alt="Apple Pay" className="h-6 w-auto border rounded p-1" title="Apple Pay" />
                <img src={gogglepaylogo} alt="Google Pay" className="h-6 w-auto border rounded p-1" title="Google Pay" />
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">

          {/* Department */}
          <div>
            <h4 className="font-semibold mb-4">Department</h4>
            <ul className="space-y-2 font-medium text-gray-700">
              <li>Fashion</li>
              <li>Education Product</li>
              <li>Frozen Food</li>
              <li>Beverages</li>
              <li>Organic Grocery</li>
              <li>Office Supplies</li>
              <li>Beauty Products</li>
              <li>Books</li>
              <li>Electronics & Gadget</li>
              <li>Travel Accessories</li>
              <li>Fitness</li>
              <li>Sneakers</li>
              <li>Toys</li>
              <li>Furniture</li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-semibold mb-4">About Us</h4>
            <ul className="space-y-2 font-medium text-gray-700">
              <li>About Shopcart</li>
              <li>Careers</li>
              <li>News & Blog</li>
              <li>Help</li>
              <li>Press Center</li>
              <li>Shop By Location</li>
              <li>Shopcart Brands</li>
              <li>Affiliate & Partners</li>
              <li>Ideas & Guides</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2  font-medium text-sm text-gray-700">
              <li>Gift Card</li>
              <li>Mobile App</li>
              <li>Shipping & Delivery</li>
              <li>Order Pickup</li>
              <li>Account Signup</li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2  font-medium text-sm text-gray-700">
              <li>Shopcart Help</li>
              <li>Returns</li>
              <li>Track Orders</li>
              <li>Contact Us</li>
              <li>Feedback</li>
              <li>Security & Fraud</li>
            </ul>
          </div>
        </div>
        </div>

        {/* Bottom Text */}
        <div className="border-t mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Shopcart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
