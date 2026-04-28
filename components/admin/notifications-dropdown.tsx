"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const iconMap: Record<string, any> = {
  ORDER_PLACED: ShoppingBag,
  ORDER_CONFIRMED: CheckCircle2,
  ORDER_SHIPPED: Package,
  ORDER_DELIVERED: CheckCircle2,
  ORDER_CANCELLED: XCircle,
  NEW_ORDER: ShoppingBag,
  LOW_STOCK: AlertTriangle,
};

export function NotificationsDropdown({ 
  notifications, 
  onMarkRead, 
  onMarkAllRead 
}: NotificationsDropdownProps) {
  return (
    <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
        <button 
          onClick={onMarkAllRead}
          className="text-[11px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-200">
              <Bell className="size-6" />
            </div>
            <p className="mt-2 text-sm text-slate-500">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((notif) => {
              const Icon = iconMap[notif.type] || Bell;
              return (
                <Link
                  key={notif.id}
                  href={notif.link || "#"}
                  onClick={() => onMarkRead(notif.id)}
                  className={[
                    "flex gap-3 px-4 py-3 hover:bg-slate-50 transition relative",
                    !notif.isRead && "bg-blue-50/30"
                  ].join(" ")}
                >
                  <div className={[
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    notif.type === "LOW_STOCK" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                  ].join(" ")}>
                    <Icon className="size-4" />
                  </div>
                  <div className="grid gap-0.5 overflow-hidden">
                    <p className="text-[13px] font-bold text-slate-900 truncate">{notif.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                      <Clock className="size-3" />
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  {!notif.isRead && (
                    <div className="absolute top-4 right-4 size-2 rounded-full bg-blue-600" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 p-2">
        <Link 
          href="/admin/notifications"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
        >
          View all notifications
          <ExternalLink className="size-3" />
        </Link>
      </div>
    </div>
  );
}
