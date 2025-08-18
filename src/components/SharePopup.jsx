import React from "react";
import { EmailIcon, EmailShareButton, WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, TelegramShareButton, TelegramIcon } from "react-share";

export default function SharePopup({ isOpen, onClose, url }) {
  const [copied, setCopied] = React.useState(false);
  if (!isOpen) return null;
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center  ">
      <div className="bg-[#000000e0] top-[-22rem] border border-white/20 rounded-2xl shadow-2xl p-8  max-w-md text-white relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white hover:text-red-300 transition text-xl"
          title="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Share Your Kitchen Design</h2>
        <p className="mb-6 text-white/80 text-center">Share your kitchen design with friends and family or copy the direct link.</p>
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex gap-3 mt-2">
            <EmailShareButton url={url} subject="Check out my kitchen design!" body="Here's my kitchen design. Let me know what you think!">
              <EmailIcon size={32} round />
            </EmailShareButton>
            <WhatsappShareButton url={url}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <FacebookShareButton url={url}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={url}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <TelegramShareButton url={url}>
              <TelegramIcon size={32} round />
            </TelegramShareButton>
          </div>
        </div>
        <div className="mt-6 w-full flex flex-col items-center">
          <input
            type="text"
            value={url}
            readOnly
            className="w-full bg-white/10 text-white border border-white/30 rounded-md px-4 py-2 mb-2 text-center select-all"
            onFocus={e => e.target.select()}
          />
          <button
            onClick={handleCopy}
            className={"px-4 py-2 bg-white/10 text-white border border-white/30 rounded-md  mb-2 text-center mt-1 transition"}
            disabled={copied}
          >
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
