import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

let toastId = 0;
const DURATION = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => t.id === id ? { ...t, removing: true } : t)
    );
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 320);
  }, []);

  const add = useCallback((type, title, message) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, title, message, removing: false }]);
    setTimeout(() => remove(id), DURATION);
    return id;
  }, [remove]);

  const toast = {
    success: (title, message) => add("success", title, message),
    error:   (title, message) => add("error",   title, message),
    info:    (title, message) => add("info",     title, message),
    warn:    (title, message) => add("warn",     title, message),
  };

  const ICONS = { success: "✅", error: "❌", info: "ℹ️", warn: "⚠️" };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="cn-toast-container" aria-live="polite">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`cn-toast cn-toast-${t.type}${t.removing ? " removing" : ""}`}
            onClick={() => remove(t.id)}
            role="alert"
          >
            <span className="cn-toast-icon">{ICONS[t.type]}</span>
            <div className="cn-toast-content">
              <div className="cn-toast-title">{t.title}</div>
              {t.message && <div className="cn-toast-msg">{t.message}</div>}
            </div>
            <button
              className="cn-toast-close"
              onClick={(e) => { e.stopPropagation(); remove(t.id); }}
              aria-label="Close"
            >×</button>
            <div
              className="cn-toast-bar"
              style={{ animationDuration: `${DURATION}ms` }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
