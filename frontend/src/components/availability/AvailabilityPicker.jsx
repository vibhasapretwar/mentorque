import { useState } from "react";
import SlotEditor from "./SlotEditor";
import API from "../../utils/api";

export default function AvailabilityPicker() {
  const [slots, setSlots] = useState([]);

  const addSlot = (slot) => {
    setSlots([...slots, slot]);
  };

  const saveSlots = async () => {
    await API.post("/api/availability", { slots });
    alert("Saved!");
  };

  return (
    <div>
      <SlotEditor onAdd={addSlot} />

      <div className="mt-4">
        {slots.map((s, i) => (
          <div key={i}>
            {s.day} {s.start} - {s.end}
          </div>
        ))}
      </div>

      <button
        className="bg-blue-500 text-white mt-3 px-3 py-1"
        onClick={saveSlots}
      >
        Save Availability
      </button>
    </div>
  );
}