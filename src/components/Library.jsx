import React from "react";

const Library = ({ open, onClose, onSelect }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 w-[300px] rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white drop-shadow">
            Choose Option
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSelect("google")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-white/20 text-white hover:bg-white/30 transition backdrop-blur-sm shadow"
          >
            <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 48 48"
  className="w-5 h-5"
>
  <path fill="#4285F4" d="M24 9.5c3.94 0 7.14 1.36 9.47 3.6l7-7C36.46 2.28 30.71 0 24 0 14.64 0 6.48 5.31 2.56 13.09l8.18 6.36C12.57 13.08 17.9 9.5 24 9.5z"/>
  <path fill="#34A853" d="M46.1 24.6c0-1.65-.15-3.22-.42-4.6H24v9.02h12.5c-.54 2.92-2.15 5.39-4.63 7.05l7.18 5.56C43.84 38.57 46.1 32.1 46.1 24.6z"/>
  <path fill="#FBBC05" d="M10.74 28.55A14.54 14.54 0 0 1 9.5 24c0-1.58.28-3.1.74-4.55l-8.18-6.36A23.9 23.9 0 0 0 0 24c0 3.91.94 7.6 2.56 10.91l8.18-6.36z"/>
  <path fill="#EA4335" d="M24 48c6.48 0 11.9-2.13 15.87-5.79l-7.18-5.56c-2 1.35-4.56 2.14-8.69 2.14-6.1 0-11.43-3.58-13.27-8.46l-8.18 6.36C6.48 42.69 14.64 48 24 48z"/>
</svg>
            <span className="font-medium">Google Library</span>
          </button>

          <button
            onClick={() => onSelect("library")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-white/20 text-white hover:bg-white/30 transition backdrop-blur-sm shadow"
          >
     <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 24 24"
  className="w-5 h-5 text-gray-800"
>
  <path d="M10 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" />
</svg>
            <span className="font-medium">Library</span>
          </button>

          <button
            onClick={() => onSelect("new")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-white/20 text-white hover:bg-white/30 transition backdrop-blur-sm shadow"
          >
            <span className="text-lg">➕</span>
            <span className="font-medium">Add New Layer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Library;
