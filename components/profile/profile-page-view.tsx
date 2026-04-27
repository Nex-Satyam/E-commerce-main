"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { ArrowLeft, BadgeCheck, MapPin, PencilLine, Save, ShieldCheck, Sparkles } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useAuth, type UserProfile } from "@/components/auth/auth-provider";
import { CtaButton } from "@/components/home/cta-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");
}

export function ProfilePageView() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<UserProfile | null>(null);
  const initials = useMemo(() => getInitials(user?.name ?? profileData?.name ?? "ASR"), [user?.name, profileData?.name]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/api/user/profile");
        setProfileData(res.data);
        setFormState(res.data);
      } catch {
        setProfileData(null);
        setFormState(null);
      }
    }
    if (user) fetchProfile();
  }, [user]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (!user) {
    return (
      <section className="profile-page">
        <div className="profile-breadcrumb">
          <Link href="/" className="wishlist-back-link">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>
        <Card className="profile-empty-card py-0 shadow-none">
          <CardContent className="profile-empty-content">
            <div className="profile-empty-copy">
              <p className="eyebrow">Profile Access</p>
              <h1>Login to see your profile details.</h1>
              <p>
                Your profile page shows saved account information, contact details, and editable user preferences once you are signed in.
              </p>
            </div>
            <div className="profile-empty-actions">
              <CtaButton asChild>
                <Link href="/login">Login</Link>
              </CtaButton>
              <CtaButton asChild tone="light">
                <Link href="/signup">Create account</Link>
              </CtaButton>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!profileData || !formState) {
    return <div>Loading profile...</div>;
  }

  return (
    <section className="profile-page bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-[90vh] py-8">
      <div className="profile-breadcrumb flex items-center gap-2 mb-6">
        <Link href="/" className="wishlist-back-link text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        <span className="text-xl font-light text-gray-400">/</span>
        <span className="font-semibold text-gray-700">My profile</span>
      </div>

      <div className="profile-layout grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="profile-hero-card shadow-lg rounded-2xl border-0 bg-white/90 flex flex-col items-center py-10 px-8">
          <div className="relative mb-4">
            <div className="profile-avatar w-24 h-24 rounded-full bg-gradient-to-br from-[#e0e7ff] to-[#f1f5f9] flex items-center justify-center text-4xl font-bold text-gray-700 border-4 border-white shadow-lg ring-4 ring-indigo-200">
              {initials || "AS"}
            </div>
            <span className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full px-2 py-1 text-xs font-semibold shadow">User</span>
          </div>
          <div className="profile-hero-copy text-center">
            <p className="eyebrow uppercase tracking-widest text-xs text-indigo-400 font-semibold mb-1">Account Details</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">{profileData.name}</h1>
            <p className="text-gray-500 mb-4">Review your saved contact details, delivery information, and account overview from one place.</p>
          </div>
          <div className="profile-chip-row flex gap-2 justify-center mb-4">
            <span className="profile-chip flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium shadow">
              <BadgeCheck className="size-4" /> Verified customer
            </span>
            <span className="profile-chip is-light flex items-center gap-1 bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
              <Sparkles className="size-4" /> Member since {profileData.memberSince}
            </span>
          </div>
          <div className="profile-stat-grid grid grid-cols-1 gap-2 w-full mt-2">
            <div className="profile-stat-card bg-indigo-50 rounded-lg px-4 py-3 flex flex-col items-start">
              <span className="text-xs text-gray-400">Email</span>
              <strong className="text-base text-gray-700 break-all">{profileData.email}</strong>
            </div>
            <div className="profile-stat-card bg-indigo-50 rounded-lg px-4 py-3 flex flex-col items-start">
              <span className="text-xs text-gray-400">Phone</span>
              <strong className="text-base text-gray-700">{profileData.phone}</strong>
            </div>
            <div className="profile-stat-card bg-indigo-50 rounded-lg px-4 py-3 flex flex-col items-start">
              <span className="text-xs text-gray-400">Location</span>
              <strong className="text-base text-gray-700">{profileData.city}</strong>
            </div>
          </div>
        </Card>

        <Card className="profile-details-card shadow-lg rounded-2xl border-0 bg-white/90">
          <CardContent className="profile-details-content p-8">
            <div className="profile-section-head flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
              <div>
                <p className="eyebrow uppercase tracking-widest text-xs text-indigo-400 font-semibold mb-1">Personal Information</p>
                <h2 className="text-xl font-bold text-gray-800">Your saved details</h2>
                <p className="text-gray-500">Edit your customer information and keep checkout details up to date.</p>
              </div>
              {isEditing ? (
                <div className="profile-head-actions flex gap-2 mt-4 md:mt-0">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-gray-300 hover:bg-gray-100"
                    onClick={() => {
                      setFormState(profileData);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <CtaButton
                    type="button"
                    className="profile-save-button rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 font-semibold shadow"
                    onClick={async () => {
                      try {
                        await axios.patch("/api/user/profile", formState);
                        const res = await axios.get("/api/user/profile");
                        setProfileData(res.data);
                        setFormState(res.data);
                        setIsEditing(false);
                      } catch (err) {
                        alert("Failed to update profile. Please try again.");
                      }
                    }}
                  >
                    <Save className="size-4 mr-2" /> Save changes
                  </CtaButton>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-gray-300 hover:bg-gray-100"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilLine className="size-4 mr-2" /> Edit profile
                </Button>
              )}
            </div>
            <form className="profile-form grid gap-6" onSubmit={(event) => event.preventDefault()}>
              <div className="profile-two-col-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="profile-field flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-600">Full Name</span>
                  <Input
                    value={formState.name ?? ""}
                    onChange={(event) =>
                      setFormState((currentState) =>
                        currentState
                          ? { ...currentState, name: event.target.value }
                          : currentState,
                      )
                    }
                    disabled={!isEditing}
                  />
                </label>
                <label className="profile-field flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-600">Email Address</span>
                  <Input value={formState.email ?? ""} disabled />
                </label>
              </div>
              <div className="profile-two-col-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="profile-field flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-600">Phone Number</span>
                  <Input
                    value={formState.phone ?? ""}
                    onChange={(event) =>
                      setFormState((currentState) =>
                        currentState
                          ? { ...currentState, phone: event.target.value }
                          : currentState,
                      )
                    }
                    disabled={!isEditing}
                  />
                </label>
                <label className="profile-field flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-600">City</span>
                  <Input
                    value={formState.city ?? ""}
                    onChange={(event) =>
                      setFormState((currentState) =>
                        currentState
                          ? { ...currentState, city: event.target.value }
                          : currentState,
                      )
                    }
                    disabled={!isEditing}
                  />
                </label>
              </div>
              <label className="profile-field flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-600">Address</span>
                <Input
                  value={formState.address ?? ""}
                  onChange={(event) =>
                    setFormState((currentState) =>
                      currentState
                        ? { ...currentState, address: event.target.value }
                        : currentState,
                    )
                  }
                  disabled={!isEditing}
                />
              </label>
            </form>
            <div className="profile-support-row grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="profile-support-card flex items-center gap-3 bg-indigo-50 rounded-lg px-4 py-3">
                <MapPin className="size-5 text-indigo-400" />
                <div>
                  <strong className="block text-gray-700">Primary delivery location</strong>
                  <span className="text-gray-500">{profileData?.address}</span>
                </div>
              </div>
              <div className="profile-support-card flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3">
                <BadgeCheck className="size-5 text-green-500" />
                <div>
                  <strong className="block text-gray-700">Profile ready for checkout</strong>
                  <span className="text-gray-500">Saved details will help you complete orders faster.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}