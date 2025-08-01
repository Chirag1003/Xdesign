import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import MaterialPanel from "./MaterialPanel";

const TilePanel = ({ showToast, onLayerConfirmed }) => {
  // Initial data setup
  const initialOptions = [
    { label: "Cabinets", value: "Avalon Painted White" },
    { label: "Countertops", value: "Ethereal Haze" },
    { label: "Wall Tile", value: "Multitude Wave 12x25 Origami White" },
    { label: "Shower Pan", value: "Union 2x3 Platinum White" },
    { label: "Flooring", value: "Union 12x24 Platinum White" },
    { label: "Plumbing", value: "Hnt/Pitch Package Chrome" },
    { label: "Hardware", value: "Knobs  Polished Chrome" },
  ];

  // State management
  const [headerTitle, setHeaderTitle] = useState("SOHO KITCHEN");
  const [designOptions, setDesignOptions] = useState(initialOptions);
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editValue, setEditValue] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const tilesContainerRef = useRef(null);
  const editingRef = useRef(null);

  // Component mount effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Click outside handler for editing
  useEffect(() => {
    function handleClickOutside(e) {
      if (editingRef.current && !editingRef.current.contains(e.target)) {
        handleEditSave();
      }
    }
    
    if (editingIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [editingIndex, editLabel, editValue]);

  // Auto-scroll during drag
  useEffect(() => {
    if (draggedIndex === null) return;

    const container = tilesContainerRef.current;
    if (!container) return;

    let scrollInterval;
    const scrollSpeed = 10;
    const scrollThreshold = 0.2; // 20% from top/bottom

    const handleDragOver = (e) => {
      const rect = container.getBoundingClientRect();
      const yPos = e.clientY - rect.top;
      const height = rect.height;

      // Clear any existing interval
      if (scrollInterval) clearInterval(scrollInterval);

      // Check if we need to scroll up or down
      if (yPos < height * scrollThreshold) {
        // Near top - scroll up
        scrollInterval = setInterval(() => {
          container.scrollTop -= scrollSpeed;
        }, 16);
      } else if (yPos > height * (1 - scrollThreshold)) {
        // Near bottom - scroll down
        scrollInterval = setInterval(() => {
          container.scrollTop += scrollSpeed;
        }, 16);
      }
    };

    const handleDragEnd = () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };

    container.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
      container.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, [draggedIndex]);

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggedIndex(index);
    e.currentTarget.style.opacity = "0.4";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex === index) {
      setDropIndex(null);
      return;
    }

    setDesignOptions(prevOptions => {
      const newOptions = [...prevOptions];
      const [draggedItem] = newOptions.splice(dragIndex, 1);
      newOptions.splice(index, 0, draggedItem);
      return newOptions;
    });

    // Update active index if needed
    if (activeIndex === dragIndex) {
      setActiveIndex(index);
    } else if (activeIndex > dragIndex && activeIndex <= index) {
      setActiveIndex(activeIndex - 1);
    } else if (activeIndex < dragIndex && activeIndex >= index) {
      setActiveIndex(activeIndex + 1);
    }

    setDraggedIndex(null);
    setDropIndex(null);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedIndex(null);
    setDropIndex(null);
  };

  // Edit handlers
  const handleEditStart = (index) => {
    setEditingIndex(index);
    if (index === "header") {
      setEditLabel(headerTitle);
      setEditValue("");
    } else {
      setEditLabel(designOptions[index].label);
      setEditValue(designOptions[index].value);
    }
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;

    if (editingIndex === "header") {
      setHeaderTitle(editLabel.trim() || "SOHO KITCHEN");
    } else {
      setDesignOptions(prevOptions => {
        const updated = [...prevOptions];
        updated[editingIndex] = {
          label: editLabel.trim() || "Untitled",
          value: editValue.trim() || "N/A",
        };
        return updated;
      });
    }
    setEditingIndex(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      setEditingIndex(null);
    }
  };

  return (
    <>
      <div
        className={`absolute top-[50px] left-0 z-50 w-[320px] p-5 space-y-4 pointer-events-auto transform transition-all duration-700 ease-out 
        ${isMounted ? "translate-x-4 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        {/* Header */}
        <div
          className={`group relative bg-white text-slate-800 font-bold text-base rounded-2xl text-center shadow-lg border-2 border-slate-200 backdrop-blur-sm py-2 w-[270px] transition-all duration-500 ${
            isMounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onMouseEnter={() => setHoveredIndex("header")}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-2xl"></div>
          
          {editingIndex === "header" ? (
            <div ref={editingRef} className="relative z-10">
              <input
                className="text-center w-[250px] bg-white p-1 rounded font-bold tracking-wide"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
          ) : (
            <div className="relative z-10 tracking-wide">{headerTitle}</div>
          )}
          
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-slate-100/30 to-transparent"></div>
          
          {(hoveredIndex === "header" && editingIndex !== "header") && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition w-7 h-7 flex items-center justify-center z-20"
              style={{lineHeight:0}}
              onClick={(e) => {
                e.stopPropagation();
                handleEditStart("header");
              }}
            >
              <Pencil
                className="w-4 h-4 text-gray-500 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
              />
            </button>
          )}
        </div>

        {/* Tiles container with ref */}
        <div 
          className="max-h-[68vh] overflow-y-auto scrollbar-hide pr-2"
          ref={tilesContainerRef}
        >
          {designOptions.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative bg-white/95 backdrop-blur-sm border-2 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 ease-out mb-3 ${
                activeIndex === index
                  ? "border-blue-500 bg-blue-50/80 shadow-blue-200/50" 
                  : hoveredIndex === index
                  ? "border-slate-300 shadow-slate-200/50"
                  : "border-slate-200 hover:border-slate-300"
              } ${
                draggedIndex === index 
                  ? "opacity-40" 
                  : dropIndex === index 
                    ? "border-dashed border-blue-400 bg-blue-50/50"
                    : "opacity-100"
              } ${
                draggedIndex !== null && draggedIndex !== index
                  ? "hover:translate-y-0 hover:scale-100"
                  : "hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1"
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                if (editingIndex !== index) setActiveIndex(index);
              }}
              style={{
                transition: "all 0.3s ease",
                opacity: isMounted ? 1 : 0,
                transform: isMounted ? "translateY(0)" : "translateY(20px)"
              }}
            >
              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div 
                className="relative z-10 p-4" 
                ref={editingIndex === index ? editingRef : null}
              >
                <div className="flex items-center gap-4">
                  {/* Drag handle */}
                  <div
                    className={`relative w-16 h-16 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-500 font-medium shadow-inner border border-slate-200/50 transition-all duration-300 ${
                      hoveredIndex === index ? "shadow-md scale-105" : ""
                    }`}
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/50 to-transparent"></div>
                    <span className="relative z-10">IMG</span>
                    <div className={`absolute inset-0 rounded-xl border-2 border-blue-400/0 transition-all duration-300 ${
                      hoveredIndex === index ? "border-blue-400/30" : ""
                    }`}></div>
                  </div>
                  
                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    {editingIndex === index ? (
                      <>
                        <input
                          className="w-full text-sm mb-1 px-1 rounded bg-white border font-bold text-slate-800"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                        <input
                          className="w-full text-xs px-1 rounded bg-white border text-slate-600"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                      </>
                    ) : (
                      <>
                        <h4 className={`font-bold text-base mb-1 transition-colors duration-200 ${
                          activeIndex === index ? "text-blue-700" : "text-slate-800 group-hover:text-slate-900"
                        }`}>
                          {item.label}
                        </h4>
                        <p className={`text-sm leading-relaxed transition-colors duration-200 ${
                          activeIndex === index ? "text-blue-600" : "text-slate-600 group-hover:text-slate-700"
                        }`}>
                          {item.value}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Pencil icon for tiles */}
                  {(hoveredIndex === index && editingIndex !== index) && (
                    <Pencil
                      className="absolute top-2 right-2 w-4 h-4 text-gray-500 cursor-pointer opacity-70 hover:opacity-100 transition-opacity z-20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStart(index);
                      }}
                    />
                  )}
                </div>

                {/* Selection indicator */}
                {activeIndex === index && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full shadow-lg animate-pulse">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
              </div>

              {/* Bottom border accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl transform origin-left transition-all duration-300 ${
                activeIndex === index 
                  ? "scale-x-100 opacity-100" 
                  : hoveredIndex === index
                  ? "scale-x-75 opacity-60"
                  : "scale-x-0 opacity-0"
              }`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Material Panel for Active Tile */}
      {activeIndex !== null && (
        <MaterialPanel
          title={designOptions[activeIndex].label}
          showToast={showToast}
          onClose={() => setActiveIndex(null)}
          onConfirm={() => {
            onLayerConfirmed && onLayerConfirmed();
          }}
        />
      )}
    </>
  );
};

export default TilePanel;