// src/components/LoginSignup.jsx
import { useState } from "react";
import { Mail, Lock, Phone, User, Home, Calendar } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addUser } from "../utils/UserSlice";

const LoginSignup = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [FullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // If we came from Checkout, these will be present
  const redirectFrom = location.state?.from || null; // e.g. "/checkout"
  const checkoutState = location.state?.checkoutState || null; // { product, quantity }

  const goPostAuth = (resData) => {
    // If we were sent here by Checkout and we still have the product/qty, go back to Checkout.
    if (redirectFrom === "/checkout" && checkoutState?.product) {
      navigate("/checkout", { replace: true, state: checkoutState });
      return;
    }

    // Otherwise, follow normal post-auth routing.
    if (resData?.role === "admin") {
      navigate("/productadmin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleLogin = async () => {
    setError("");
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      // If your backend returns user object as { data: {...}, role, ... },
      // dispatch the whole thing (adjust if your slice expects a different shape)
      dispatch(addUser(res.data));
      console.log(res.data.data)
      goPostAuth(res.data.data);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    }
  };

  const handleSignUp = async () => {
    setError("");
    try {
      const payload = {
        FullName,
        emailId,
        password,
        age: age ? Number(age) : undefined,
        phone: phone ? Number(phone) : undefined,
        address,
        role,
      };

      const res = await axios.post(`${BASE_URL}/signup`, payload, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.data));
      goPostAuth(res.data.data);
    } catch (err) {
      let message = "Something went wrong!";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (Array.isArray(err?.response?.data?.errors)) {
        message = err.response.data.errors.map((e) => e.msg).join(", ");
      } else if (typeof err?.message === "string") {
        message = err.message;
      }
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 px-4 py-12">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 relative transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1">
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-wide">
          {isLoginForm ? "Welcome Back 👋" : "Create Your Account"}
        </h2>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            isLoginForm ? handleLogin() : handleSignUp();
          }}
        >
          {!isLoginForm && (
            <>
              {/* Full Name */}
              <div className="flex items-center bg-gray-800/60 px-3 py-2 rounded-xl border border-gray-700">
                <User className="text-white mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={FullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                  required
                />
              </div>

              {/* Age */}
              <div className="flex items-center bg-gray-800/60 px-3 py-2 rounded-xl border border-gray-700">
                <Calendar className="text-white mr-2" size={18} />
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                  min={1}
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex items-center bg-gray-800/60 px-3 py-2 rounded-xl border border-gray-700">
                <Phone className="text-white mr-2" size={18} />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                  required
                />
              </div>

              {/* Address */}
              <div className="flex bg-gray-800/60 px-3 py-2 rounded-xl border border-gray-700">
                <Home className="text-white mr-2 mt-1" size={18} />
                <textarea
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-transparent w-full outline-none text-white placeholder-gray-300 resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Role */}
              <div className="flex flex-col bg-gray-800/60 px-4 py-3 rounded-xl border border-gray-700 text-white gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <input
                    type="radio"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                    className="accent-purple-500"
                  />
                  User
                </label>
                <label className="text-sm font-medium flex items-center gap-2">
                  <input
                    type="radio"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                    className="accent-purple-500"
                  />
                  Admin
                </label>
              </div>
            </>
          )}

          {/* Email */}
          <div className="flex items-center bg-gray-800/60 px-3 py-2 rounded-xl border border-gray-700">
            <Mail className="text-white mr-2" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="bg-transparent w-full outline-none text-white placeholder-gray-300"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-gray-800/60 px-3 py-2 rounded-xl border border-gray-700">
            <Lock className="text-white mr-2" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full outline-none text-white placeholder-gray-300"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
          >
            {isLoginForm ? "Login" : "Sign Up"}
          </button>
        </form>

        <p
          className="mt-6 text-center text-sm text-white/80 hover:text-white cursor-pointer transition"
          onClick={() => {
            setIsLoginForm((prev) => !prev);
            setError("");
          }}
        >
          {isLoginForm
            ? "Don't have an account? Sign up here"
            : "Already a user? Login here"}
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
