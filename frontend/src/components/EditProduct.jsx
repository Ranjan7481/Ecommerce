import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/UserSlice";

const initialState = {
  ProductName: "",
  price: "",
  description: "",
  stock: "",
  category: "",
  isBestDeal: false,
  isWeeklyPopular: false,
  isMostSelling: false,
  isTrending: false,
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  const [product, setProduct] = useState(initialState);
  const [previewImage, setPreviewImage] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // ===== Fetch data =====
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/product/${id}`, { withCredentials: true });
        const data = res.data?.data || {};
        setProduct({
          ProductName: data.ProductName || "",
          price: data.price ?? "",
          description: data.description || "",
          stock: data.stock ?? "",
          category: data.category || "",
          isBestDeal: !!data.isBestDeal,
          isWeeklyPopular: !!data.isWeeklyPopular,
          isMostSelling: !!data.isMostSelling,
          isTrending: !!data.isTrending,
        });
        if (data.productPhoto) {
          setPreviewImage(`data:image/jpeg;base64,${data.productPhoto}`);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ===== Logout =====
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      setError("Failed to logout. Please try again.");
    }
  };

  // ===== Form handlers =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const setFileAndPreview = (file) => {
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => setFileAndPreview(e.target.files[0]);
  const handleUploadClick = () => fileInputRef.current?.click();
  const clearImage = () => {
    setPhotoFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Drag & Drop
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onDrop = (e) => {
      prevent(e);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) setFileAndPreview(file);
    };
    ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
      el.addEventListener(ev, prevent)
    );
    el.addEventListener("drop", onDrop);
    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
        el.removeEventListener(ev, prevent)
      );
      el.removeEventListener("drop", onDrop);
    };
  }, []);

  // ===== Validation =====
  const errors = useMemo(() => {
    const e = {};
    if (!String(product.ProductName).trim()) e.ProductName = "Product name is required.";
    if (product.price === "" || Number(product.price) < 0) e.price = "Enter a valid price.";
    if (product.stock === "" || Number(product.stock) < 0) e.stock = "Enter valid stock.";
    if (!String(product.description).trim()) e.description = "Description is required.";
    return e;
  }, [product]);

  const isValid = Object.keys(errors).length === 0;

  // ===== Submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("ProductName", product.ProductName);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("stock", product.stock);
      formData.append("category", product.category);
      formData.append("isBestDeal", product.isBestDeal);
      formData.append("isWeeklyPopular", product.isWeeklyPopular);
      formData.append("isMostSelling", product.isMostSelling);
      formData.append("isTrending", product.isTrending);
      if (photoFile) formData.append("productPhoto", photoFile);

      await axios.put(`${BASE_URL}/product/update/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Product updated successfully!");
      setTimeout(() => navigate("/productadmin"), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      {/* Topbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/productadmin" className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">
              SF
            </Link>
            <h1 className="text-lg md:text-xl font-bold">Edit Product</h1>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              to="/productadmin"
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Back to list
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center"
                aria-label="Menu"
              >
                ⋮
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Alerts */}
        {!!error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {!!successMessage && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 animate-pulse">
            <div className="h-8 w-60 bg-slate-100 rounded" />
            <div className="h-40 bg-slate-100 rounded" />
            <div className="h-80 bg-slate-100 rounded" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* 2-col responsive layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input
                    name="ProductName"
                    value={product.ProductName}
                    onChange={handleChange}
                    className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                      errors.ProductName
                        ? "border-red-300 focus:ring-red-200"
                        : "border-slate-200 focus:ring-slate-200"
                    }`}
                    placeholder="e.g., Premium Wooden Chair"
                  />
                  {errors.ProductName && (
                    <p className="mt-1 text-xs text-red-600">{errors.ProductName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                        errors.price ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-slate-200"
                      }`}
                      placeholder="0.00"
                    />
                    {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      value={product.stock}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                        errors.stock ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-slate-200"
                      }`}
                      placeholder="e.g., 25"
                    />
                    {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="e.g., furniture"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                      errors.description
                        ? "border-red-300 focus:ring-red-200"
                        : "border-slate-200 focus:ring-slate-200"
                    }`}
                    placeholder="Write a concise, compelling description..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Tags as toggles */}
                <fieldset className="border border-slate-200 rounded-xl p-3">
                  <legend className="text-sm font-medium px-1">Product Tags</legend>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { key: "isBestDeal", label: "Best Deal" },
                      { key: "isWeeklyPopular", label: "Weekly Popular" },
                      { key: "isMostSelling", label: "Most Selling" },
                      { key: "isTrending", label: "Trending" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={key}
                          checked={product[key]}
                          onChange={handleChange}
                          className="h-4 w-4 accent-slate-900"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>

            {/* Uploader */}
            <div>
              <label className="block text-sm font-medium mb-1">Product Photo</label>
              <div
                ref={dropRef}
                className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-white text-center"
              >
                {!previewImage ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">
                      Drag & drop an image here, or
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="ml-1 underline underline-offset-4 text-slate-900"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-slate-500">PNG/JPG, up to ~2–5MB recommended</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <img src={previewImage} alt="Preview" className="h-48 object-contain rounded-xl border" />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="rounded-xl bg-red-600 text-white px-3 py-1.5 text-sm hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/productadmin")}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || submitting}
                className={`rounded-xl px-5 py-2 text-sm text-white ${
                  !isValid || submitting ? "bg-slate-400" : "bg-slate-900 hover:bg-black"
                }`}
              >
                {submitting ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default EditProduct;
