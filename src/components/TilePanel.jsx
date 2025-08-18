import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import MaterialPanel from "./MaterialPanel";

const TilePanel = ({ showToast, onLayerConfirmed, onTileSelected, onTileCancel }) => {
  // STEP 1: Kitchen schemes (initial)
  const initialOptions = [
    { label: "Soho Kitchen", value: "" },
    { label: "Chelsea Kitchen", value: "" },
    { label: "Riverdale Kitchen", value: "" },
    { label: "Park Avenue Kitchen", value: "" },
    { label: "Greenwich Kitchen", value: "" },
    { label: "Hudson Kitchen", value: "" },
    { label: "Tribeca Kitchen", value: "" },
  ];

  // STEP 2: Categories shown after a scheme is chosen
  const categoryOptions = [
    { label: "Cabinets", value: "Avalon Painted White" },
    { label: "Countertops", value: "Ethereal Haze" },
    { label: "Wall Tile", value: "Multitude Wave White" },
    { label: "Shower Pan", value: "Union Platinum White" },
    { label: "Flooring", value: "Union Platinum White" },
    { label: "Plumbing", value: "Pitch Package Chrome" },
    { label: "Hardware", value: "Knobs  Polished Chrome" },
  ];

  // flow state
  const [stage, setStage] = useState("schemes"); // "schemes" | "categories"
  const [selectedScheme, setSelectedScheme] = useState("");

  // UI states
  const [headerTitle, setHeaderTitle] = useState("KITCHEN SCHEMES");
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
  const originalEditLabel = useRef("");
  const originalEditValue = useRef("");

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (draggedIndex === null) return;
    const container = tilesContainerRef.current;
    if (!container) return;

    let scrollInterval;
    const scrollSpeed = 10;
    const scrollThreshold = 0.2;

    const handleDragOverAuto = (e) => {
      const rect = container.getBoundingClientRect();
      const yPos = e.clientY - rect.top;
      const height = rect.height;
      if (scrollInterval) clearInterval(scrollInterval);

      if (yPos < height * scrollThreshold) {
        scrollInterval = setInterval(() => (container.scrollTop -= scrollSpeed), 16);
      } else if (yPos > height * (1 - scrollThreshold)) {
        scrollInterval = setInterval(() => (container.scrollTop += scrollSpeed), 16);
      }
    };

    const handleDragEnd = () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };

    container.addEventListener("dragover", handleDragOverAuto);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
      container.removeEventListener("dragover", handleDragOverAuto);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, [draggedIndex]);

  // drag handlers (drag ONLY in schemes)
  const handleDragStart = (e, index) => {
    if (stage !== "schemes") return;
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggedIndex(index);
    e.currentTarget.style.opacity = "0.4";
  };

  const handleDragOver = (e, index) => {
    if (stage !== "schemes") return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropIndex(index);
  };

  const handleDrop = (e, index) => {
    if (stage !== "schemes") return;
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (dragIndex === index) {
      setDropIndex(null);
      return;
    }
    setDesignOptions((prev) => {
      const newOptions = [...prev];
      const [draggedItem] = newOptions.splice(dragIndex, 1);
      newOptions.splice(index, 0, draggedItem);
      return newOptions;
    });

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
    if (stage !== "schemes") return;
    e.currentTarget.style.opacity = "1";
    setDraggedIndex(null);
    setDropIndex(null);
  };

  // edit handlers (ALLOW EDIT ONLY IN CATEGORIES STAGE)
  const handleEditStart = (index) => {
    if (stage !== "categories") return; // no editing in schemes
    setEditingIndex(index);
    if (index === "header") {
      setEditLabel(headerTitle);
      setEditValue("");
      originalEditLabel.current = headerTitle;
      originalEditValue.current = "";
    } else if (index === "new") {
      setEditLabel("");
      setEditValue("");
      originalEditLabel.current = "";
      originalEditValue.current = "";
    } else {
      setEditLabel(designOptions[index].label);
      setEditValue(designOptions[index].value);
      originalEditLabel.current = designOptions[index].label;
      originalEditValue.current = designOptions[index].value;
    }
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;

    if (editingIndex === "header") {
      setHeaderTitle(
        editLabel.trim() || (stage === "schemes" ? "KITCHEN SCHEMES" : selectedScheme.toUpperCase())
      );
    } else if (editingIndex === "new") {
      if (editLabel.trim() && editValue.trim()) {
        setDesignOptions((prev) => [...prev, { label: editLabel.trim(), value: editValue.trim() }]);
      }
    } else {
      setDesignOptions((prev) => {
        const updated = [...prev];
        updated[editingIndex] = {
          label: editLabel.trim() || "Untitled",
          value: editValue.trim() || "N/A",
        };
        return updated;
      });
    }
    setEditingIndex(null);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditLabel(originalEditLabel.current);
    setEditValue(originalEditValue.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleEditSave();
    else if (e.key === "Escape") setEditingIndex(null);
  };

  const handleCancel = () => {
    setActiveIndex(null);
    if (typeof onTileCancel === "function") onTileCancel();
  };

  // tile click → flow control
  const handleTileClick = (index) => {
    if (editingIndex === index) return;

    if (stage === "schemes") {
      const scheme = designOptions[index].label;
      setSelectedScheme(scheme);
      setHeaderTitle(scheme.toUpperCase());
      setStage("categories");
      setDesignOptions(categoryOptions);
      setActiveIndex(null);
      if (typeof onTileSelected === "function") onTileSelected();
    } else {
      // categories → open MaterialPanel
      setActiveIndex(index);
      if (typeof onTileSelected === "function") onTileSelected();
    }
  };

  return (
    <>
      <div
        className={`absolute top-[50px] left-0 z-50 w-[320px] p-5 space-y-4 pointer-events-auto transform transition-all duration-700 ease-out ${
          isMounted ? "translate-x-4 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        {/* Header (no back button) */}
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

          {/* Header edit pencil only in categories stage */}
          {stage === "categories" && (
            <>
              {editingIndex === "header" ? (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300 transition w-6 h-6 flex items-center justify-center z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCancel();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500 cursor-pointer opacity-70 hover:text-gray-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                hoveredIndex === "header" &&
                editingIndex !== "header" && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition w-6 h-6 flex items-center justify-center z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart("header");
                    }}
                  >
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
                  </button>
                )
              )}
            </>
          )}
        </div>

        {/* Tiles list */}
        <div
          className="max-h-[64vh] overflow-y-auto scrollbar-hide pr-2 snap-y snap-mandatory"
          ref={tilesContainerRef}
        >
          {designOptions.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              draggable={stage === "schemes"}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative bg-white/95 backdrop-blur-sm border-2 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 ease-out mb-3 snap-start ${
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
              onClick={() => handleTileClick(index)}
              style={{
                transition: "all 0.3s ease",
                opacity: isMounted ? 1 : 0,
                transform: isMounted ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 p-4" ref={editingIndex === index ? editingRef : null}>
                <div className="flex items-center gap-4">
                  <div
                    className={`relative w-16 h-16 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-500 font-medium shadow-inner border border-slate-200/50 transition-all duration-300 ${
                      hoveredIndex === index ? "shadow-md scale-105" : ""
                    }`}
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/50 to-transparent"></div>
                    <span className="relative z-10">IMG</span>
                    <div
                      className={`absolute inset-0 rounded-xl border-2 border-blue-400/0 transition-all duration-300 ${
                        hoveredIndex === index ? "border-blue-400/30" : ""
                      }`}
                    ></div>

                    {/* Upload overlay only while editing AND only in categories stage */}
                    {stage === "categories" && editingIndex === index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-xl z-30">
                        <label className="cursor-pointer flex flex-col items-center">
                          <span className="group flex flex-col items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6  text-gray-500 group-hover:text-gray-700 transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4" />
                            </svg>
                            <span className="text-xs text-gray-700 font-semibold mt-1 group-hover:text-gray-900 transition-colors">
                              Upload
                            </span>
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  /* You can store image data in your state if needed */
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>

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
                        <h4
                          className={`font-bold text-base mb-1 transition-colors duration-200 ${
                            activeIndex === index
                              ? "text-blue-700"
                              : "text-slate-800 group-hover:text-slate-900"
                          }`}
                        >
                          {item.label}
                        </h4>
                        <p
                          className={`text-sm leading-relaxed transition-colors duration-200 ${
                            activeIndex === index
                              ? "text-blue-600"
                              : "text-slate-600 group-hover:text-slate-700"
                          }`}
                        >
                          {item.value}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Pencil ONLY in categories stage */}
                  {stage === "categories" && (
                    <>
                      {editingIndex === index ? (
                        <button
                          type="button"
                          className="absolute top-1 right-1 w-6 h-6 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300 transition flex items-center justify-center z-40"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCancel();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      ) : (
                        hoveredIndex === index &&
                        editingIndex !== index && (
                          <Pencil
                            className="absolute top-2 right-2 w-4 h-4 text-gray-500 cursor-pointer hover:bg-slate-100 opacity-70 hover:opacity-100 transition-opacity z-20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditStart(index);
                            }}
                          />
                        )
                      )}
                    </>
                  )}
                </div>

                {activeIndex === index && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full shadow-lg animate-pulse">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl transform origin-left transition-all duration-300 ${
                  activeIndex === index
                    ? "scale-x-100 opacity-100"
                    : hoveredIndex === index
                    ? "scale-x-75 opacity-60"
                    : "scale-x-0 opacity-0"
                }`}
              ></div>
            </div>
          ))}

          {/* Add New Option (ONLY in categories stage) */}
          {stage === "categories" && (
            <div
              className="relative bg-white/95 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl shadow-md cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all p-4 text-center"
              onClick={() => {
                if (editingIndex !== "new") handleEditStart("new");
              }}
            >
              {editingIndex === "new" ? (
                <div ref={editingRef} className="flex flex-col gap-2 items-center">
                  <input
                    className="w-full text-sm px-2 py-1 rounded bg-white border font-bold text-slate-800"
                    placeholder="Enter label"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <input
                    className="w-full text-xs px-2 py-1 rounded bg-white border text-slate-600"
                    placeholder="Enter value"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSave();
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="px-3 py-1 text-xs bg-gray-300 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCancel();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-slate-400 font-semibold">+ Add New Option</span>
              )}
            </div>
          )}
        </div>
      </div>

      {activeIndex !== null && (
        <MaterialPanel
          title={designOptions[activeIndex].label}
          showToast={showToast}
          onClose={() => setActiveIndex(null)}
          onConfirm={() => {
            onLayerConfirmed && onLayerConfirmed();
          }}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default TilePanel;
