// EditTabs component for Color/Structure tabs UI

import { useState, useEffect } from "react";

// EditTabs component for Color/Structure tabs UI
function EditTabs({ itemToEdit, setItemToEdit }) {
  const [tab, setTab] = useState("Color");
  // For image preview
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
          className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-all duration-150 ${tab === "Color" ? "border-blue-500 text-blue-700 bg-blue-50" : "border-transparent text-slate-600 bg-white"}`}
          onClick={() => setTab("Color")}
        >
          Color
        </button>
        <button
          className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-all duration-150 ${tab === "Structure" ? "border-blue-500 text-blue-700 bg-blue-50" : "border-transparent text-slate-600 bg-white"}`}
          onClick={() => setTab("Structure")}
        >
          Structure
        </button>
      </div>
      {tab === "Color" ? (
        <div className="flex flex-col items-center justify-center min-h-[120px] border border-dashed border-slate-300 rounded-lg p-4 text-slate-400 text-sm">
        <div className="flex gap-4">
          {/* Color picker and image select */}
          <div className="flex-1 flex flex-col items-center border border-dashed border-slate-300 rounded-lg p-2 min-h-[120px] justify-center">
            <label className="block text-xs text-slate-500 mb-2">Drag and drop file to pick a color from it.</label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="color-image-upload"
              onChange={handleImageChange}
            />
            <label htmlFor="color-image-upload" className="cursor-pointer text-blue-600 underline text-xs">Select File</label>
            {image && (
              <img src={image} alt="Selected" className="mt-2 w-12 h-12 object-cover rounded" />
            )}
          </div>
          <div className="flex-1 flex flex-col items-center">
            <input
              type="color"
              value={itemToEdit.color}
              onChange={(e) => setItemToEdit({ ...itemToEdit, color: e.target.value })}
              className="w-20 h-20 border border-slate-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={itemToEdit.color}
              onChange={(e) => setItemToEdit({ ...itemToEdit, color: e.target.value })}
              className="mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-center"
            />
          </div>
        </div></div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[120px] border border-dashed border-slate-300 rounded-lg p-4 text-slate-400 text-sm">
           <div className="flex gap-4">
          {/* Color picker and image select */}
          <div className="flex-1 flex flex-col items-center border border-dashed border-slate-300 rounded-lg p-2 min-h-[120px] justify-center">
            <label className="block text-xs text-slate-500 mb-2">Drag and drop file to pick a color from it.</label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="color-image-upload"
              onChange={handleImageChange}
            />
            <label htmlFor="color-image-upload" className="cursor-pointer text-blue-600 underline text-xs">Select File</label>
            {image && (
              <img src={image} alt="Selected" className="mt-2 w-12 h-12 object-cover rounded" />
            )}
          </div>
          <div className="flex-1 flex flex-col items-center">
            <input
              type="color"
              value={itemToEdit.color}
              onChange={(e) => setItemToEdit({ ...itemToEdit, color: e.target.value })}
              className="w-20 h-20 border border-slate-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={itemToEdit.color}
              onChange={(e) => setItemToEdit({ ...itemToEdit, color: e.target.value })}
              className="mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-center"
            />
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

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
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

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

  const handleMenuClick = (index, e) => {
    e.stopPropagation();
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  const handleEdit = (item, e) => {
    e.stopPropagation();
    setItemToEdit(item);
    setEditMode(true);
    setActiveMenuIndex(null);
    // showToast && showToast('Edit Mode', `${item.name} is ready for editing`);
  };

  const handleDelete = (item, e) => {
    e.stopPropagation();
    console.log("Deleting:", item.name);
    setActiveMenuIndex(null);
    showToast && showToast('Item Deleted', `${item.name} has been removed`);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setItemToEdit(null);
  };

  const handleSaveEdit = () => {
    // Add your save logic here
    console.log("Saving changes to:", itemToEdit);
    setEditMode(false);
    setItemToEdit(null);
    showToast && showToast('Layer Updated', `${itemToEdit.name} has been updated`);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenuIndex !== null) {
        setActiveMenuIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenuIndex]);

  // Edit form as a simple section, but inside a scrollable container like the grid
  const renderEditLayer = () => (
    <div className="overflow-y-auto scrollbar-hide p-2" style={{ maxHeight: '380px' }}>
      <div className="space-y-4 mt-2 animate-fade-in">
        <div className="space-y-4">
          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Layer Name</label>
            <input
              type="text"
              value={itemToEdit.name}
              onChange={(e) => setItemToEdit({...itemToEdit, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Search with Google button */}
          
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50  text-black font-medium rounded-lg border border-blue-200 text-sm transition-all duration-150"
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(itemToEdit.name || '')}`, '_blank')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><g><path fill="#4285F4" d="M12 11v2.5h5.9c-.25 1.4-1.7 4-5.9 4-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5c2.1 0 3.5.8 4.3 1.5l2.9-2.9C17.2 2.7 14.8 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.7 0 9.5-4 9.5-9.5 0-.6-.1-1.1-.2-1.5H12z"/><path fill="#34A853" d="M3.6 7.1l2.4 1.8C7.1 7.1 9.3 5.5 12 5.5c2.1 0 3.5.8 4.3 1.5l2.9-2.9C17.2 2.7 14.8 2 12 2 8.1 2 4.7 4.1 3.6 7.1z"/><path fill="#FBBC05" d="M12 22c2.7 0 5.2-.9 7.1-2.4l-2.9-2.3C14.8 18.5 13.5 19 12 19c-3.6 0-6.5-2.9-6.5-6.5 0-.7.1-1.4.3-2.1l-2.4-1.8C2.2 10.1 2 11 2 12c0 5.5 4.5 10 10 10z"/><path fill="#EA4335" d="M22 12c0-.6-.1-1.1-.2-1.5H12v3h5.9c-.25 1.4-1.7 4-5.9 4-2.5 0-4.6-1.5-5.4-3.6l-2.4 1.8C4.7 19.9 8.1 22 12 22c5.7 0 9.5-4 9.5-9.5z"/></g></svg>
              Search on Google
            </button>
          

          {/* Tabs for Color/Structure */}
          <EditTabs itemToEdit={itemToEdit} setItemToEdit={setItemToEdit} />

          {/* Product Code field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Code</label>
            <input
              type="text"
              value={itemToEdit.productCode || ''}
              onChange={(e) => setItemToEdit({ ...itemToEdit, productCode: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Add a Manufacturer</label>
            <select
              value={itemToEdit.manufacturer || ''}
              onChange={(e) => setItemToEdit({...itemToEdit, manufacturer: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Manufacturer</option>
              <option value="Manufacturer 1">Manufacturer 1</option>
              <option value="Manufacturer 2">Manufacturer 2</option>
              <option value="Manufacturer 3">Manufacturer 3</option>
              <option value="Manufacturer 4">Manufacturer 4</option>
              <option value="Manufacturer 5">Manufacturer 5</option>
            </select>
          </div>
          {/* Preview */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Preview</label>
            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
              <div 
                className="w-16 h-16 rounded-lg border border-slate-200"
                style={{ backgroundColor: itemToEdit.color }}
              ></div>
              <div>
                <p className="font-medium text-slate-800">{itemToEdit.name}</p>
                <p className="text-sm text-slate-600">Manufacturer: {itemToEdit.manufacturer || '-'}</p>
                <p className="text-sm text-slate-600">Product Code: {itemToEdit.productCode || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Normal Mode Content
  return (
    <div className={`absolute top-0 left-0 z-50 h-full w-[350px] bg-white shadow-2xl flex flex-col transform transition-all duration-700 ease-out ${isMounted ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
      <div className="p-4 pb-24 flex flex-col gap-4">
        {/* Enhanced Selection Header */}
        <div 
          className={`flex items-center gap-4 relative p-4 border-2 rounded-2xl shadow-lg bg-gradient-to-r from-slate-50 to-white border-slate-200 transform transition-all duration-500 delay-200 ${
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
              className="absolute inset-0 flex items-center justify-center opacity-100 transition-all duration-300 backdrop-blur-sm bg-white/30 text-slate-700 rounded-xl hover:bg-white/50"
              title="Go Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 transition-transform duration-200 hover:scale-110">
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
          className={`flex items-center justify-between transform transition-all duration-500 delay-300 ${isMounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} z-[9999] relative`}
        >
          {/* Show either All {title} or Edit Layer header */}
          {editMode && itemToEdit ? (
            <h2 className="font-bold text-sm text-slate-800">Edit Layer</h2>
          ) : (
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
                <div className="relative flex items-center">
                  <input
                    type="text"
                    className="transition-all duration-300 border-2 border-slate-200 rounded-full px-4 py-2 text-sm bg-white ring-gray-400 outline-none w-44 pl-6 pr-10"
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
        {/* Show edit form in place of grid if editing, otherwise show grid */}
        {editMode && itemToEdit ? (
          renderEditLayer()
        ) : (
          <div className="overflow-y-auto scrollbar-hide p-2" style={{ maxHeight: '383px' }}>
            <div className="grid grid-cols-3 gap-4 relative z-0">
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
                  onClick={() => setSelected(item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Three-dot menu button */}
                  <button
                    className={`absolute top-[0.7rem] right-[0.7rem] z-10 p-1 rounded-full transition-all duration-200 ${
                      activeMenuIndex === index || hoveredIndex === index
                        ? "opacity-100 bg-white/80 hover:bg-white"
                        : "opacity-0 group-hover:opacity-100 bg-white/50"
                    }`}
                    onClick={(e) => handleMenuClick(index, e)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                  {/* Menu dropdown */}
                  {activeMenuIndex === index && (
                   <div className="absolute top-8 right-3.5 z-20 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
                    <div className="flex">
                      <button
                        className="flex items-center justify-center p-1.5 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={(e) => handleEdit(item, e)}
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <div className="border-l border-gray-200 h-6 my-auto"></div>
                      <button
                        className="flex items-center justify-center p-1.5 text-red-600 hover:bg-gray-100 transition-colors duration-200"
                        onClick={(e) => handleDelete(item, e)}
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
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
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t-4">
        {editMode && itemToEdit ? (
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Update Layer
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
        )}
      </div>
    </div>
  );
}