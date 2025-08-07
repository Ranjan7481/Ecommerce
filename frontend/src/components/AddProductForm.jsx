import React, { useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addProduct } from "../utils/productSlice";

const AddProductForm = () => {
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");

  // Flags
  const [isBestDeal, setIsBestDeal] = useState(false);
  const [isWeeklyPopular, setIsWeeklyPopular] = useState(false);
  const [isMostSelling, setIsMostSelling] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("ProductName", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("isBestDeal", isBestDeal);
      formData.append("isWeeklyPopular", isWeeklyPopular);
      formData.append("isMostSelling", isMostSelling);
      formData.append("isTrending", isTrending);
      if (image) formData.append("productPhoto", image);

      const res = await axios.post(BASE_URL + "/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch(addProduct(res.data.product));
      navigate("/productadmin");

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setImage(null);
      setPreviewImage(null);
      setIsBestDeal(false);
      setIsWeeklyPopular(false);
      setIsMostSelling(false);
      setIsTrending(false);
      setError("");
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.response?.data?.errors?.[Object.keys(err.response?.data?.errors)[0]] || "Failed to add product");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <header className="flex items-center justify-between border-b px-10 py-4">
        <h2 className="text-xl font-bold text-gray-800">StoreFront</h2>
        <nav className="flex gap-6 text-sm font-medium text-gray-800">
          <Link to="/productadmin" className="hover:text-blue-600">Dashboard</Link>
          <a href="#">Products</a>
          <a href="#">Orders</a>
          <a href="#">Customers</a>
        </nav>
      </header>

      <form onSubmit={handleAddProduct} className="flex justify-center px-10 py-10">
        <div className="w-full max-w-[700px]">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Product</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* Product Name */}
          <div className="mb-4">
            <label className="block font-medium text-gray-800 mb-1">Product Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg p-3 text-gray-900" />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block font-medium text-gray-800 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-lg p-3 text-gray-900 h-32 resize-none" />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block font-medium text-gray-800 mb-1">Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded-lg p-3 text-gray-900" />
          </div>

          {/* Stock */}
          <div className="mb-4">
            <label className="block font-medium text-gray-800 mb-1">Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full border rounded-lg p-3 text-gray-900" />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block font-medium text-gray-800 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-lg p-3 text-gray-900">
              <option value="">Select category</option>
              <option value="furniture">Furniture</option>
              <option value="handbag">Handbag</option>
              <option value="books">Books</option>
              <option value="tech">Tech</option>
              <option value="sneakers">Sneakers</option>
              <option value="travel">Travel</option>
            </select>
          </div>

          {/* Boolean Flags */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <label className="flex items-center gap-2 text-gray-800">
              <input type="checkbox" checked={isBestDeal} onChange={() => setIsBestDeal(!isBestDeal)} />
              Best Deal
            </label>
            <label className="flex items-center gap-2 text-gray-800">
              <input type="checkbox" checked={isWeeklyPopular} onChange={() => setIsWeeklyPopular(!isWeeklyPopular)} />
              Weekly Popular
            </label>
            <label className="flex items-center gap-2 text-gray-800">
              <input type="checkbox" checked={isMostSelling} onChange={() => setIsMostSelling(!isMostSelling)} />
              Most Selling
            </label>
            <label className="flex items-center gap-2 text-gray-800">
              <input type="checkbox" checked={isTrending} onChange={() => setIsTrending(!isTrending)} />
              Trending
            </label>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block font-medium text-gray-800 mb-1">Product Photo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
              <button type="button" onClick={handleUploadClick} className="mb-3 px-4 py-2 bg-gray-200 rounded font-medium text-sm text-gray-800">
                Choose Image
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              {previewImage && <img src={previewImage} alt="Preview" className="mt-4 h-40 object-contain rounded border" />}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Add Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
