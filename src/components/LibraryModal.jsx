import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import BulkUploadModal from "./BulkUploadModal";
import Toast from "./Toast";


export default function LibraryModal({
  open,
  onClose,
  layers: initialLayers = [],
}) {
  const [activeTab, setActiveTab] = useState("local");
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [localLayers, setLocalLayers] = useState(initialLayers);
  const [selected, setSelected] = useState([]);
  const [bulkOpen, setBulkOpen] = useState(false);

  // Pagination states
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  if (!open) return null;

  // ----- Data Source (Local vs Global) -----
  const layers = activeTab === "local" ? localLayers : localLayers; // global is same for now

  // ---- Extract unique Manufacturers & Design Types ----
  const manufacturers = useMemo(() => {
    const names = layers.map((l) => l.manufacturer).filter(Boolean);
    return [...new Set(names)];
  }, [layers]);

  const designTypes = useMemo(() => {
    const types = layers.map((l) => l.designType).filter(Boolean);
    return [...new Set(types)];
  }, [layers]);

  // ---- Filtered layers ----
  const filteredLayers = layers.filter(
    (l) =>
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.manufacturer?.toLowerCase().includes(search.toLowerCase()) ||
      l.productCode?.toLowerCase().includes(search.toLowerCase())
  );

  // ---- Pagination slice ----
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedLayers = filteredLayers.slice(start, end);
  const totalPages = Math.ceil(filteredLayers.length / pageSize);

  // ---- Select All ----
  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(paginatedLayers.map((_, i) => i + start));
    } else {
      setSelected([]);
    }
  };

  // ---- Delete Selected (local only) ----
  const deleteSelected = () => {
  if (activeTab === "local") {
    const remaining = localLayers.filter((_, idx) => !selected.includes(idx));
    setLocalLayers(remaining);

    showToast("Selected layer(s) deleted", "success");
  }
  setSelected([]);
};

  // ---- Delete single row ----
const deleteRow = (idx) => {
  if (activeTab === "local") {
    const remaining = localLayers.filter((_, i) => i !== idx);
    setLocalLayers(remaining);
    setSelected((prev) => prev.filter((i) => i !== idx));

    showToast("Layer deleted", "success");
  }
};

  // ---- Update field in edit mode ----
  const updateLayerField = (idx, field, value) => {
    if (activeTab === "local") {
      setLocalLayers((prev) =>
        prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
      );
    }
  };

  // ---- Clone to Local ----
  const cloneToLocal = () => {
  const selectedLayers = filteredLayers.filter((_, idx) =>
    selected.includes(idx + start)
  );

  setLocalLayers((prev) => {
    const existingCodes = new Set(prev.map((l) => l.productCode));
    const newOnes = selectedLayers.filter(
      (l) => !existingCodes.has(l.productCode)
    );

    if (newOnes.length > 0) {
      showToast(`${newOnes.length} layer(s) added to local library successfully`, "success");
    } else {
      showToast("Selected layers already exist in local library", "error");
    }

    return [...prev, ...newOnes];
  });

  setSelected([]);
};

  return createPortal(
    <>
      {/* Bulk Upload Modal */}
   <BulkUploadModal
  open={bulkOpen}
  onClose={() => setBulkOpen(false)}
  onUpload={(rows) => {
    setLocalLayers((prev) => [...prev, ...rows]);
    setBulkOpen(false);
    showToast(`${rows.length} layer(s) uploaded successfully`, "success");
  }}
/>

      <div className="fixed inset-0 z-[10000] bg-white flex items-center justify-center">
        <div className="w-[98%] h-[95%] rounded-xl bg-white shadow-xl border flex flex-col overflow-hidden">

          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
            {/* Left Side */}
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold mr-6">
                Library - Cabinet
              </h1>

              {/* Local / Global Segmented Toggle */}
              <div className="inline-flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => {
                    setActiveTab("local");
                    setSelected([]);
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    activeTab === "local"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Local
                </button>
                <button
                  onClick={() => {
                    setActiveTab("global");
                    setSelected([]);
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    activeTab === "global"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Global
                </button>
              </div>

              {/* Action Buttons */}
              {activeTab === "local" ? (
                <>
                  <button
                    disabled={selected.length === 0}
                    className={`px-4 py-2 rounded-md text-sm ${
                      selected.length === 0
                        ? "bg-blue-300 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    + Add {selected.length > 0 ? selected.length : ""}{" "}
                    {selected.length === 1
                      ? "to Layer"
                      : selected.length > 1
                      ? "to Layers"
                      : "to Layer"}
                  </button>

                  <button
                    onClick={deleteSelected}
                    disabled={selected.length === 0}
                    className="bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Delete
                  </button>

                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
                    + Add Layer
                  </button>
                  <button
                    onClick={() => setBulkOpen(true)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Bulk Upload
                  </button>

                  {/* Edit toggle */}
                  <div className="flex items-center gap-2 ml-6">
                    <span className="text-lg">Edit</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={editMode}
                        onChange={() => setEditMode(!editMode)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <button
                    disabled={selected.length === 0}
                    className={`px-4 py-2 rounded-md text-sm ${
                      selected.length === 0
                        ? "bg-blue-300 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    + Add {selected.length > 0 ? selected.length : ""}{" "}
                    {selected.length === 1
                      ? "to Layer"
                      : selected.length > 1
                      ? "to Layers"
                      : "to Layer"}
                  </button>

                  <button
                    onClick={cloneToLocal}
                    disabled={selected.length === 0}
                    className={`px-4 py-2 rounded-md text-sm ${
                      selected.length === 0
                        ? "bg-blue-300 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    Clone to Local
                  </button>
                </>
              )}
            </div>

            {/* Right Side → Close */}
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded bg-slate-200 hover:bg-slate-300 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Filters row */}
          <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
            <div className="flex items-center gap-3">
              <select
                className="border rounded px-3 py-2 text-sm"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>

              {/* Design Type Dropdown */}
              <select className="border rounded px-3 py-2 text-sm">
                <option value="">All Types</option>
                {designTypes.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Manufacturer Dropdown */}
              <select className="border rounded px-3 py-2 text-sm">
                <option value="">All Manufacturers</option>
                {manufacturers.map((m, i) => (
                  <option key={i} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 text-sm w-64"
            />
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="px-2 py-2 border">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === paginatedLayers.length &&
                        paginatedLayers.length > 0
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-2 py-2 border">Preview</th>
                  <th className="px-2 py-2 border">Title</th>
                  <th className="px-2 py-2 border">Product Code</th>
                  <th className="px-2 py-2 border">Manufacturer</th>
                  <th className="px-2 py-2 border">Hex</th>
                  <th className="px-2 py-2 border">Design Type</th>
                  <th className="px-2 py-2 border">Option</th>
                  <th className="px-2 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLayers.length > 0 ? (
                  paginatedLayers.map((layer, idx) => {
                    const realIdx = start + idx;
                    return (
                      <tr key={realIdx} className="border-b hover:bg-slate-50">
                        <td className="px-4 py-5 text-center">
                          <input
                            type="checkbox"
                            checked={selected.includes(realIdx)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelected((prev) => [...prev, realIdx]);
                              } else {
                                setSelected((prev) =>
                                  prev.filter((i) => i !== realIdx)
                                );
                              }
                            }}
                          />
                        </td>
                        <td className="px-4 py-5 text-center">
                          {layer.image ? (
                            <img
                              src={layer.image}
                              alt=""
                              className="w-16 h-16 rounded border object-cover mx-auto"
                            />
                          ) : (
                            <div
                              className="w-16 h-16 rounded border mx-auto"
                              style={{ backgroundColor: layer.color || "#ccc" }}
                            />
                          )}
                        </td>
                        {/* Editable fields */}
                        <td className="px-4 py-5">
                          {editMode && activeTab === "local" ? (
                            <input
                              value={layer.name}
                              onChange={(e) =>
                                updateLayerField(realIdx, "name", e.target.value)
                              }
                              className="border px-3 py-2 w-full rounded"
                            />
                          ) : (
                            layer.name || "-"
                          )}
                        </td>
                        <td className="px-4 py-5">
                          {editMode && activeTab === "local" ? (
                            <input
                              value={layer.productCode}
                              onChange={(e) =>
                                updateLayerField(
                                  realIdx,
                                  "productCode",
                                  e.target.value
                                )
                              }
                              className="border px-3 py-2 w-full rounded"
                            />
                          ) : (
                            layer.productCode || "-"
                          )}
                        </td>
                        <td className="px-4 py-5">
                          {editMode && activeTab === "local" ? (
                            <input
                              value={layer.manufacturer}
                              onChange={(e) =>
                                updateLayerField(
                                  realIdx,
                                  "manufacturer",
                                  e.target.value
                                )
                              }
                              className="border px-3 py-2 w-full rounded"
                            />
                          ) : (
                            layer.manufacturer || "-"
                          )}
                        </td>
                        <td className="px-4 py-5">
                          {editMode && activeTab === "local" ? (
                            <input
                              value={layer.color}
                              onChange={(e) =>
                                updateLayerField(realIdx, "color", e.target.value)
                              }
                              className="border px-3 py-2 w-full rounded"
                            />
                          ) : (
                            layer.color || "-"
                          )}
                        </td>
                        <td className="px-4 py-5">{layer.designType || "-"}</td>
                        <td className="px-4 py-5">{layer.option || "-"}</td>
                        <td className="px-4 pb-5 pt-8 flex gap-2 justify-center">
                          {activeTab === "local" && (
                            <button
                              onClick={() => deleteRow(realIdx)}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            >
                              {/* Trash SVG */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M9 3h6a1 1 0 0 1 1 1v1h5v2H3V5h5V4a1 1 0 0 1 1-1zm-2 6h10l-1 11H8L7 9z" />
                              </svg>
                            </button>
                          )}
                          <button className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                            +
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="py-10 text-center text-slate-500">
                      No options found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t text-sm text-slate-600">
            <span>
              Showing {start + 1} to{" "}
              {Math.min(end, filteredLayers.length)} of {filteredLayers.length} entries
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-slate-200 disabled:opacity-50"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded bg-slate-200 disabled:opacity-50"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
