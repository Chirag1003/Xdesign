import { useState, useEffect } from "react";

export default function MaterialPanel({ title = "Cabinets", onCancel, onConfirm, onBack, onClose, showToast }) {
  const cabinetOptions = [
    { name: "Avalon Painted White", color: "#f3f4f6" },
    { name: "Avalon Painted Blue", color: "#3b82f6" },
    { name: "Avalon Painted Gray", color: "#9ca3af" },
    { name: "Avalon Maple Sand", color: "#d6b88d" },
    { name: "Avalon Maple Walnut", color: "#5d3a1a" },
    { name: "Avalon Painted Arctic", color: "#e0f7fa" },
    { name: "Avalon Painted Black Mocha", color: "#1f2937" },
    { name: "Avalon Painted Verde", color: "#2e7d32" },
    { name: "Avalon Painted Willow", color: "#a1887f" },
    { name: "Capri Hi-Gloss White", color: "#ffffff" },
    { name: "Milan Maple Pewter", color: "#607d8b" },
    { name: "Milan Maple Sand", color: "#ffcc80" },
    { name: "Milan Painted Arctic", color: "#e0f2f1" },
    { name: "Milan Painted Verde", color: "#4caf50" },
    { name: "Milan Painted Graphite", color: "#424242" },
  ];

  const [selected, setSelected] = useState(cabinetOptions[0]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  const filteredOptions = cabinetOptions
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  return (
    <div
      className={`absolute top-0 left-0 z-50 h-full w-[350px] bg-white shadow-lg flex flex-col transform transition-transform duration-500 ease-in-out 
      ${isMounted ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-hide">
        {/* Selected Preview */}
        <div className="mb-4 flex items-center gap-4 relative p-3 border rounded-lg shadow-sm">
          <div
            className="relative w-20 h-20 rounded border-2 group"
            style={{ backgroundColor: selected.color }}
          >
            <button
              onClick={() => { onBack && onBack(); onClose && onClose(); }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-white/30 text-blue-600 rounded"
              title="Go Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col text-sm">
            <p className="text-gray-600 font-semibold tracking-wide">CONFIRMED SELECTION</p>
            <p className="font-semibold text-gray-800 truncate max-w-[180px]">Layer: {selected.name}</p>
            <p className="font-semibold text-gray-800 truncate max-w-[180px]">Manufacturer: Servin</p>
            <p className="font-semibold text-gray-800 truncate max-w-[180px]">ID: Chirag123</p>
          </div>
        </div>

        {/* Header with Search/Sort */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-sm">All {title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center text-sm text-gray-600 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="text-sm text-gray-600 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7 7 7-7" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7-7-7 7" />
              </svg>
              {sortAsc ? "A-Z" : "Z-A"}
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className={`transition-all duration-500 overflow-hidden ${showSearch ? "max-h-20 mb-4" : "max-h-0"}`}>
          <input
            type="text"
            placeholder={`Search ${title}...`}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Cabinet Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {filteredOptions.map((item, index) => (
            <div
              key={index}
              className={`rounded border-2 p-1 cursor-pointer transform transition-transform duration-300 hover:scale-[1.05] hover:shadow-md ${
                selected.name === item.name ? "border-blue-600" : "border-transparent"
              }`}
              onClick={() => setSelected(item)}
            >
              <div
                className="w-full h-16 rounded"
                style={{ backgroundColor: item.color }}
              ></div>
              <p className="text-xs mt-1 text-gray-700">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t-4">
        <div className="flex justify-between items-center gap-2">
          <button
            className="w-full py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-lg border-2 border-gray-800 hover:border-gray-400"
            onClick={() => {
              onCancel && onCancel();
              onClose && onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="w-full py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg border-2 border-gray-800 hover:border-blue-500"
            onClick={() => {
              onConfirm && onConfirm(selected);
              showToast &&
                showToast('Changes Applied!', '1 tile(s) have been applied to your design.');
              onClose && onClose();
            }}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}
