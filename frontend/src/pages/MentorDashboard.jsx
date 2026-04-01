import AvailabilityPicker from "../components/availability/AvailabilityPicker";

export default function MentorDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Manage Your Slots</h2>
        <AvailabilityPicker />
      </div>
    </div>
  );
}