"use client";
import { useEffect } from "react";

export function NotificationModal({ open, message, onClose }: { open: boolean; message: string; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: "2rem 3rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        fontSize: "1.2rem",
        fontWeight: 500,
        color: "#222"
      }}>
        {message}
      </div>
    </div>
  );
}
