// BulkUploadModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
/**
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onUpload: (rows: Array<{
 *        name: string,
 *        color?: string,            // from hex_code or rgb_code
 *        grade?: string,            // optional
 *        productCode?: string,
 *        manufacturer?: string,
 *        designType?: string,
 *        option?: string,           // default "Cabinet"
 *        image?: string             // passthrough layer_image as-is
 *    }>) => void
 */
export default function BulkUploadModal({ open, onClose, onUpload }) {
  const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Confirm, 4: Done
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState("");
  const [headers, setHeaders] = useState([]);   // array<string>
  const [rawRows, setRawRows] = useState([]);   // array<Record<header,value>>
  const [mapping, setMapping] = useState({
    title: "",
    manufacturer: "",
    layer_image: "",
    hex_code: "",
    rgb_code: "",
    product_code: "",
    design_type: "",
  });

  const csvInputRef = useRef(null);

  // Reset state whenever modal is closed
  useEffect(() => {
    if (!open) {
      setStep(1);
      setCsvFile(null);
      setError("");
      setHeaders([]);
      setRawRows([]);
      setMapping({
        title: "",
        manufacturer: "",
        layer_image: "",
        hex_code: "",
        rgb_code: "",
        product_code: "",
        design_type: "",
      });
    }
  }, [open]);

  if (!open) return null;

  // ---------- CSV Parsing (supports quoted fields & commas) ----------
  const parseCSV = (text) => {
    const rows = [];
    let i = 0;
    let cur = "";
    let inQuotes = false;
    let out = [];

    const pushCell = () => {
      out.push(cur);
      cur = "";
    };
    const pushRow = () => {
      rows.push(out);
      out = [];
    };

    while (i < text.length) {
      const c = text[i];

      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i += 2;
          continue;
        }
        inQuotes = !inQuotes;
        i++;
        continue;
      }

      if (!inQuotes && (c === "," || c === "\n" || c === "\r")) {
        if (c === ",") {
          pushCell();
        } else {
          pushCell();
          // only push non-empty row
          if (out.some((cell) => cell.trim() !== "")) {
            pushRow();
          }
          // swallow CRLF
          if (c === "\r" && text[i + 1] === "\n") i++;
        }
        i++;
        continue;
      }

      cur += c;
      i++;
    }

    // last cell/row
    pushCell();
    if (out.some((cell) => cell.trim() !== "")) pushRow();

    // trim trailing empty rows
    while (rows.length && rows[rows.length - 1].every((x) => x.trim() === "")) {
      rows.pop();
    }
    return rows;
  };

  // ---------- Mapping auto-guess ----------
  const autoMapGuess = (h) => {
    const key = String(h || "").toLowerCase().replace(/\s+/g, "_");
    if (/^name$|^title$/.test(key)) return "title";
    if (key.includes("manufact")) return "manufacturer";
    if (key.includes("image")) return "layer_image";
    if (key === "hex" || key.includes("hex_code")) return "hex_code";
    if (key === "rgb" || key.includes("rgb_code")) return "rgb_code";
    if (key.includes("product") && key.includes("code")) return "product_code";
    if (key.includes("design") && key.includes("type")) return "design_type";
    return "";
  };

  // ---------- Handle CSV file ----------
  const handleCsvPicked = async (file) => {
    setError("");
    try {
      const text = await file.text();
      const table = parseCSV(text);
      if (!table.length) {
        setError("CSV appears to be empty.");
        return;
      }
      const hdrs = table[0].map((h) => (h ?? "").trim()).filter(Boolean);
      if (!hdrs.length) {
        setError("Could not read CSV headers.");
        return;
      }
      const dataRows = table.slice(1).map((r) => {
        const obj = {};
        hdrs.forEach((h, i) => (obj[h] = ((r[i] ?? "") + "").trim()));
        return obj;
      });

      setHeaders(hdrs);
      setRawRows(dataRows);

      const initial = {
        title: "",
        manufacturer: "",
        layer_image: "",
        hex_code: "",
        rgb_code: "",
        product_code: "",
        design_type: "",
      };
      hdrs.forEach((h) => {
        const guess = autoMapGuess(h);
        if (guess && !initial[guess]) initial[guess] = h;
      });
      setMapping(initial);
    } catch (err) {
      console.error(err);
      setError("Failed to read CSV. Please check the file.");
    }
  };

  // ---------- Step validation ----------
  const canContinueStep1 = !!csvFile;

  const validateStep2 = () => {
    if (!mapping.title) {
      setError("Please map the Title field.");
      return false;
    }
    if (!mapping.hex_code && !mapping.rgb_code) {
      setError("Please map Hex Code or RGB Code.");
      return false;
    }
    setError("");
    return true;
  };

  // ---------- Build preview rows (no useMemo) ----------
  const buildPreviewRows = () => {
    if (!rawRows || rawRows.length === 0) return [];
    const getMapped = (row, key) => {
      const mapKey = mapping?.[key];
      return mapKey ? (row?.[mapKey] ?? "") : "";
    };
    return rawRows.map((row, idx) => {
      const hexRaw = (getMapped(row, "hex_code") || "").trim();
      const rgbRaw = (getMapped(row, "rgb_code") || "").trim();

      let colorStyle;
      if (hexRaw && /^#?[\da-fA-F]{3,8}$/.test(hexRaw)) {
        colorStyle = hexRaw.startsWith("#") ? hexRaw : `#${hexRaw}`;
      } else if (rgbRaw) {
        const match = rgbRaw.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
        if (match) {
          colorStyle = `rgb(${match.slice(1, 4).join(",")})`;
        }
      }

      return {
        n: idx + 1,
        title: getMapped(row, "title"),
        manufacturer: getMapped(row, "manufacturer"),
        layer_image: getMapped(row, "layer_image"),
        hex_code: hexRaw,
        rgb_code: rgbRaw,
        product_code: getMapped(row, "product_code"),
        design_type: getMapped(row, "design_type"),
        colorStyle,
      };
    });
  };

  // ---------- Build final rows to upload ----------
  const buildFinalRows = () => {
    const getMapped = (row, key) => {
      const mapKey = mapping?.[key];
      return mapKey ? (row?.[mapKey] ?? "") : "";
    };

    const normalized = rawRows.map((r) => {
      const title = getMapped(r, "title");
      const manufacturer = getMapped(r, "manufacturer");
      const productCode = getMapped(r, "product_code");
      const designType = getMapped(r, "design_type") || "Color";
      const layerImage = getMapped(r, "layer_image");

      const hexRaw = getMapped(r, "hex_code");
      const rgbRaw = getMapped(r, "rgb_code");

      // normalize color: prefer hex; fallback to rgb(r,g,b)
      let color = "";
      const hex = (hexRaw || "").trim();
      const rgb = (rgbRaw || "").trim();
      if (hex) {
        color = hex.startsWith("#") ? hex : `#${hex}`;
      } else if (rgb) {
        const match = rgb.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
        if (match) {
          const clamp = (n) => Math.max(0, Math.min(255, n | 0));
          const [r1, g1, b1] = match.slice(1, 4).map((x) => clamp(+x));
          color =
            "#" +
            [r1, g1, b1].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
        }
      }

      return {
        name: title || "",
        color,
        productCode,
        manufacturer,
        designType,
        option: "Cabinet",
        image: layerImage,
      };
    });

    // drop rows without name
    return normalized.filter((x) => x.name && x.name.trim() !== "");
  };

  // ---------- Navigation ----------
  const next = async () => {
    if (step === 1) {
      if (!canContinueStep1) return;
      await handleCsvPicked(csvFile);
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      setStep(3);
    } else if (step === 3) {
      const finalRows = buildFinalRows();
      onUpload(finalRows);
      setStep(4);
    }
  };

  const back = () => {
    if (step === 1) return;
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  // ---------- UI Pieces ----------
  const Stepper = () => (
    <div className="px-6 pt-5 pb-3 border-b bg-slate-50">
      <div className="flex items-center justify-between">
        {[
          { n: 1, label: "Upload" },
          { n: 2, label: "Map fields" },
          { n: 3, label: "Data\nconfirmation" },
          { n: 4, label: "Completed" },
        ].map((s, i, arr) => {
          const active = step === s.n;
          const done = step > s.n;
          return (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    done
                      ? "bg-green-500 text-white"
                      : active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-700",
                  ].join(" ")}
                >
                  {done ? "✓" : s.n}
                </div>
                <div className="mt-2 text-sm text-slate-700 text-center whitespace-pre-line">
                  {s.label}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="h-[2px] bg-slate-200 flex-1 mx-3">
                  <div
                    className={[
                      "h-full",
                      step > s.n ? "bg-green-500" : "bg-slate-200",
                    ].join(" ")}
                  />
                </div>
              )}
            </div>
          );
        })}
        <button
          onClick={onClose}
          className="ml-4 w-9 h-9 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center"
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );

  const Footer = ({ primaryText, onPrimary }) => (
    <div className="px-6 py-4 border-t flex justify-between">
      <button
        className="px-4 py-2 rounded-lg border hover:bg-slate-50"
        onClick={step === 1 ? onClose : back}
      >
        {step === 1 ? "Back" : "Back"}
      </button>
      <div className="flex gap-2">
        {error && (
          <div className="text-red-600 text-sm self-center mr-2">{error}</div>
        )}
        <button
          className={[
            "px-4 py-2 rounded-lg text-white",
            step === 4 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700",
          ].join(" ")}
          onClick={onPrimary}
          disabled={step === 1 && !canContinueStep1}
        >
          {primaryText}
        </button>
      </div>
    </div>
  );

  // ---------- Steps ----------
  const Step1 = () => (
    <div className="px-6 pb-6 space-y-5">
      <h3 className="text-xl font-semibold">New List</h3>

      {/* CSV dropzone */}
      <div
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50"
        onClick={() => csvInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f && /csv|text|ms-excel/.test(f.type)) {
            setCsvFile(f);
            setError("");
          }
        }}
      >
        <div className="text-slate-600 mb-2">Drag and Drop CSV file</div>
        <div className="text-blue-600 underline">Select File</div>
        {csvFile && (
          <div className="mt-2 text-xs text-slate-500">{csvFile.name}</div>
        )}
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setCsvFile(f);
              setError("");
            }
          }}
        />
      </div>

      {/* Help card */}
      <div className="rounded-xl border p-5 bg-slate-50">
        <div className="text-center space-y-2">
          <div className="font-semibold">What columns can my CSV have?</div>
          <div className="text-sm">
            Please see the{" "}
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => {
                const sample =
                  'title,manufacturer,layer_image,hex_code,rgb_code,product_code,design_type\n"Sample Layer 1","Manufacturer 1","image-01.jpg","#83C5BE","","code-01","Pattern"';
                const blob = new Blob([sample], { type: "text/csv;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "sample.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              sample file
            </button>
            .
          </div>

          <div className="pt-2 font-semibold">What should my data contain?</div>
          <div className="text-sm">
            Please download the{" "}
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => {
                const sample =
                  'title,manufacturer,layer_image,hex_code,rgb_code,product_code,design_type\n"Sample Layer 2","Manufacturer 2","","#000000","0,0,0","code-02","Color"\n"Sample Layer 3","Manufacturer 3","","#000000","0,0,0","code-03","Color"\n"Sample Layer 5","Manufacturer 5","image-03.jpg","","0,0,0","code-05","Pattern"';
                const blob = new Blob([sample], { type: "text/csv;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "sample-data.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              sample data
            </button>
            .
          </div>
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="px-6 pb-6 space-y-5">
      <h3 className="text-xl font-semibold">Mapping</h3>
      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-2 gap-0">
          <div className="bg-slate-50 px-4 py-3 font-semibold border-b">Fields</div>
          <div className="bg-slate-50 px-4 py-3 font-semibold border-b">CSV Headers</div>

          {[
            ["Title", "title"],
            ["Manufacturer", "manufacturer"],
            ["Layer Image", "layer_image"],
            ["Hex Code", "hex_code"],
            ["RGB Code", "rgb_code"],
            ["Product Code", "product_code"],
            ["Design Type", "design_type"],
          ].map(([label, key], idx, arr) => (
            <MappingRow
              key={key}
              label={label}
              headers={headers}
              value={mapping[key] || ""}
              onChange={(v) => setMapping((m) => ({ ...m, [key]: v }))}
              isLast={idx === arr.length - 1}
            />
          ))}
        </div>
      </div>
      <div className="text-sm text-slate-600">
        Tip: You must map <b>Title</b> and either <b>Hex Code</b> or <b>RGB Code</b>.
      </div>
    </div>
  );

  const Step3 = () => {
    const previewRows = buildPreviewRows();
    return (
      <div className="px-6 pb-6">
        <div className="overflow-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                {[
                  "N",
                  "PREVIEW",
                  "TITLE",
                  "MANUFACTURER",
                  "LAYER IMAGE",
                  "HEX CODE",
                  "RGB CODE",
                  "PRODUCT CODE",
                  "DESIGN TYPE",
                ].map((h) => (
                  <th key={h} className="p-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {previewRows.map((r) => (
                <tr key={r.n}>
                  <td className="p-3">{r.n}</td>
                  <td className="p-3">
                    {r.layer_image ? (
                      <img
                        src={r.layer_image}
                        alt=""
                        className="w-14 h-14 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-md border"
                        style={{ background: r.colorStyle || "#fff" }}
                      />
                    )}
                  </td>
                  <td className="p-3">{r.title}</td>
                  <td className="p-3">{r.manufacturer}</td>
                  <td className="p-3">{r.layer_image}</td>
                  <td className="p-3">{r.hex_code}</td>
                  <td className="p-3">{r.rgb_code}</td>
                  <td className="p-3">{r.product_code}</td>
                  <td className="p-3">{r.design_type}</td>
                </tr>
              ))}
              {previewRows.length === 0 && (
                <tr>
                  <td className="p-6 text-slate-400 text-center" colSpan={9}>
                    No rows found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const Step4 = () => (
    <div className="px-6 pb-6">
      <div className="rounded-xl border p-6 bg-green-50 text-green-900">
        <div className="text-xl font-semibold mb-1">Upload Complete</div>
        <div className="text-sm">Your layers have been added. You can safely close this dialog.</div>
      </div>
    </div>
  );

  // ---------- Render ----------
  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">

        {/* Stepper (fixed header) */}
        <Stepper />

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>

        {/* Footer (fixed bottom) */}
        {step === 1 && <Footer primaryText="Continue" onPrimary={next} />}
        {step === 2 && <Footer primaryText="Continue" onPrimary={next} />}
        {step === 3 && <Footer primaryText="Upload" onPrimary={next} />}
        {step === 4 && <Footer primaryText="Done" onPrimary={onClose} />}
      </div>
    </div>
  );

}

/* ---------------------------
 * Mapping row helper
 * -------------------------- */
function MappingRow({ label, headers = [], value, onChange, isLast }) {
  return (
    <>
      <div className={`px-4 py-3 border-b ${isLast ? "" : ""}`}>{label}</div>
      <div className="px-4 py-3 border-b">
        <select
          className="w-full border rounded-lg px-3 py-2 bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">— Not mapped —</option>
          {headers.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>
    </>,
  document.body
  );
}
