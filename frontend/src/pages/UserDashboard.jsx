import AvailabilityPicker from "../components/availability/AvailabilityPicker";

export default function UserDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Your Availability</h2>
        <AvailabilityPicker />
      </div>
    </div>
  );
}