import { useState } from "react";

export default function SlotEditor({ onAdd }) {
  const [day, setDay] = useState("Monday");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleAdd = () => {
    if (!start || !end) return alert("Fill time");

    onAdd({ day, start, end });
    setStart("");
    setEnd("");
  };

  return (
    <div className="border p-4 rounded">
      <h2 className="font-bold mb-2">Add Slot</h2>

      <select onChange={(e) => setDay(e.target.value)}>
        {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(d => (
          <option key={d}>{d}</option>
        ))}
      </select>

      <input
        type="time"
        className="border mx-2"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />

      <input
        type="time"
        className="border mx-2"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      <button
        className="bg-green-500 text-white px-2"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
}