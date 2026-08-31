import { useEffect, useRef } from "react";

export function Modal({ open, onClose, children, title }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
            <h2 className="text-lg font-semibold text-[#1f2937]">{title}</h2>
            <button
              onClick={onClose}
              className="size-7 flex items-center justify-center rounded-md text-[#9ca3af] hover:text-[#374151] hover:bg-[#f3f4f6] transition-colors"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}