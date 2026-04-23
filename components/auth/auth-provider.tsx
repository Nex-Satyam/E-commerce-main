"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { NotificationModal } from "@/components/ui/notification-modal";
import { toast } from "sonner";

type AuthRole = "user" | "admin";

export type UserProfile = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  memberSince: string;
};

type AuthState = {
  isLoggedIn: boolean;
  role: AuthRole | null;
  email: string | null;
  profile: UserProfile | null;
};

type AuthContextValue = AuthState & {
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
};

const AUTH_STORAGE_KEY = "asr-auth-state";

const defaultAuthState: AuthState = {
  isLoggedIn: false,
  role: null,
  email: null,
  profile: null,
};

function formatMemberSince(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatNameSegment(segment: string) {
  if (!segment) {
    return "";
  }
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

function buildDefaultProfile(email: string): UserProfile {
  const normalizedEmail = email.trim().toLowerCase();
  const localPart = normalizedEmail.split("@")[0] ?? "client";
  const nameSegments = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(formatNameSegment);

  return {
    fullName: nameSegments.length > 0 ? nameSegments.join(" ") : "Atelier Client",
    email,
    phone: "+91 98765 43210",
    city: "New Delhi",
    address: "Studio 14, Khan Market, New Delhi",
    memberSince: formatMemberSince(new Date()),
  };
}

function detectRoleFromEmail(email: string): AuthRole {
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail.startsWith("admin") ||
    normalizedEmail.includes("admin@") ||
    normalizedEmail.endsWith("@atelier.com")
  ) {
    return "admin";
  }

  return "user";
}

function getInitialAuthState(): AuthState {
  if (typeof window === "undefined") {
    return defaultAuthState;
  }

  const storedAuthState = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuthState) {
    return defaultAuthState;
  }

  try {
    const parsedAuthState = JSON.parse(storedAuthState) as Partial<AuthState>;

    if (typeof parsedAuthState.isLoggedIn === "boolean") {
      return {
        isLoggedIn: parsedAuthState.isLoggedIn,
        role:
          parsedAuthState.role === "user" || parsedAuthState.role === "admin"
            ? parsedAuthState.role
            : null,
        email: typeof parsedAuthState.email === "string" ? parsedAuthState.email : null,
        profile:
          parsedAuthState.profile &&
          typeof parsedAuthState.profile === "object" &&
          typeof parsedAuthState.profile.email === "string"
            ? {
                fullName:
                  typeof parsedAuthState.profile.fullName === "string"
                    ? parsedAuthState.profile.fullName
                    : "Atelier Client",
                email: parsedAuthState.profile.email,
                phone:
                  typeof parsedAuthState.profile.phone === "string"
                    ? parsedAuthState.profile.phone
                    : "+91 98765 43210",
                city:
                  typeof parsedAuthState.profile.city === "string"
                    ? parsedAuthState.profile.city
                    : "New Delhi",
                address:
                  typeof parsedAuthState.profile.address === "string"
                    ? parsedAuthState.profile.address
                    : "Studio 14, Khan Market, New Delhi",
                memberSince:
                  typeof parsedAuthState.profile.memberSince === "string"
                    ? parsedAuthState.profile.memberSince
                    : formatMemberSince(new Date()),
              }
            : typeof parsedAuthState.email === "string"
              ? buildDefaultProfile(parsedAuthState.email)
              : null,
      };
    }
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return defaultAuthState;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState);
  const [modal, setModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const showModal = useCallback((message: string) => {
    setModal({ open: true, message });
  }, []);
  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, open: false }));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  return (
    <>
      <NotificationModal open={modal.open} message={modal.message} onClose={closeModal} />
      <AuthContext.Provider
        value={{
          ...authState,
          login: (email) => {
            const role = detectRoleFromEmail(email);
            setAuthState({
              isLoggedIn: true,
              role,
              email,
              profile: buildDefaultProfile(email),
            });
            toast.success("Logged in successfully!");
            showModal("Logged in successfully!");
          },
          logout: () => {
            setAuthState(defaultAuthState);
            toast.success("Logged out successfully.");
            showModal("Logged out successfully.");
          },
          updateProfile: (profile) => {
            setAuthState((currentState) => {
              if (!currentState.profile) {
                return currentState;
              }

              return {
                ...currentState,
                profile: {
                  ...currentState.profile,
                  ...profile,
                  email: currentState.profile.email,
                  memberSince: currentState.profile.memberSince,
                },
              };
            });
          },
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}