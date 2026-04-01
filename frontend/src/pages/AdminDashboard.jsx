import { useEffect, useState } from "react";
import API from "../utils/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    API.get("/api/admin/users").then(res => setUsers(res.data));
  }, []);

  const getRecommendations = async (userId) => {
    const res = await API.get(`/api/admin/recommendations?userId=${userId}`);
    setRecommendations(res.data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        
        {/* Users */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Users</h2>

          {users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between border-b py-2"
            >
              <span>{u.email}</span>
              <button
                className="bg-blue-500 text-white px-2 rounded"
                onClick={() => getRecommendations(u.id)}
              >
                Match
              </button>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Recommendations</h2>

          {recommendations.map((m) => (
            <div
              key={m.id}
              className="flex justify-between border-b py-2"
            >
              <span>{m.email}</span>
              <button className="bg-green-500 text-white px-2 rounded">
                Book
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}