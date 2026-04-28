"use client";
import React, { useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { ToastType } from "./toast-context";

const typeStyles: Record<ToastType, { icon: React.ReactNode; accent: string }> = {
  success: {
    icon: <CheckCircle className="text-green-500" size={24} />, accent: "bg-green-500",
  },
  error: {
    icon: <XCircle className="text-red-500" size={24} />, accent: "bg-red-500",
  },
  info: {
    icon: <Info className="text-blue-500" size={24} />, accent: "bg-blue-500",
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-500" size={24} />, accent: "bg-yellow-500",
  },
};

interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 2500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const { icon, accent } = typeStyles[type];

  return (
    <div className={`relative flex items-center min-w-[220px] max-w-xs px-4 py-3 rounded-xl shadow-lg bg-white/90 border border-zinc-200 backdrop-blur-md animate-fade-in-up`}>
      <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-xl ${accent}`} />
      <span className="mr-3 z-10">{icon}</span>
      <span className="flex-1 text-zinc-800 text-sm font-medium pr-6">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded hover:bg-zinc-100 transition"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-zinc-400" />
      </button>
    </div>
  );
};

export default Toast;
