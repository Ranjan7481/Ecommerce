import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../utils/UserSlice";
import { selectCartCount } from "../utils/cartSlice";

const categories = ["furniture", "handbag", "books", "tech", "sneakers", "travel"];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user?.data;
  const cartCount = useSelector(selectCartCount);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categoryRef = useRef();
  const menuRef = useRef();

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      if (res.status === 200) {
        dispatch(removeUser());
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b-[2px] border-green-900 bg-white">
      <nav className="container mx-auto flex items-center justify-between py-3 px-6">
        {/* Logo -> go to /cart */}
        <Link
          to="/cart"
          className="flex items-center gap-2 text-green-900 font-bold text-xl hover:opacity-80"
          aria-label="Open cart"
        >
          <span>🛒</span>
          <span>Shopcart</span>
        </Link>

        {/* Center */}
        <div className="flex items-center gap-10 w-full max-w-4xl justify-center">
          <div className="flex gap-6 text-[15px] font-semibold text-gray-700">
            <div className="relative" ref={categoryRef}>
              <button
                className="hover:text-black flex items-center gap-1"
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                Category <span className="text-xs">▼</span>
              </button>

              {categoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-md border rounded-md z-50">
                  {categories.map((cat) => (
                    <Link
                      to={`/category/${cat}`}
                      key={cat}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                      onClick={() => setCategoryOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/" className="hover:text-black">Deals</Link>
            <Link to="/" className="hover:text-black">What's New</Link>
            <Link to="/" className="hover:text-black">Delivery</Link>
          </div>

          {/* Search */}
          <div className="relative w-[250px]">
            <input
              type="text"
              placeholder="Search Product"
              className="w-full border rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 0 256 256"
              fill="currentColor"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-[15px] font-semibold text-gray-800">
          {/* Account */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:ring-2 ring-green-500 overflow-hidden"
            >
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                {!isLoggedIn ? (
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart link with badge (also routes to /cart) */}
          <Link to="/cart" className="flex items-center gap-1 hover:text-black relative">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 4h-2l-2 14h16l-2-14h-2m-4 0h4l1 10h-6l1-10zM5 20a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm12 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2z" />
            </svg>
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
