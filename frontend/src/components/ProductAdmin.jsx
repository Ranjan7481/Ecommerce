import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { setProducts, deleteProduct } from "../utils/productSlice";
import { removeUser } from "../utils/UserSlice";

const classNames = (...c) => c.filter(Boolean).join(" ");

const stockBadge = (n) => {
  const q = Number(n ?? 0);
  if (q <= 0) return { text: "Out of stock", cls: "bg-red-100 text-red-700" };
  if (q < 10) return { text: "Low", cls: "bg-amber-100 text-amber-700" };
  return { text: "In stock", cls: "bg-emerald-100 text-emerald-700" };
};

const fmtDate = (d) => {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "-";
  }
};

const getImageFromProduct = (product) => {
  const p = product?.productPhoto;
  if (p && (p.startsWith("/9j") || p.length > 100)) {
    return `data:image/jpeg;base64,${p}`;
  }
  if (product?.image) return product.image;
  return null;
};

const ProductAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((s) => s.product.products || []);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // UI state
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest"); // newest|priceAsc|priceDesc|stockAsc|stockDesc
  const [category, setCategory] = useState("all"); // optional if you have categories
  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/allproducts`, { withCredentials: true });
        dispatch(setProducts(res.data?.data || []));
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [dispatch]);

  const categoriesFromData = useMemo(() => {
    // If your product has category field; otherwise keep "All"
    const set = new Set();
    products.forEach((p) => p?.category && set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    // filter by category (if exists)
    if (category !== "all") list = list.filter((p) => p.category === category);

    // search by name/description
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter((p) => {
        const name = (p.ProductName || p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return name.includes(needle) || desc.includes(needle);
      });
    }

    // sort
    list.sort((a, b) => {
      const pa = Number(a.price || 0);
      const pb = Number(b.price || 0);
      const sa = Number(a.stock || 0);
      const sb = Number(b.stock || 0);
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();

      switch (sort) {
        case "priceAsc":
          return pa - pb;
        case "priceDesc":
          return pb - pa;
        case "stockAsc":
          return sa - sb;
        case "stockDesc":
          return sb - sa;
        case "newest":
        default:
          return db - da;
      }
    });

    return list;
  }, [products, q, sort, category]);

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/product/delete/${id}`, { withCredentials: true });
      dispatch(deleteProduct(id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to delete product.");
    } finally {
      setConfirm({ open: false, id: null, name: "" });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">
              SF
            </div>
            <h1 className="text-lg md:text-xl font-bold">StoreFront • Admin</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/productadmin" className="hover:text-slate-900">
              Dashboard
            </Link>
            <span className="text-slate-400">Products</span>
            <Link to="/orders" className="hover:text-slate-900">
              Orders
            </Link>
            <Link to="/customers" className="hover:text-slate-900">
              Customers
            </Link>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center"
                aria-label="Menu"
              >
                ⋮
              </button>
              {menuOpen && (
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

          <Link
            to="/addproduct"
            className="ml-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-black"
          >
            + Add Product
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or description…"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-slate-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌘K</span>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
          >
            {categoriesFromData.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="newest">Newest</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
            <option value="stockDesc">Stock: High → Low</option>
            <option value="stockAsc">Stock: Low → High</option>
          </select>
        </div>

        {/* Table card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-50/90 backdrop-blur border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Stock</th>
                  <th className="px-4 py-3 text-left font-medium">Created</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={`skeleton-${i}`} className="animate-pulse">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-slate-100" />
                            <div className="h-3 w-40 rounded bg-slate-100" />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-3 w-64 rounded bg-slate-100" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-3 w-16 rounded bg-slate-100" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-6 w-20 rounded-full bg-slate-100" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-3 w-24 rounded bg-slate-100" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-8 w-28 rounded-lg bg-slate-100" />
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      {err ? err : "No products found."}
                    </td>
                  </tr>
                )}

                {!loading &&
                  filtered.map((product) => {
                    const img = getImageFromProduct(product);
                    const name = product.ProductName || product.name || "—";
                    const desc = product.description || "—";
                    const price = Number(product.price || 0);
                    const stockInfo = stockBadge(product.stock);
                    return (
                      <tr key={product._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {img ? (
                              <img
                                src={img}
                                alt={name}
                                className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-slate-100 grid place-items-center text-xs text-slate-500">
                                No Img
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 truncate">{name}</div>
                              {product.category && (
                                <div className="text-xs text-slate-500 truncate">
                                  {product.category}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="line-clamp-2 text-slate-600 max-w-xl">{desc}</div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium">
                            ₹ {price.toFixed(2)}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className={classNames("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", stockInfo.cls)}>
                            {stockInfo.text} · {product.stock ?? 0}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-600">{fmtDate(product.createdAt)}</td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/editproduct/${product._id}`)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                setConfirm({
                                  open: true,
                                  id: product._id,
                                  name: name,
                                })
                              }
                              className="rounded-lg border border-red-200 text-red-700 px-3 py-1.5 text-xs hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Confirm delete modal */}
      {confirm.open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirm({ open: false, id: null, name: "" })} />
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800">Delete product</h3>
              <p className="mt-2 text-sm text-slate-600">
                Are you sure you want to delete <span className="font-medium">{confirm.name}</span>? This action
                cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setConfirm({ open: false, id: null, name: "" })}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(confirm.id)}
                  className="rounded-xl bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;
