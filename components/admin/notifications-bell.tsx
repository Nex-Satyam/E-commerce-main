"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsDropdown } from "./notifications-dropdown";
import { queryKeys } from "@/lib/query-keys";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function NotificationsBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const countQuery = useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: () => fetcher("/api/notifications/unread-count"),
    refetchInterval: 30000,
  });

  const listQuery = useQuery({
    queryKey: queryKeys.notifications.list(10),
    queryFn: () => fetcher("/api/notifications?limit=10"),
  });

  const unreadCount = countQuery.data?.count ?? 0;
  const notifications = listQuery.data?.notifications ?? [];

  const invalidateNotifications = () => {
    void queryClient.invalidateQueries({
      queryKey: ["notifications"],
    });
  };

  const markReadMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/notifications/${id}/read`, { method: "PATCH" }),
    onSuccess: invalidateNotifications,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => fetch("/api/notifications/read-all", { method: "PATCH" }),
    onSuccess: invalidateNotifications,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleMarkRead(id: string) {
    markReadMutation.mutate(id);
  }

  async function handleMarkAllRead() {
    markAllReadMutation.mutate();
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "relative inline-flex size-9 items-center justify-center rounded-lg border transition",
          isOpen ? "border-blue-200 bg-blue-50 text-blue-600" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        ].join(" ")}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationsDropdown
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />
      )}
    </div>
  );
}
