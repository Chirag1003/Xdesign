import { useState, useEffect } from "react";

export default function MaterialPanel({ title = "Cabinets", onCancel, onConfirm, onBack, onClose, showToast }) {
  const cabinetOptions = [
    { name: "Avalon Painted White", color: "#f3f4f6", grade: "Standard" },
    { name: "Avalon Painted Blue", color: "#3b82f6", grade: "Upgrade1" },
    { name: "Avalon Painted Gray", color: "#9ca3af", grade: "Upgrade2" },
    { name: "Avalon Maple Sand", color: "#d6b88d", grade: "Upgrade3" },
    { name: "Avalon Maple Walnut", color: "#5d3a1a", grade: "Standard" },
    { name: "Avalon Painted Arctic", color: "#e0f7fa", grade: "Upgrade1" },
    { name: "Avalon Painted Black Mocha", color: "#1f2937", grade: "Upgrade2" },
    { name: "Avalon Painted Verde", color: "#2e7d32", grade: "Upgrade3" },
    { name: "Avalon Painted Willow", color: "#a1887f", grade: "Standard" },
    { name: "Capri Hi-Gloss White", color: "#ffffff", grade: "Upgrade1" },
    { name: "Milan Maple Pewter", color: "#607d8b", grade: "Upgrade2" },
    { name: "Milan Maple Sand", color: "#ffcc80", grade: "Upgrade3" },
    { name: "Milan Painted Arctic", color: "#e0f2f1", grade: "Standard" },
    { name: "Milan Painted Verde", color: "#4caf50", grade: "Upgrade1" },
    { name: "Milan Painted Graphite", color: "#424242", grade: "Upgrade2" },
  ];

  const [selected, setSelected] = useState(cabinetOptions[0]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  const filteredOptions = cabinetOptions
    .filter(item =>
      (selectedGrade === "All" || item.grade === selectedGrade) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className={`absolute top-0 left-0 z-50 h-full w-[350px] bg-white shadow-2xl flex flex-col transform transition-all duration-700 ease-out ${isMounted ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
      <div className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-hide">
        {/* Enhanced Selection Header */}
        <div 
          className={`mb-6 flex items-center gap-4 relative p-4 border-2 rounded-2xl shadow-lg bg-gradient-to-r from-slate-50 to-white border-slate-200 transform transition-all duration-500 delay-200 ${
            isMounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
          }`}
        >
          <div
            className="relative w-20 h-20 rounded-xl border-2 group overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: selected.color }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10"></div>
            
            <button
              onClick={() => { onBack && onBack(); onClose && onClose(); }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm bg-white/30 text-slate-700 rounded-xl hover:bg-white/50"
              title="Go Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 transition-transform duration-200 group-hover:scale-110">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col text-sm space-y-1">
            <p className="text-slate-500 font-semibold tracking-wide">Confirmed Selection</p>
            <p className="font-semibold text-slate-800 truncate max-w-[180px]">{selected.name}</p>
            <p className="font-semibold text-slate-600 truncate max-w-[180px]">Manufacturer: Servin</p>
            <p className="font-semibold text-slate-600 truncate max-w-[180px]">ID: Chirag123</p>
          </div>
        </div>

        {/* Enhanced Header with Controls */}
        <div 
          className={`flex items-center justify-between mb-4 transform transition-all duration-500 delay-300 ${isMounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} z-[9999] relative`}
        >
          {/* Always show title */}
          <h2 className="font-bold text-sm text-slate-800">All {title}</h2>
          
          <div className="flex gap-2  relative z-10">
            {/* Search Button/Input */}
            <div className="relative flex items-center">
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex items-center justify-center text-sm text-slate-600 border-2 border-slate-200 rounded-full w-10 h-10 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:scale-105 active:scale-95"
                  aria-label="Open search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                    />
                  </svg>
                </button>
              ) : (
                <div className="relative flex items-center">
                  <input
                    type="text"
                    className="transition-all duration-300 border-2 border-slate-200 rounded-full px-4 py-2 text-sm bg-white  ring-gray-400 outline-none w-44 pl-6 pr-10"
                    placeholder={`Search ${title}`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-700 focus:outline-none"
                    onClick={() => { setShowSearch(false); setSearchTerm(''); }}
                    aria-label="Close search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            {/* Filter Button */}
          <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center justify-center text-sm border-2 rounded-full w-10 h-10 transition-all duration-200 hover:scale-105 active:scale-95 z-50 ${
                  showFilter 
                    ? "border-gray-500 bg-gray-50 text-gray-600" 
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
                aria-label="Open filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
                </svg>
              </button>
              
              {/* Filter Dropdown with higher z-index */}
              {showFilter && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[9999] py-2 px-2 animate-fade-in">
                  {['All', 'Standard', 'Upgrade1', 'Upgrade2', 'Upgrade3'].map(grade => (
                    <button
                      key={grade}
                      className={`w-full flex items-center justify-between text-left px-5 py-2 rounded-xl transition-all duration-150 mb-1 last:mb-0 font-medium ${
                        selectedGrade === grade 
                          ? 'bg-blue-100 text-blue-700 shadow-inner' 
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                      onClick={() => {
                        setSelectedGrade(grade);
                        setShowFilter(false);
                      }}
                    >
                      <span>{grade}</span>
                      
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Options Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 relative z-0">
          {filteredOptions.map((item, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl border-2 p-3 cursor-pointer transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 ${
                selected.name === item.name 
                  ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-200/50" 
                  : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
              } ${
                isMounted 
                  ? `opacity-100 translate-y-0` 
                  : "opacity-0 translate-y-4"
              }`}
              // Remove transitionDelay to avoid stacking context issues
              // style={{ transitionDelay: isMounted ? `${index * 50}ms` : '0ms' }}
              onClick={() => setSelected(item)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Selection indicator */}
              {selected.name === item.name && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Color swatch */}
              <div
                className={`w-full h-16 rounded-xl shadow-inner border border-slate-200/50 transition-all duration-300 ${
                  hoveredIndex === index ? "shadow-md scale-105" : ""
                } ${selected.name === item.name ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
                style={{ backgroundColor: item.color }}
              >
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-white/20 via-transparent to-black/10"></div>
              </div>

              <p className={`text-xs mt-3 font-medium leading-tight transition-colors duration-200 ${
                selected.name === item.name 
                  ? "text-blue-700" 
                  : hoveredIndex === index 
                  ? "text-slate-800" 
                  : "text-slate-600"
              }`}>
                {item.name}
              </p>

              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t-4">
        <div className="flex justify-between items-center gap-4">
          <button
            className="flex items-center justify-center px-4 py-2 rounded-xl text-white font-semibold text-base border border-gray-600 bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-black/50 transition-all duration-200 w-32"
            onClick={() => {
              onCancel && onCancel();
              onClose && onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="flex items-center justify-center gap-2  py-2 rounded-xl text-white font-semibold text-base border border-gray-600 bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-black/50 transition-all duration-200 flex-1"
            onClick={() => {
              onConfirm && onConfirm(selected);
              showToast &&
                showToast('Changes Applied!', '1 tile(s) have been applied to your design.');
              onClose && onClose();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}