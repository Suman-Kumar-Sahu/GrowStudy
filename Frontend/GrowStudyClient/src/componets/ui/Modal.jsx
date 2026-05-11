import React, { useEffect } from "react";

/**
 * Reusable Modal component
 * Props: isOpen, onClose, title, children, footer, maxWidth (default 560)
 */
export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = 560 }) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="cn-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className="cn-modal" style={{ maxWidth }}>
        <div className="cn-modal-header">
          {title && <h2 className="cn-modal-title" id="modal-title">{title}</h2>}
          <button className="cn-modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <div className="cn-modal-body">{children}</div>
        {footer && <div className="cn-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
