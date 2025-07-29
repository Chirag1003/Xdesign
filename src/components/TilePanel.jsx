import { useEffect, useState } from "react";
import MaterialPanel from "./MaterialPanel"; // new component for left side detail panel

export default function TilePanel({ showToast, onLayerConfirmed }) {
  const designOptions = [
    { label: "Cabinets", value: "Avalon Painted White" },
    { label: "Countertops", value: "Ethereal Haze" },
    { label: "Wall Tile", value: "Multitude Wave 12x25 Origami White" },
    { label: "Shower Pan", value: "Union 2x3 Platinum White" },
    { label: "Flooring", value: "Union 12x24 Platinum White" },
    { label: "Plumbing", value: "Hnt/Pitch Package Chrome" },
    { label: "Hardware", value: "Knobs – Madison Knob: Polished Chrome" },
  ];

  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  const handleCloseMaterialPanel = () => {
    setActiveIndex(null);
  };

  return (
    <>
      <div
        className={`absolute top-[50px] left-0 z-50 w-[300px] p-4 space-y-4 rounded-md pointer-events-auto transform transition-transform duration-500 ease-in-out 
        ${isMounted ? "translate-x-4 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        {/* Kitchen Title */}
        <div className="bg-slate-100 font-semibold text-lg rounded-md p-3 text-center">
          SOHO KITCHEN
        </div>

        {/* Scrollable Tile Options */}
        <div className="max-h-[68vh] overflow-y-auto scrollbar-hide space-y-2">
          {designOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`bg-white border rounded-lg shadow-sm p-3 cursor-pointer transform transition duration-300 hover:scale-[1.03] hover:shadow-md ${
                activeIndex === index ? "border-blue-500" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                  IMG
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{item.label}</h4>
                  <p className="text-xs text-gray-500">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <MaterialPanel
          title={designOptions[activeIndex].label}
          showToast={showToast}
          onClose={handleCloseMaterialPanel}
          onConfirm={() => {
            onLayerConfirmed && onLayerConfirmed();
          }}
        />
      )}
    </>
  );
}
