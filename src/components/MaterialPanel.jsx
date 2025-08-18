import { useState, useEffect } from "react";
import BulkUploadModal from "./BulkUploadModal";

/* ===========================
   EditTabs (unchanged logic)
   =========================== */
function EditTabs({ itemToEdit, setItemToEdit }) {
  const [tab, setTab] = useState("Color");
  const [image, setImage] = useState(itemToEdit.image || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target.result);
        setItemToEdit({ ...itemToEdit, image: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <div className="flex border-b mb-2">
        <button
          className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-all duration-150 ${
            tab === "Color"
              ? "border-blue-500 text-blue-700 bg-blue-50"
              : "border-transparent text-slate-600 bg-white"
          }`}
          onClick={() => setTab("Color")}
        >
          Color
        </button>
        <button
          className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-all duration-150 ${
            tab === "Structure"
              ? "border-blue-500 text-blue-700 bg-blue-50"
              : "border-transparent text-slate-600 bg-white"
          }`}
          onClick={() => setTab("Structure")}
        >
          Structure
        </button>
      </div>

      {tab === "Color" ? (
        <div className="flex flex-col items-center justify-center min-h-[120px] border border-dashed border-slate-300 rounded-lg p-4 text-slate-400 text-sm">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col items-center border border-dashed border-slate-300 rounded-lg p-2 min-h-[120px] justify-center">
              <label className="block text-xs text-slate-500 mb-2">
                Drag and drop file to pick a color from it.
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="color-image-upload"
                onChange={handleImageChange}
              />
              <label
                htmlFor="color-image-upload"
                className="cursor-pointer text-blue-600 underline text-xs"
              >
                Select File
              </label>
              {image && (
                <img
                  src={image}
                  alt="Selected"
                  className="mt-2 w-12 h-12 object-cover rounded"
                />
              )}
            </div>
            <div className="flex-1 flex flex-col items-center">
              <input
                type="color"
                value={itemToEdit.color}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, color: e.target.value })
                }
                className="w-20 h-20 border border-slate-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={itemToEdit.color}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, color: e.target.value })
                }
                className="mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-center"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[120px] border border-dashed border-slate-300 rounded-lg p-4 text-slate-400 text-sm">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col items-center border border-dashed border-slate-300 rounded-lg p-2 min-h-[120px] justify-center">
              <label className="block text-xs text-slate-500 mb-2">
                Drag and drop file to pick a color from it.
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="color-image-upload-2"
                onChange={handleImageChange}
              />
              <label
                htmlFor="color-image-upload-2"
                className="cursor-pointer text-blue-600 underline text-xs"
              >
                Select File
              </label>
              {image && (
                <img
                  src={image}
                  alt="Selected"
                  className="mt-2 w-12 h-12 object-cover rounded"
                />
              )}
            </div>
            <div className="flex-1 flex flex-col items-center">
              <input
                type="color"
                value={itemToEdit.color}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, color: e.target.value })
                }
                className="w-20 h-20 border border-slate-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={itemToEdit.color}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, color: e.target.value })
                }
                className="mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-center"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================================
   MaterialPanel with Manage Layers UI
   ==================================== */
export default function MaterialPanel({
  title = "Cabinets",
  onCancel,
  onConfirm,
  onBack,
  onClose,
  showToast,
}) {
  // Seed with richer data for the table
  const initialCabinetOptions = [
    { name: "Red New 122 33333", color: "#FF0000", grade: "Standard", productCode: "RED34223333", manufacturer: "Paints", designType: "Color", option: "Cabinet" },
    { name: "Fresh Zest - SW9662", color: "#F5E9CF", grade: "Upgrade1", productCode: "SW9662", manufacturer: "Sherwin Williams", designType: "Color", option: "Cabinet" },
    { name: "Tarragon - SW9660", color: "#434E54", grade: "Upgrade2", productCode: "SW9660", manufacturer: "Sherwin Williams", designType: "Color", option: "Cabinet" },
    { name: "Ocean Breeze - BLU120", color: "#0077B6", grade: "Standard", productCode: "BLU120", manufacturer: "BlueCoat", designType: "Color", option: "Cabinet" },
    { name: "Sunset Glow - ORA452", color: "#FF7F51", grade: "Upgrade1", productCode: "ORA452", manufacturer: "ColorMax", designType: "Color", option: "Cabinet" },
    { name: "Forest Pine - GRN932", color: "#2D6A4F", grade: "Upgrade2", productCode: "GRN932", manufacturer: "EcoPaints", designType: "Color", option: "Cabinet" },
    { name: "Ivory Mist - WHI210", color: "#F8F9FA", grade: "Standard", productCode: "WHI210", manufacturer: "PaintPro", designType: "Color", option: "Cabinet" },
    { name: "Charcoal Night - BLK320", color: "#212529", grade: "Upgrade1", productCode: "BLK320", manufacturer: "DeepTone", designType: "Color", option: "Cabinet" },
    { name: "Sky Whisper - BLU230", color: "#A2D2FF", grade: "Standard", productCode: "BLU230", manufacturer: "SkyPaints", designType: "Color", option: "Cabinet" },
    { name: "Golden Ray - YLW550", color: "#FFD60A", grade: "Upgrade2", productCode: "YLW550", manufacturer: "BrightCo", designType: "Color", option: "Cabinet" },
    { name: "Misty Green - GRN812", color: "#B7E4C7", grade: "Standard", productCode: "GRN812", manufacturer: "EcoShade", designType: "Color", option: "Cabinet" },
    { name: "Crimson Fire - RED990", color: "#D00000", grade: "Upgrade1", productCode: "RED990", manufacturer: "HotHue", designType: "Color", option: "Cabinet" },
    { name: "Lavender Bliss - PUR401", color: "#CDB4DB", grade: "Upgrade2", productCode: "PUR401", manufacturer: "SoftTone", designType: "Color", option: "Cabinet" },
    { name: "Stone Grey - GRY808", color: "#6C757D", grade: "Standard", productCode: "GRY808", manufacturer: "RockSolid", designType: "Color", option: "Cabinet" },
    { name: "Peach Cream - PCH222", color: "#FFE5B4", grade: "Upgrade1", productCode: "PCH222", manufacturer: "FruitPaints", designType: "Color", option: "Cabinet" },
    { name: "Aqua Mist - AQU980", color: "#48CAE4", grade: "Standard", productCode: "AQU980", manufacturer: "AquaCo", designType: "Color", option: "Cabinet" },
    { name: "Steel Blue - STB310", color: "#4682B4", grade: "Upgrade2", productCode: "STB310", manufacturer: "MetalTone", designType: "Color", option: "Cabinet" },
  ];

  const [cabinetOptions, setCabinetOptions] = useState(initialCabinetOptions);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newColor, setNewColor] = useState("#ffffff");
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newTab, setNewTab] = useState("Color");

  const [selected, setSelected] = useState(initialCabinetOptions[0]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showGoogleSearch, setShowGoogleSearch] = useState(false);
  const [googleSearchTerm, setGoogleSearchTerm] = useState("");
  const [googleRegion, setGoogleRegion] = useState("All");
  const [showRegionFilter, setShowRegionFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState("A-Z");

  // Manage Layers modal/page state
  const [showManageLayers, setShowManageLayers] = useState(false);
  const [manageSearch, setManageSearch] = useState("");
  const [manageManufacturer, setManageManufacturer] = useState("All Manufacturer");
  const [managePageSize, setManagePageSize] = useState(10);
  const [managePage, setManagePage] = useState(1);

  // ===== NEW: selection state for Manage Layers =====
  const [selectedIds, setSelectedIds] = useState(new Set());
  // ===== NEW: bulk upload modal state =====
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  // ===== NEW: bulk edit panel =====
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);


  // const anySelected = selectedIds.size > 0;

  useEffect(() => {
    requestAnimationFrame(() => setIsMounted(true));
  }, []);

  // Seed stable _id for each row
  useEffect(() => {
    setCabinetOptions((prev) =>
      prev.map((o, idx) => ({
        _id:
          o._id ||
          (typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : String(Date.now() + idx)),
        ...o,
      }))
    );
  }, []);

  // keep selection consistent if data changes
  useEffect(() => {
    setSelectedIds((old) => {
      const valid = new Set();
      for (const row of cabinetOptions) if (old.has(row._id)) valid.add(row._id);
      return valid;
    });
  }, [cabinetOptions]);

  let filteredOptions = cabinetOptions.filter(
    (item) =>
      (selectedGrade === "All" || item.grade === selectedGrade) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (sortOrder === "A-Z") {
    filteredOptions = filteredOptions.slice().sort((a, b) => a.name.localeCompare(b.name));
  } else {
    filteredOptions = filteredOptions.slice().sort((a, b) => b.name.localeCompare(a.name));
  }

  const handleMenuClick = (index, e) => {
    e.stopPropagation();
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  const handleEdit = (item, e) => {
    if (e) e.stopPropagation();
    // Track original id so save works on the correct row
     // Track original id so save works on the correct row + safe defaults
   const safeHex = (h) => /^#[0-9A-Fa-f]{6}$/.test(h || "") ? h : "#ffffff";
   const withDefaults = {
     _originalId: item._id,
     name: item.name || "",
    color: safeHex(item.color),
     productCode: item.productCode || "",
      manufacturer: item.manufacturer || "",
 designType: item.designType || "Color",
     option: item.option || "Cabinet",
      image: item.image || null,
   };
  setItemToEdit(withDefaults);
    
    setEditMode(true);
    setActiveMenuIndex(null);
    setShowManageLayers(false);
  };

  const handleDelete = (item, e) => {
    if (e) e.stopPropagation();
    setCabinetOptions((prev) => prev.filter((x) => x._id !== item._id));
    setActiveMenuIndex(null);
    showToast && showToast("Item Deleted", `${item.name} has been removed`);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setItemToEdit(null);
  };

  const handleSaveEdit = () => {
    if (!itemToEdit?._originalId) return;
    setCabinetOptions((prev) =>
      prev.map((x) => (x._id === itemToEdit._originalId ? { ...x, ...itemToEdit } : x))
    );
    setEditMode(false);
    setItemToEdit(null);
    showToast && showToast("Layer Updated", `Layer has been updated`);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenuIndex !== null) setActiveMenuIndex(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenuIndex]);

  /* ================
     Google results
     ================ */
  const dummyGoogleResults = [
    { name: "Avalon Painted White", color: "#f3f4f6", region: "US", option: "Standard" },
    { name: "Avalon Painted Blue", color: "#3b82f6", region: "EU", option: "Upgrade1" },
    { name: "Milan Maple Pewter", color: "#607d8b", region: "Asia", option: "Upgrade2" },
    { name: "Capri Hi-Gloss White", color: "#ffffff", region: "US", option: "Upgrade1" },
    { name: "Milan Painted Arctic", color: "#e0f2f1", region: "EU", option: "Standard" },
    { name: "Sunset Orange", color: "#ff7043", region: "US", option: "Standard" },
    { name: "Forest Green", color: "#388e3c", region: "EU", option: "Upgrade2" },
    { name: "Royal Purple", color: "#7c43bd", region: "Asia", option: "Upgrade1" },
    { name: "Lemon Yellow", color: "#fff176", region: "US", option: "Standard" },
    { name: "Ocean Blue", color: "#0288d1", region: "EU", option: "Upgrade3" },
    { name: "Rose Pink", color: "#f06292", region: "Asia", option: "Standard" },
    { name: "Slate Gray", color: "#78909c", region: "US", option: "Upgrade1" },
    { name: "Charcoal Black", color: "#212121", region: "EU", option: "Upgrade2" },
    { name: "Ivory", color: "#f8f9fa", region: "Asia", option: "Standard" },
    { name: "Sandstone", color: "#e4cfa1", region: "US", option: "Upgrade3" },
    { name: "Emerald", color: "#50c878", region: "EU", option: "Standard" },
    { name: "Ruby Red", color: "#d32f2f", region: "Asia", option: "Upgrade1" },
    { name: "Sky Blue", color: "#81d4fa", region: "US", option: "Upgrade2" },
    { name: "Mint Green", color: "#a5d6a7", region: "EU", option: "Standard" },
    { name: "Steel Blue", color: "#4682b4", region: "Asia", option: "Upgrade3" },
  ];

  /* ===========================
     Google Search Panel
     =========================== */
  const renderGoogleSearchPanel = () => (
    <div className="flex flex-col flex-1">
      <div className="px-2 pt-4 pb-2 bg-white z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2 mb-4 relative">
          <div className="relative flex items-center flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4 absolute left-3 text-slate-400"
            >
              <g>
                <path
                  fill="#4285F4"
                  d="M12 11v2.5h5.9c-.25 1.4-1.7 4-5.9 4-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5c2.1 0 3.5.8 4.3 1.5l2.9-2.9C17.2 2.7 14.8 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.7 0 9.5-4 9.5-9.5 0-.6-.1-1.1-.2-1.5H12z"
                />
                <path fill="#34A853" d="M3.6 7.1l2.4 1.8C7.1 7.1 9.3 5.5 12 5.5c2.1 0 3.5.8 4.3 1.5l2.9-2.9C17.2 2.7 14.8 2 12 2 8.1 2 4.7 4.1 3.6 7.1z" />
                <path fill="#FBBC05" d="M12 22c2.7 0 5.2-.9 7.1-2.4l-2.9-2.3C14.8 18.5 13.5 19 12 19c-3.6 0-6.5-2.9-6.5-6.5 0-.7.1-1.4.3-2.1l-2.4-1.8C2.2 10.1 2 11 2 12c0 5.5 4.5 10 10 10z" />
                <path fill="#EA4335" d="M22 12c0-.6-.1-1.1-.2-1.5H12v3h5.9c-.25 1.4-1.7 4-5.9 4-2.5 0-4.6-1.5-5.4-3.6l-2.4 1.8C4.7 19.9 8.1 22 12 22c5.7 0 9.5-4 9.5-9.5z" />
              </g>
            </svg>
            <input
              type="text"
              value={googleSearchTerm}
              onChange={(e) => setGoogleSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Search by Google"
            />
          </div>

          <div className="relative flex items-center">
            <button
              className="p-2 border gap-2 border-slate-300 rounded-lg text-slate-600 bg-slate-50 hover:bg-slate-100 transition flex items-center justify-center"
              type="button"
              title="Filter by Region"
              onClick={() => setShowRegionFilter(!showRegionFilter)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z"
                />
              </svg>
              <span className="text-sm font-semibold text-slate-700 mr-1">
                Region
              </span>
            </button>

            {showRegionFilter && (
              <div className="absolute right-0 px-2 top-full mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-[9999] py-1 animate-fade-in">
                {["All", "US", "EU", "Asia"].map((region) => (
                  <button
                    key={region}
                    className={`w-full text-left rounded-lg px-3 py-1.5 text-sm font-medium ${
                      googleRegion === region
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                    onClick={() => {
                      setGoogleRegion(region);
                      setShowRegionFilter(false);
                    }}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 max-h-[85vh]  overflow-y-auto scrollbar-hide p-2">
        <div className="grid grid-cols-3 gap-4">
          {dummyGoogleResults
            .filter(
              (item) =>
                (googleRegion === "All" || item.region === googleRegion) &&
                item.name.toLowerCase().includes(googleSearchTerm.toLowerCase())
            )
            .map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border-2 p-3 flex flex-col items-center bg-white shadow-sm"
              >
                <div
                  className="w-12 h-12 rounded-lg mb-2"
                  style={{ backgroundColor: item.color }}
                />
                <div
                  title={item.name}
                  className="font-semibold text-slate-800 text-xs text-center mb-1 line-clamp-2"
                >
                  {item.name}
                </div>
              </div>
            ))}
        </div>

        {dummyGoogleResults.filter(
          (item) =>
            (googleRegion === "All" || item.region === googleRegion) &&
            item.name.toLowerCase().includes(googleSearchTerm.toLowerCase())
        ).length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-8">No results found.</div>
        )}
      </div>
    </div>
  );

  /* ===========================
     Add New (existing UI)
     =========================== */
  const renderAddNewColor = () => (
    <div className="overflow-y-auto scrollbar-hide p-2" style={{ maxHeight: "590px" }}>
      <div className="space-y-4 mt-2 animate-fade-in">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Layer Name
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter layer name"
          />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-black font-medium rounded-lg border border-blue-200 text-sm transition-all duration-150"
          onClick={() => {
            setShowGoogleSearch(true);
            setGoogleSearchTerm(newName || "");
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
            <g>
              <path
                fill="#4285F4"
                d="M12 11v2.5h5.9c-.25 1.4-1.7 4-5.9 4-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5c2.1 0 3.5.8 4.3 1.5l2.9-2.9C17.2 2.7 14.8 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.7 0 9.5-4 9.5-9.5 0-.6-.1-1.1-.2-1.5H12z"
              />
              <path fill="#34A853" d="M3.6 7.1l2.4 1.8C7.1 7.1 9.3 5.5 12 5.5c2.1 0 3.5.8 4.3 1.5l2.9-2.9C17.2 2.7 14.8 2 12 2 8.1 2 4.7 4.1 3.6 7.1z" />
              <path fill="#FBBC05" d="M12 22c2.7 0 5.2-.9 7.1-2.4l-2.9-2.3C14.8 18.5 13.5 19 12 19c-3.6 0-6.5-2.9-6.5-6.5 0-.7.1-1.4.3-2.1l-2.4-1.8C2.2 10.1 2 11 2 12c0 5.5 4.5 10 10 10z" />
              <path fill="#EA4335" d="M22 12c0-.6-.1-1.1-.2-1.5H12v3h5.9c-.25 1.4-1.7 4-5.9 4-2.5 0-4.6-1.5-5.4-3.6l-2.4 1.8C4.7 19.9 8.1 22 12 22c5.7 0 9.5-4 9.5-9.5z" />
            </g>
          </svg>
          Search on Google
        </button>

        <div className="w-full">
          <div className="flex border-b mb-2">
            <button
              className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-all duration-150 ${
                newTab === "Color"
                  ? "border-blue-500 text-blue-700 bg-blue-50"
                  : "border-transparent text-slate-600 bg-white"
              }`}
              onClick={() => setNewTab("Color")}
            >
              Color
            </button>
            <button
              className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-all duration-150 ${
                newTab === "Structure"
                  ? "border-blue-500 text-blue-700 bg-blue-50"
                  : "border-transparent text-slate-600 bg-white"
              }`}
              onClick={() => setNewTab("Structure")}
            >
              Structure
            </button>
          </div>

          {newTab === "Color" ? (
            <div className="flex flex-col items-center justify-center min-h-[120px] border border-dashed border-slate-300 rounded-lg p-4 text-slate-400 text-sm">
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col items-center border border-dashed border-slate-300 rounded-lg p-2 min-h-[120px] justify-center">
                  <label className="block text-xs text-slate-500 mb-2">
                    Drag and drop file to pick a color from it.
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="add-color-image-upload"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setNewImage(ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="add-color-image-upload"
                    className="cursor-pointer text-blue-600 underline text-xs"
                  >
                    Select File
                  </label>
                  {newImage && (
                    <img
                      src={newImage}
                      alt="Selected"
                      className="mt-2 w-12 h-12 object-cover rounded"
                    />
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-20 h-20 border border-slate-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-center"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[120px] border border-dashed border-slate-300 rounded-lg p-4 text-slate-400 text-sm">
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col items-center border border-dashed border-slate-300 rounded-lg p-2 min-h-[120px] justify-center">
                  <label className="block text-xs text-slate-500 mb-2">
                    Drag and drop file to pick a structure image.
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="add-structure-image-upload"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setNewImage(ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="add-structure-image-upload"
                    className="cursor-pointer text-blue-600 underline text-xs"
                  >
                    Select File
                  </label>
                  {newImage && (
                    <img
                      src={newImage}
                      alt="Selected"
                      className="mt-2 w-12 h-12 object-cover rounded"
                    />
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-20 h-20 border border-slate-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-center"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Product Code
          </label>
          <input
            type="text"
            value={typeof window !== "undefined" ? window.newProductCode || "" : ""}
            onChange={(e) => {
              if (typeof window !== "undefined") window.newProductCode = e.target.value;
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Add a Manufacturer
          </label>
          <select
            value={typeof window !== "undefined" ? window.newManufacturer || "" : ""}
            onChange={(e) => {
              if (typeof window !== "undefined") window.newManufacturer = e.target.value;
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Manufacturer</option>
            <option value="Paints">Paints</option>
            <option value="Sherwin Williams">Sherwin Williams</option>
            <option value="Manufacturer 3">Manufacturer 3</option>
            <option value="Manufacturer 4">Manufacturer 4</option>
            <option value="Manufacturer 5">Manufacturer 5</option>
          </select>
        </div>
      </div>
    </div>
  );

  /* ===========================
     Edit form (existing UI)
     =========================== */
  const renderEditLayer = () =>
    showGoogleSearch ? (
      renderGoogleSearchPanel()
    ) : (
      <div className="overflow-y-auto scrollbar-hide p-2" style={{ maxHeight: editMode ? "590px" : "380px" }}>
        <div className="space-y-4 mt-2 animate-fade-in">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Layer Name
              </label>
              <input
                type="text"
                value={itemToEdit.name}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50  text-black font-medium rounded-lg border border-blue-200 text-sm transition-all duration-150"
              onClick={() => {
                setShowGoogleSearch(true);
                setGoogleSearchTerm(itemToEdit.name || "");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                <g>
                  <path
                    fill="#4285F4"
                    d="M12 11v2.5h5.9c-.25 1.4-1.7 4-5.9 4-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5c2.1 0 3.5.8 4.3 1.5l2.9-2.9C17.2 2.7 14.8 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.7 0 9.5-4 9.5-9.5 0-.6-.1-1.1-.2-1.5H12z"
                  />
                  <path fill="#34A853" d="M3.6 7.1l2.4 1.8C7.1 7.1 9.3 5.5 12 5.5c2.1 0 3.5.8 4.3 1.5l2.9-2.9C17.2 2.7 14.8 2 12 2 8.1 2 4.7 4.1 3.6 7.1z" />
                  <path fill="#FBBC05" d="M12 22c2.7 0 5.2-.9 7.1-2.4l-2.9-2.3C14.8 18.5 13.5 19 12 19c-3.6 0-6.5-2.9-6.5-6.5 0-.7.1-1.4.3-2.1l-2.4-1.8C2.2 10.1 2 11 2 12c0 5.5 4.5 10 10 10z" />
                  <path fill="#EA4335" d="M22 12c0-.6-.1-1.1-.2-1.5H12v3h5.9c-.25 1.4-1.7 4-5.9 4-2.5 0-4.6-1.5-5.4-3.6l-2.4 1.8C4.7 19.9 8.1 22 12 22c5.7 0 9.5-4 9.5-9.5z" />
                </g>
              </svg>
              Search on Google
            </button>

            <EditTabs itemToEdit={itemToEdit} setItemToEdit={setItemToEdit} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Product Code
              </label>
              <input
                type="text"
                value={itemToEdit.productCode || ""}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, productCode: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Add a Manufacturer
              </label>
              <select
                value={itemToEdit.manufacturer || ""}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, manufacturer: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Manufacturer</option>
                <option value="Paints">Paints</option>
                <option value="Sherwin Williams">Sherwin Williams</option>
                <option value="Manufacturer 3">Manufacturer 3</option>
                <option value="Manufacturer 4">Manufacturer 4</option>
                <option value="Manufacturer 5">Manufacturer 5</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );

  /* ===========================
     Manage Layers (FULL SCREEN)
     =========================== */
 /* ===========================
   Manage Layers (FULL SCREEN)
   =========================== */
const renderManageLayersPage = () => {
 

  const manufacturerList = [
    "All Manufacturer",
    ...Array.from(new Set(cabinetOptions.map((c) => c.manufacturer || "-"))),
  ];

  const rows = cabinetOptions.filter((r) => {
    const passName =
      r.name.toLowerCase().includes(manageSearch.toLowerCase()) ||
      (r.productCode || "").toLowerCase().includes(manageSearch.toLowerCase());
    const passMfg =
      manageManufacturer === "All Manufacturer" ||
      (r.manufacturer || "-") === manageManufacturer;
    return passName && passMfg;
  });

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / managePageSize));
  const currentPage = Math.min(managePage, totalPages);
  const startIdx = (currentPage - 1) * managePageSize;
  const pageRows = rows.slice(startIdx, startIdx + managePageSize);

  const allOnPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r._id));

  const toggleRow = (id) => {
    setSelectedIds((s) => {
      const copy = new Set(s);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };
  const selectPage = (list) => {
    setSelectedIds((s) => {
      const copy = new Set(s);
      for (const r of list) copy.add(r._id);
      return copy;
    });
  };
  const deselectPage = (list) => {
    setSelectedIds((s) => {
      const copy = new Set(s);
      for (const r of list) copy.delete(r._id);
      return copy;
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setCabinetOptions((prev) => prev.filter((r) => !selectedIds.has(r._id)));
    setSelectedIds(new Set());
    showToast && showToast("Deleted", "Selected layers removed.");
    setHasChanges(true);
  };

  const handleBulkUploadAdd = (rowsToAdd) => {
    const shaped = rowsToAdd.map((r, i) => ({
      _id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now() + i),
      ...r,
    }));
    setCabinetOptions((prev) => [...shaped, ...prev]);
    showToast && showToast("Uploaded", `${rowsToAdd.length} layer(s) added.`);
    setHasChanges(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f7f8fb] flex">
      <div className="flex-1 m-4 rounded-2xl bg-white shadow-lg border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            Manage Layer <span className="text-slate-400">-</span>
            <span className="text-blue-600 font-bold">Door</span>
          </h3>

          {/* 🔹 Edit toggle + Save Changes */}
          <div className="ml-4 flex items-center gap-3 text-sm">
            <span className="text-slate-600 font-medium text-lg">Edit</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showBulkEdit}
                onChange={(e) => {
                  setShowBulkEdit(e.target.checked);
                  if (!e.target.checked) setHasChanges(false);
                }}
              />
              <span
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                  "bg-slate-200 peer-checked:bg-blue-600"
                } before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-5 before:h-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 ${
                  showBulkEdit ? "peer-checked:before:translate-x-5" : ""
                }`}
              />
            </label>

            {showBulkEdit && (
              <button
                disabled={!hasChanges}
                onClick={() => {
                  setHasChanges(false);
                  setShowBulkEdit(false); // 🔹 Auto close edit toggle
                  showToast &&
                    showToast("Saved", "Changes have been saved successfully.");
                }}
                className={`px-3 py-2 rounded-lg font-medium ${
                  hasChanges
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-200 text-white cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              className="px-3 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 font-medium flex items-center gap-1 disabled:opacity-50"
              onClick={handleBulkDelete}
              disabled={selectedIds.size === 0}
            >
              Delete
            </button>

            <button
              className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-medium flex items-center gap-1"
              onClick={() => setShowBulkUpload(true)}
            >
              Bulk Upload
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowManageLayers(false)}
              className="ml-2 w-9 h-9 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-5 pb-3 mt-2 flex items-center gap-3">
          <select
            className="border rounded-lg px-3 py-2 bg-white"
            value={managePageSize}
            onChange={(e) => {
              setManagePageSize(Number(e.target.value));
              setManagePage(1);
            }}
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                Show {n}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg px-3 py-2 bg-white"
            value={manageManufacturer}
            onChange={(e) => {
              setManageManufacturer(e.target.value);
              setManagePage(1);
            }}
          >
            {manufacturerList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <div className="ml-auto">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-lg px-4 py-2 w-72"
              value={manageSearch}
              onChange={(e) => {
                setManageSearch(e.target.value);
                setManagePage(1);
              }}
            />
          </div>
        </div>

        {/* Table area */}
        <div className="flex-1 overflow-auto px-5">
          <div className="overflow-auto border rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={(e) => {
                        if (e.target.checked) selectPage(pageRows);
                        else deselectPage(pageRows);
                      }}
                    />
                  </th>
                  <th className="p-3 text-left">Preview</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Product Code</th>
                  <th className="p-3 text-left">Manufacturer</th>
                  <th className="p-3 text-left">Hex</th>
                  <th className="p-3 text-left">Grade</th>
                  <th className="p-3 text-left">Design Type</th>
                  <th className="p-3 text-left">Option</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pageRows.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(r._id)}
                        onChange={() => toggleRow(r._id)}
                      />
                    </td>

                    {/* Preview */}
                    <td className="p-3">
                      <div
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: r.color }}
                      />
                    </td>

                    {/* Editable fields */}
                    <td className="p-3">
                      {showBulkEdit ? (
                        <input
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={r.name}
                          onChange={(e) => {
                            setCabinetOptions((prev) =>
                              prev.map((x) =>
                                x._id === r._id ? { ...x, name: e.target.value } : x
                              )
                            );
                            setHasChanges(true);
                          }}
                        />
                      ) : (
                        r.name
                      )}
                    </td>

                    <td className="p-3">
                      {showBulkEdit ? (
                        <input
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={r.productCode}
                          onChange={(e) => {
                            setCabinetOptions((prev) =>
                              prev.map((x) =>
                                x._id === r._id
                                  ? { ...x, productCode: e.target.value }
                                  : x
                              )
                            );
                            setHasChanges(true);
                          }}
                        />
                      ) : (
                        r.productCode || "-"
                      )}
                    </td>

                    <td className="p-3">
                      {showBulkEdit ? (
                        <input
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={r.manufacturer}
                          onChange={(e) => {
                            setCabinetOptions((prev) =>
                              prev.map((x) =>
                                x._id === r._id
                                  ? { ...x, manufacturer: e.target.value }
                                  : x
                              )
                            );
                            setHasChanges(true);
                          }}
                        />
                      ) : (
                        r.manufacturer || "-"
                      )}
                    </td>

                    <td className="p-3">
                      {showBulkEdit ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={r.color}
                            onChange={(e) => {
                              setCabinetOptions((prev) =>
                                prev.map((x) =>
                                  x._id === r._id ? { ...x, color: e.target.value } : x
                                )
                              );
                              setHasChanges(true);
                            }}
                          />
                          <input
                            className="border rounded px-2 py-1 text-sm flex-1"
                            value={r.color}
                            onChange={(e) => {
                              setCabinetOptions((prev) =>
                                prev.map((x) =>
                                  x._id === r._id ? { ...x, color: e.target.value } : x
                                )
                              );
                              setHasChanges(true);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded border"
                            style={{ backgroundColor: r.color }}
                          />
                          <span className="text-xs font-mono">
                            {r.color?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      {showBulkEdit ? (
                        <input
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={r.grade}
                          onChange={(e) => {
                            setCabinetOptions((prev) =>
                              prev.map((x) =>
                                x._id === r._id ? { ...x, grade: e.target.value } : x
                              )
                            );
                            setHasChanges(true);
                          }}
                        />
                      ) : (
                        r.grade
                      )}
                    </td>

                    {/* Read only fields */}
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-slate-100">
                        {r.designType || "Color"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {r.option || "Cabinet"}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        className="px-2 py-1 rounded-md border text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCabinetOptions((prev) =>
                            prev.filter((x) => x._id !== r._id)
                          );
                          setHasChanges(true);
                          showToast &&
                            showToast("Item Deleted", `${r.name} has been removed`);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-slate-400">
                      No entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing {Math.min(total, startIdx + 1)} to{" "}
            {Math.min(total, startIdx + pageRows.length)} of {total} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-md border hover:bg-slate-100 disabled:opacity-50"
              disabled={currentPage <= 1}
              onClick={() => setManagePage((p) => Math.max(1, p - 1))}
            >
              ‹
            </button>
            <span className="px-2 py-1 rounded-md bg-purple-600 text-white text-sm">
              {currentPage}
            </span>
            <button
              className="w-8 h-8 rounded-md border hover:bg-slate-100 disabled:opacity-50"
              disabled={currentPage >= totalPages}
              onClick={() => setManagePage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        open={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onUpload={handleBulkUploadAdd}
      />
    </div>
  );
};

  /* ===========================
     END Manage Layers Page
     =========================== */

  /* ===========================
     Helpers
     =========================== */
  const handleClosePanel = () => {
    if (typeof window !== "undefined" && window.onHideUndoRedo) {
      window.onHideUndoRedo();
    }
    onBack && onBack();
    onClose && onClose();
  };

  /* ===========================
     RENDER
     =========================== */
  return (
    <>
      {showManageLayers ? (
        renderManageLayersPage()
      ) : (
        <div
          className={`absolute top-0 left-0 z-50 h-full w-[350px] bg-white shadow-2xl flex flex-col transform transition-all duration-700 ease-out ${
            isMounted ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
          style={{ maxHeight: "100vh" }}
        >
          {/* MAIN MODE */}
          {!showGoogleSearch && !(editMode && itemToEdit) && !showAddNew && (
            <div className="p-4 pb-24 flex flex-col gap-4">
              {/* Selection Header */}
              <div
                className={`flex items-center gap-4 relative p-4 border-2 rounded-2xl shadow-lg bg-gradient-to-r from-slate-50 to-white border-slate-200 transform transition-all duration-500 delay-200 ${
                  isMounted
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-4 opacity-0 scale-95"
                }`}
              >
                <div
                  className="relative w-20 h-20 rounded-xl border-2 group overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
                  style={{ backgroundColor: selected.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10"></div>
                  <button
                    onClick={handleClosePanel}
                    className="absolute inset-0 flex items-center justify-center opacity-100 transition-all duration-300 backdrop-blur-sm bg-white/30 text-slate-700 rounded-xl hover:bg-white/50"
                    title="Go Back"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 transition-transform duration-200 hover:scale-110"
                    >
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col text-sm space-y-1">
                  <p className="text-slate-500 font-semibold tracking-wide">
                    Confirmed Selection
                  </p>
                  <p className="font-semibold text-slate-800 truncate max-w-[180px]">
                    {selected.name}
                  </p>
                  <p className="font-semibold text-slate-600 truncate max-w-[180px]">
                    Manufacturer: {selected.manufacturer || "—"}
                  </p>
                  <p className="font-semibold text-slate-600 truncate max-w-[180px]">
                    ID: Chirag123
                  </p>
                </div>
              </div>

              {/* Top controls (search/filter/sort) */}
              <div
                className={`flex items-center px-2 justify-between transform transition-all duration-500 delay-300 ${
                  isMounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                } z-[9999] relative`}
              >
                {!showSearch && (
                  <h2 className="font-bold text-sm text-slate-800">All {title}</h2>
                )}
                <div className="flex gap-2 relative z-10">
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
                      <div className="relative flex items-center gap-2">
                        <div className="relative w-[13rem]">
                          <input
                            type="text"
                            className="transition-all duration-300 border-2 border-slate-200 rounded-full px-4 py-2 text-sm bg-white ring-gray-400 outline-none w-full pl-6 pr-10"
                            placeholder={`Search ${title}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                          />
                          <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 focus:outline-none"
                            onClick={() => {
                              setShowSearch(false);
                              setSearchTerm("");
                            }}
                            aria-label="Close search"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex gap-2">
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z"
                                />
                              </svg>
                            </button>

                            {showFilter && (
                              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[9999] py-2 px-2 animate-fade-in">
                                {["All", "Standard", "Upgrade1", "Upgrade2", "Upgrade3"].map(
                                  (grade) => (
                                    <button
                                      key={grade}
                                      className={`w-full flex items-center justify-between text-left px-5 py-2 rounded-xl transition-all duration-150 mb-1 last:mb-0 font-medium ${
                                        selectedGrade === grade
                                          ? "bg-blue-100 text-blue-700 shadow-inner"
                                          : "hover:bg-slate-100 text-slate-700"
                                      }`}
                                      onClick={() => {
                                        setSelectedGrade(grade);
                                        setShowFilter(false);
                                      }}
                                    >
                                      <span>{grade}</span>
                                    </button>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            className={`flex items-center justify-center text-sm font-bold border-2 border-slate-200 rounded-full w-10 h-10 transition-all duration-200 hover:scale-105 active:scale-95 z-50 ${
                              sortOrder === "A-Z" ? "text-gray-700" : "text-slate-600"
                            }`}
                            aria-label="Sort"
                            onClick={() =>
                              setSortOrder(sortOrder === "A-Z" ? "Z-A" : "A-Z")
                            }
                          >
                            {sortOrder === "A-Z" ? "A-Z" : "Z-A"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {!showSearch && (
                    <>
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z"
                            />
                          </svg>
                        </button>
                        {showFilter && (
                          <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[9999] py-2 px-2 animate-fade-in">
                            {["All", "Standard", "Upgrade1", "Upgrade2", "Upgrade3"].map(
                              (grade) => (
                                <button
                                  key={grade}
                                  className={`w-full flex items-center justify-between text-left px-5 py-2 rounded-xl transition-all duration-150 mb-1 last:mb-0 font-medium ${
                                    selectedGrade === grade
                                      ? "bg-blue-100 text-blue-700 shadow-inner"
                                      : "hover:bg-slate-100 text-slate-700"
                                  }`}
                                  onClick={() => {
                                    setSelectedGrade(grade);
                                    setShowFilter(false);
                                  }}
                                >
                                  <span>{grade}</span>
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        className={`flex items-center justify-center text-sm font-semibold border-2 border-slate-200 rounded-full w-10 h-10 transition-all duration-200 hover:scale-105 active:scale-95 z-50 ${
                          sortOrder === "A-Z" ? "text-gray-700" : "text-slate-600"
                        }`}
                        aria-label="Sort"
                        onClick={() =>
                          setSortOrder(sortOrder === "A-Z" ? "Z-A" : "A-Z")
                        }
                      >
                        {sortOrder === "A-Z" ? "A-Z" : "Z-A"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Grid */}
              <div
                className="overflow-y-auto scrollbar-hide p-2 "
                style={{ maxHeight: "383px" }}
              >
                <div className="grid grid-cols-3 gap-4 relative z-0">
                  {filteredOptions.map((item, index) => (
                    <div
                      key={item._id || index}
                      className={`group relative rounded-2xl border-2 p-3 cursor-pointer transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 ${
                        selected.name === item.name
                          ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-200/50"
                          : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                      } ${isMounted ? `opacity-100 translate-y-0` : "opacity-0 translate-y-4"}`}
                      onClick={() => setSelected(item)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* 3-dot menu */}
                      <button
                        className={`absolute top-[0.7rem] right-[0.7rem] z-10 p-1 rounded-full transition-all duration-200 ${
                          activeMenuIndex === index || hoveredIndex === index
                            ? "opacity-100 bg-white/80 hover:bg-white"
                            : "opacity-0 group-hover:opacity-100 bg-white/50"
                        }`}
                        onClick={(e) => handleMenuClick(index, e)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-black font-bold"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="5" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>

                      {activeMenuIndex === index && (
                        <div className="absolute top-8 right-3.5 z-20 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
                          <div className="flex">
                            <button
                              className="flex items-center justify-center p-1.5 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              onClick={(e) => handleEdit(item, e)}
                              title="Edit"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <div className="border-l border-gray-200 h-6 my-auto" />
                            <button
                              className="flex items-center justify-center p-1.5 text-red-600 hover:bg-gray-100 transition-colors duration-200"
                              onClick={(e) => handleDelete(item, e)}
                              title="Delete"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Swatch */}
                      <div
                        className={`w-full h-16 rounded-xl shadow-inner border border-slate-200/50 transition-all duration-300 ${
                          hoveredIndex === index ? "shadow-md scale-105" : ""
                        } ${
                          selected.name === item.name
                            ? "ring-2 ring-blue-400 ring-offset-2"
                            : ""
                        }`}
                        style={{ backgroundColor: item.color }}
                      >
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-white/20 via-transparent to-black/10"></div>
                      </div>

                      <p
                        title={item.name}
                        className={`text-xs mt-3 font-medium leading-tight transition-colors duration-200 line-clamp-2 ${
                          selected.name === item.name
                            ? "text-blue-700"
                            : hoveredIndex === index
                            ? "text-slate-800"
                            : "text-slate-600"
                        }`}
                      >
                        {item.name}
                      </p>
                    </div>
                  ))}

                  {/* Add New Layer tile */}
                  <div
                    className="group relative rounded-2xl border-2 p-3 cursor-pointer transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 border-dashed border-blue-400 bg-blue-50 flex flex-col items-center justify-center"
                    onClick={() => setShowAddNew(true)}
                    style={{ minHeight: "110px" }}
                  >
                    <div className="w-full h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-white/20 via-transparent to-blue-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <p className="text-xs mt-3 font-medium leading-tight text-blue-700">
                      Add New Layer
                    </p>
                  </div>

                  {/* Manage Layers tile */}
                  <div
                    className="group relative rounded-2xl border-2 p-3 cursor-pointer transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 border-slate-300 bg-white flex flex-col items-center justify-center"
                    onClick={() => setShowManageLayers(true)}
                    style={{ minHeight: "110px" }}
                  >
                    <div className="w-full h-16 rounded-xl flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-7 h-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7h18M3 12h18M3 17h18"
                        />
                      </svg>
                    </div>
                    <p className="text-xs mt-3 font-medium leading-tight text-slate-700">
                      Manage Layers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EDIT MODE */}
          {editMode && itemToEdit && !showGoogleSearch && (
            <div className="flex-1 flex flex-col p-4 pb-24 gap-4 min-h-0 max-h-[85vh]">
              <div className="mb-2 flex-shrink-0">
                <h2 className="font-bold text-md text-slate-800">Edit Layer</h2>
              </div>
              <div className="flex-1 scrollbar-hide">{renderEditLayer()}</div>
            </div>
          )}

          {/* ADD NEW */}
          {showAddNew && !showGoogleSearch && (
            <div className="flex-1 flex flex-col p-4 pb-24 gap-4 min-h-0 max-h-[85vh]">
              <div className="mb-2 flex-shrink-0">
                <h2 className="font-bold text-md text-slate-800">Add New Layer</h2>
              </div>
              <div className="flex-1 scrollbar-hide">{renderAddNewColor()}</div>
            </div>
          )}

          {/* GOOGLE SEARCH PANEL */}
          {showGoogleSearch && (
            <div className="flex-1 flex flex-col">{renderGoogleSearchPanel()}</div>
          )}

          {/* BOTTOM ACTION BAR */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t-4">
            {showAddNew ? (
              <div className="flex justify-between items-center gap-4">
                <button
                  className="flex items-center justify-center px-4 py-2 rounded-xl text-white font-semibold text-base border border-gray-600 bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-black/50 transition-all duration-200 w-32"
                  onClick={() => {
                    setShowAddNew(false);
                    setNewColor("#ffffff");
                    setNewName("");
                    setNewImage(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-white font-semibold text-base border border-gray-600 bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-black/50 transition-all duration-200 flex-1"
                  onClick={() => {
                    if (newName.trim() === "") return;
                    const newOption = {
                      _id:
                        typeof crypto !== "undefined" && crypto.randomUUID
                          ? crypto.randomUUID()
                          : String(Date.now()),
                      name: newName,
                      color: newColor,
                      grade: "Custom",
                      image: newImage,
                      productCode:
                        typeof window !== "undefined" ? window.newProductCode || "" : "",
                      manufacturer:
                        typeof window !== "undefined" ? window.newManufacturer || "" : "",
                      designType: "Color",
                      option: "Door",
                    };
                    setCabinetOptions([newOption, ...cabinetOptions]);
                    setSelected(newOption);
                    setShowAddNew(false);
                    setNewColor("#ffffff");
                    setNewName("");
                    setNewImage(null);
                    if (showToast) showToast("New Color Added", `${newName} has been added.`);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Add Layer
                </button>
              </div>
            ) : editMode && itemToEdit ? (
              <div className="flex justify-between items-center gap-4">
                <button
                  className="flex items-center justify-center px-4 py-2 rounded-xl text-white font-semibold text-base border border-gray-600 bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-black/50 transition-all duration-200 w-32"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-white font-semibold text-base border border-gray-600 bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-black/50 transition-all duration-200 flex-1"
                  onClick={handleSaveEdit}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Update Layer
                </button>
              </div>
            ) : showGoogleSearch ? (
              <div className="flex justify-between items-center gap-4">
                <button
                  className="flex items-center justify-center px-4 py-2 rounded-xl text-white font-semibold text-base border border-gray-600 bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-black/50 transition-all duration-200 w-40"
                  onClick={() => setShowGoogleSearch(false)}
                >
                  Back to Edit
                </button>
              </div>
            ) : (
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
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-white font-semibold text-base border border-gray-600 bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-black/50 transition-all duration-200 flex-1"
                  onClick={() => {
                    onConfirm && onConfirm(selected);
                    if (showToast)
                      showToast("Changes Applied!", "1 tile(s) have been applied to your design.");
                    onClose && onClose();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

