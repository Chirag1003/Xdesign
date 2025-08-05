import React from "react";
import { useState } from "react";
import TilePanel from "../components/TilePanel";
import Toast from "../components/Toast";
import SharePopup from "../components/SharePopup";
import removed from "../assets/removed.png"; // Assuming you have an image for branding
import timber from "../assets/timber rem.png"; // Assuming you have an image for branding
export default function Home() {
  const [autoFocusOn, setAutoFocusOn] = useState(false); // Auto Focus toggle state
  const [tileSelected, setTileSelected] = useState(false); // Track if a tile is selected but not confirmed
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullPreview(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  const [showTiles, setShowTiles] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showUndoRedo, setShowUndoRedo] = useState(false);
  const [changeHistory, setChangeHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [toast, setToast] = useState({ title: '', description: '', type: 'success' });
  const [showFAQ, setShowFAQ] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [fullPreview, setFullPreview] = useState(false); // New state for full preview
  const handleClose = () => setShowUnsavedModal(false);

  const showToast = (title, description = '', type = 'success') => setToast({ title, description, type });

  // const handleDownloadPDF = () => {
  //   showToast("PDF download started ", "PDF download initiated for demonstration.");
  // };

  const handleDownloadImage = () => {
    showToast("Image download started ", "Image download initiated for demonstration.");
  };

  const handleShare = () => {
    setShowSharePopup(true);
  };

  // Called when a tile is selected (not confirmed)
  const handleTileSelected = () => {
    setTileSelected(true);
  };

  // Called when user confirms selection
  const handleLayerConfirmed = () => {
    setUnsavedChanges(true);
    setShowUndoRedo(true);
    setChangeHistory(prev => [...prev, 'change']); // Placeholder for actual change
    setRedoHistory([]);
    setTileSelected(false); // Reset tileSelected after confirmation
    showToast('Changes Applied!', '1 tile(s) have been applied to your design.');
  };

  // Centralized function to reset to Home Screen state
  const resetToHomeScreen = () => {
    setShowTiles(false);
    setShowUndoRedo(false);
    setTileSelected(false);
    setAutoFocusOn(false);
    setUnsavedChanges(false);
  };

  const handleHomeClose = () => {
    if (unsavedChanges) {
      setShowUnsavedModal(true);
    } else {
      resetToHomeScreen();
    }
  };

  const handleSaveAndClose = () => {
    setShowUnsavedModal(false);
    resetToHomeScreen();
    showToast('Saved', 'Your changes have been saved.');
  };

  const handleDiscard = () => {
    setShowUnsavedModal(false);
    resetToHomeScreen();
    showToast('Layers are not applied to the design.', '', 'error');
  };

  const handleSaveBathroom = () => {
    resetToHomeScreen();
    setChangeHistory([]);
    setRedoHistory([]);
    setShowDownload(true);
    showToast('Layers are updated to your SOHO Kitchen.');
  };
  const handleUndo = () => {
    if (changeHistory.length > 0) {
      setRedoHistory(prev => [changeHistory[changeHistory.length - 1], ...prev]);
      setChangeHistory(prev => prev.slice(0, -1));
      showToast('Undo', 'Last change reverted.', 'info');
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      setChangeHistory(prev => [...prev, redoHistory[0]]);
      setRedoHistory(prev => prev.slice(1));
      showToast('Redo', 'Last change reapplied.', 'info');
    }
  };

  // const toggleFullPreview = () => {
  //   setFullPreview(!fullPreview);
  // };
const toggleFullPreview = () => {
  if (!fullPreview) {
    // Enter fullscreen
    document.documentElement.requestFullscreen?.().catch(e => {
      console.error("Fullscreen error:", e);
    });
  } else {
    // Exit fullscreen
    document.exitFullscreen?.();
  }
  setFullPreview(!fullPreview);
};
  return (
    <div className={`relative w-full h-screen bg-white ${fullPreview ? 'overflow-hidden' : ''}`}>
      {/* Full Preview Mode */}
     {fullPreview && (
  <div className="fixed inset-0 z-50 bg-black flex flex-col">
    {/* Remove the header div completely to eliminate black border */}
    <div className="flex-1 flex items-center justify-center p-0"> {/* Changed p-4 to p-0 */}
      <img
        src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg"
        alt="Kitchen preview"
        className="w-full h-full object-contain"
      />
    </div>
    {/* Floating close button */}
    <button
      onClick={toggleFullPreview}
      className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition z-10"
      title="Exit Full Preview"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
)}

      {/* Normal View */}
      {!fullPreview && (
        <>
          <img
            src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg"
            alt="Kitchen preview"
            className="w-full h-full object-cover"
          />

          {/* Edit Kitchen button (normal mode) */}
          {!showTiles && (
            <button
              onClick={() => setShowTiles(true)}
              className="absolute bottom-6 left-8 flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
              title="Edit Kitchen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fillRule="evenodd"
                  d="M4 16a1 1 0 011-1h11a1 1 0 110 2H5a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Edit
            </button>
          )}

          {/* Back button (edit mode) */}
          

          {/* Show cross and Save Kitchen buttons only in edit mode */}
          {showTiles && (
            <>
              {/* Cross (close) button */}
              <button
                onClick={() => {
                  setAutoFocusOn(false);
                  handleHomeClose();
                }}
                className="absolute top-6 right-6 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow"
                title="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
          {/* Back and Save Kitchen buttons side by side */}
          <div className="absolute bottom-6 left-8 flex items-center gap-4 z-40">
            {/* Back button */}
            <button
              onClick={() => {
                resetToHomeScreen();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
              title="Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            {/* Save Kitchen button: only show if unsavedChanges is true */}
            {unsavedChanges && (
              <button
                onClick={handleSaveBathroom}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                title="Save Kitchen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Save Kitchen
              </button>
            )}
          </div>
            </>
          )}

          {/* Bottom center: All other action buttons */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-40">
            {/* Home screen: all buttons visible */}
            {(!showTiles && !showUndoRedo && !tileSelected) && (
              <>
                <button
                  onClick={toggleFullPreview}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Full Preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Preview
                </button>
                <button
                  onClick={() => setShowInquiry(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Send Inquiry"
                >
                  <svg width="20px" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#ffffff"></path>
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#ffffff" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M12 14C12 13.8333 12 13.6667 12 13.5C12 13.5 12 12 14 11C16 10 15.5 7 12.5 7C9.5 7 9.5 9.5 9.5 9.5V10" stroke="#ffffff" strokeWidth="2"></path>
                  </svg> Inquiry
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Share"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4" />
                  </svg>
                  Share
                </button>
      {/* Share Popup Modal */}
      <SharePopup
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        url={window.location.href}
      />
                {showDownload && (
                  <button
                    onClick={handleDownloadImage}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                    title="Download Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                    </svg>
                    Image
                  </button>
                )}
              </>
            )}
            {/* Edit mode: only Preview, FAQ, Inquiry visible */}
            {(showTiles && !showUndoRedo && !tileSelected) && (
              <>
                <button
                  onClick={toggleFullPreview}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Full Preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Preview
                </button>
                <button
                  onClick={() => setShowFAQ(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="FAQ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a3 3 0 00-2.83 4h1.58a1.5 1.5 0 113 0c0 1.5-2.25 1.5-2.25 3v.5M12 17h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
                  </svg>
                  FAQ
                </button>
                <button
                  onClick={() => setShowInquiry(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Send Inquiry"
                >
                  <svg width="20px" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#ffffff"></path>
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#ffffff" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M12 14C12 13.8333 12 13.6667 12 13.5C12 13.5 12 12 14 11C16 10 15.5 7 12.5 7C9.5 7 9.5 9.5 9.5 9.5V10" stroke="#ffffff" strokeWidth="2"></path>
                  </svg> Inquiry
                </button>
              </>
            )}
            {/* After tile selection: Preview, FAQ, Inquiry, Auto Focus visible */}
            {(showTiles && tileSelected && !showUndoRedo) && (
              <>
                <button
                  onClick={toggleFullPreview}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Full Preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Preview
                </button>
                {/* Auto Focus Toggle Button - moved to top right and higher z-index */}
                <div className="fixed  right-[-9.2rem] z-[100] flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200">
                  <span className="text-white font-semibold text-base">Focus:</span>
                  <button
                    onClick={() => setAutoFocusOn(prev => !prev)}
                    className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${autoFocusOn ? 'bg-green-500' : 'bg-gray-400'}`}
                    title={`Toggle Auto Focus`}
                  >
                    <span
                      className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform duration-300 ${autoFocusOn ? 'translate-x-5' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
                <button
                  onClick={() => setShowFAQ(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="FAQ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a3 3 0 00-2.83 4h1.58a1.5 1.5 0 113 0c0 1.5-2.25 1.5-2.25 3v.5M12 17h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
                  </svg>
                  FAQ
                </button>
                <button
                  onClick={() => setShowInquiry(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Send Inquiry"
                >
                  <svg width="20px" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#ffffff"></path>
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#ffffff" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M12 14C12 13.8333 12 13.6667 12 13.5C12 13.5 12 12 14 11C16 10 15.5 7 12.5 7C9.5 7 9.5 9.5 9.5 9.5V10" stroke="#ffffff" strokeWidth="2"></path>
                  </svg> Inquiry
                </button>
              </>
            )}
            
            {/* After confirming selection: Undo/Redo visible, also show Preview and Inquiry, and Focus if a tile is selected */}
            {showUndoRedo && (
              <>
                <button
                  onClick={toggleFullPreview}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Full Preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Preview
                </button>
                <button
                  onClick={() => setShowInquiry(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Send Inquiry"
                >
                  <svg width="20px" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#ffffff"></path>
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#ffffff" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M12 14C12 13.8333 12 13.6667 12 13.5C12 13.5 12 12 14 11C16 10 15.5 7 12.5 7C9.5 7 9.5 9.5 9.5 9.5V10" stroke="#ffffff" strokeWidth="2"></path>
                  </svg> Inquiry
                </button>
                {showTiles && tileSelected && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200">
                    <span className="text-white font-semibold text-base">Focus:</span>
                    <button
                      onClick={() => setAutoFocusOn(prev => !prev)}
                      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${autoFocusOn ? 'bg-green-500' : 'bg-gray-400'}`}
                      title={`Toggle Auto Focus`}
                    >
                      <span
                        className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform duration-300 ${autoFocusOn ? 'translate-x-5' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                )}
                <button
                  onClick={handleUndo}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Undo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l-4-4 4-4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-7a4 4 0 00-4-4H5" />
                  </svg>
                  Undo
                </button>
                <button
                  onClick={handleRedo}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-base border border-white bg-[#00000047] backdrop-blur-md shadow-lg hover:backdrop-blur-xl hover:bg-white/20 transition-all duration-200"
                  title="Redo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4 4-4 4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v7a4 4 0 004 4h11" />
                  </svg>
                  Redo
                </button>
              </>
            )}
          </div>

          {/* Branding */}
          <div className="absolute top-0 left-0 bg-[#00000047] px-4 py-2 rounded-lg shadow border border-white/20 backdrop-blur-sm flex items-center gap-2 text-white text-xs">
 <img src={timber}
   alt="Powered by Biorev Studio"
   className="w-32 opacity-90 rounded" /></div>
 <div className="absolute bottom-0 right-0 bg-[#00000047] px-4 py-2 rounded-lg shadow border border-white/20 backdrop-blur-sm flex items-center gap-2 text-white text-xs">
 {/* <img src={timber}
   alt="Powered by Biorev Studio"
   className="w-28 opacity-90 rounded" /> */}
 <span className="font-medium whitespace-nowrap">Designed by</span>

 <img
   src={removed}
   alt="Powered by Biorev Studio"
   className="w-24 opacity-90 rounded"
 />
</div>

          {/* Conditional tile panel */}
          {showTiles && <TilePanel onClose={() => setShowTiles(false)} showToast={showToast} onLayerConfirmed={handleLayerConfirmed} onTileSelected={handleTileSelected} onTileCancel={() => setTileSelected(false)} />}
        </>
      )}

      {/* Toast notification */}
      <Toast title={toast.title} description={toast.description} type={toast.type} onClose={() => setToast({ title: '', description: '', type: 'success' })} />

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#00000047] backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl w-[90%] max-w-md text-white relative">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01M12 3a9 9 0 100 18 9 9 0 000-18zM12 13v-2a2 2 0 10-2-2" />
                </svg> How do I edit the Kitchen?</p>
                <p className="text-white/80 ml-6">Click the blue pencil icon next to the kitchen section to open the editor panel.</p>
              </div>
              <hr />
              <div>
                <p className="font-semibold"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01M12 3a9 9 0 100 18 9 9 0 000-18zM12 13v-2a2 2 0 10-2-2" />
                </svg> How do I save my design?</p>
                <p className="text-white/80 ml-6">Click the blue "Save" button on the top-right to store your current layout and changes.</p>
              </div><hr />
              <div>
                <p className="font-semibold"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01M12 3a9 9 0 100 18 9 9 0 000-18zM12 13v-2a2 2 0 10-2-2" />
                </svg> How do I download my design?</p>
                <p className="text-white/80 ml-6">Use the "Download Image" or "Download PDF" buttons from the floating right-side toolbar.</p>
              </div><hr />
              <div>
                <p className="font-semibold"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01M12 3a9 9 0 100 18 9 9 0 000-18zM12 13v-2a2 2 0 10-2-2" />
                </svg> Can I reset the design?</p>
                <p className="text-white/80 ml-6">Yes, use the reset icon to revert everything back to the original layout.</p>
              </div>
            </div>
            <button
              onClick={() => setShowFAQ(false)}
              className="mt-6 w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 text-white font-semibold border border-white/30"
            >
              Close
            </button>
            <button
              onClick={() => setShowFAQ(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-xl"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-[#00000047] backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/30 p-6 w-[22rem]">
            <button 
              onClick={() => setShowHelp(false)} 
              className="absolute top-3 right-3 text-white hover:text-red-300 transition"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-bold mb-3">Help</h2>
            <p className="text-sm text-white/90">
              For assistance, contact us at <a href="mailto:support@example.com" className="underline text-blue-200 hover:text-blue-300 font-semibold">biorev@studio.com</a> or use the inquiry form.
            </p>
            <button 
              onClick={() => setShowHelp(false)} 
              className="mt-6 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-[#00000047] backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl px-8 py-6 w-[90%] max-w-xl">
            <button
              onClick={() => setShowInquiry(false)}
              className="absolute top-4 right-4 text-white hover:text-red-300 transition"
              title="Close"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-6">Inquiry Details</h2>
            <form onSubmit={e => { e.preventDefault(); setShowInquiry(false); showToast('Inquiry sent!', 'Thank you for reaching out. We will contact you soon.', 'success'); }}>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Name*"
                  required
                  className="flex-1 bg-white/20 placeholder-white/80 text-white border border-white/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="tel"
                  placeholder="Phone*"
                  required
                  className="flex-1 bg-white/20 placeholder-white/80 text-white border border-white/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <input
                type="email"
                placeholder="Email*"
                required
                className="w-full bg-white/20 placeholder-white/80 text-white border border-white/30 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <textarea
                placeholder="Message*"
                required
                rows="4"
                className="w-full bg-white/20 placeholder-white/80 text-white border border-white/30 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-black text-white border border-white/40 shadow-md hover:bg-white hover:text-black transition font-semibold"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unsaved changes modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-[#00000047] backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl w-80 text-white">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-white hover:text-red-300 transition duration-200"
              title="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-bold mb-4">Do you want to save your changes?</h2>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleDiscard}
                className="flex-1 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 text-white font-semibold border border-white/30"
              >
                Discard
              </button>
              <button
                onClick={handleSaveAndClose}
                className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-all duration-200 text-white font-semibold shadow-md"
              >
                Save and Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
