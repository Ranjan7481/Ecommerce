import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/UserSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useState, useEffect } from "react";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [FullName, setFullName] = useState(user?.FullName || "");
  const [age, setAge] = useState(user?.age || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [photo, setPhoto] = useState(user?.photo || "");
  const [photoFile, setPhotoFile] = useState(null);

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setShowSuccess(false);
    setError("");

    try {
      const formData = new FormData();
      formData.append("FullName", FullName);
      formData.append("age", age);
      formData.append("phone", phone);
      formData.append("address", address);
      if (photoFile) formData.append("photo", photoFile);

      const res = await axios.patch(`${BASE_URL}/profile/update`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(addUser(res.data.data));
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data || "Failed to update profile");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhoto(URL.createObjectURL(file)); // for live preview
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center py-10 px-4">
      <form
        onSubmit={handleUpdate}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl"
      >
        <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
          Edit Your Profile
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-indigo-500">
            {photo ? (
              <img
                src={
                  photo?.length > 100 && !photo.startsWith("blob:")
                    ? `data:image/jpeg;base64,${photo}`
                    : photo?.startsWith("/uploads/")
                    ? `http://localhost:5000${photo}`
                    : photo
                }
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600">
                No Photo
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Upload New Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-sm text-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={FullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              min="12"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="3"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-center mb-4 font-medium">
            ❌ {error}
          </div>
        )}

        {showSuccess && (
          <div className="text-green-600 text-center mb-4 font-medium">
            ✅ Profile updated successfully!
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-md transition duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
