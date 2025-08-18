import { useState } from "react";
import { options } from "../data/options";
import SelectionModal from "./SelectionModal";

export default function EditOptions({ room }) {
  const [activeOption, setActiveOption] = useState(null);

  const handleClick = (optionType) => {
    console.log("Clicked:", optionType);
    setActiveOption(optionType);
  };


  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Select an item to edit:</h2>
      {options[room].map((opt) => (
        <div
          key={opt.type}
          onClick={() => handleClick(opt.type)}
          className="border p-4 my-2 rounded cursor-pointer hover:bg-gray-100"
        >
          {opt.label}
        </div>
      ))}

      {activeOption && (
        <SelectionModal
          type={activeOption}
          onClose={() => setActiveOption(null)}
        />
      )}
    </div>
  );
}
