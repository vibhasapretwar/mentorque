import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Mentorque</h2>

        <p className="mb-4 text-gray-300">{user?.role}</p>

        <button
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}