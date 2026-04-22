"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, BadgeCheck, MapPin, PencilLine, Save, ShieldCheck, Sparkles } from "lucide-react";

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
  const { isLoggedIn, role, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<UserProfile | null>(profile);

  const initials = useMemo(() => getInitials(profile?.fullName ?? "ASR"), [profile?.fullName]);

  if (!isLoggedIn || !profile || !formState) {
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

  return (
    <section className="profile-page">
      <div className="profile-breadcrumb">
        <Link href="/" className="wishlist-back-link">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        <span>/</span>
        <span>My profile</span>
      </div>

      <div className="profile-layout">
        <Card className="profile-hero-card py-0 shadow-none">
          <CardContent className="profile-hero-content">
            <div className="profile-avatar">{initials || "AS"}</div>
            <div className="profile-hero-copy">
              <p className="eyebrow">Account Details</p>
              <h1>{profile.fullName}</h1>
              <p>
                Review your saved contact details, delivery information, and account overview from one place.
              </p>
            </div>

            <div className="profile-chip-row">
              <span className="profile-chip">
                {role === "admin" ? <ShieldCheck className="size-4" /> : <BadgeCheck className="size-4" />}
                {role === "admin" ? "Admin account" : "Verified customer"}
              </span>
              <span className="profile-chip is-light">
                <Sparkles className="size-4" /> Member since {profile.memberSince}
              </span>
            </div>

            <div className="profile-stat-grid">
              <div className="profile-stat-card">
                <span>Email</span>
                <strong>{profile.email}</strong>
              </div>
              <div className="profile-stat-card">
                <span>Phone</span>
                <strong>{profile.phone}</strong>
              </div>
              <div className="profile-stat-card">
                <span>Location</span>
                <strong>{profile.city}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="profile-details-card py-0 shadow-none">
          <CardContent className="profile-details-content">
            <div className="profile-section-head">
              <div>
                <p className="eyebrow">Personal Information</p>
                <h2>Your saved details</h2>
                <p>Edit your customer information and keep checkout details up to date.</p>
              </div>

              {isEditing ? (
                <div className="profile-head-actions">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setFormState(profile);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <CtaButton
                    type="button"
                    className="profile-save-button"
                    onClick={() => {
                      updateProfile(formState);
                      setIsEditing(false);
                    }}
                  >
                    <Save className="size-4" /> Save changes
                  </CtaButton>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilLine className="size-4" /> Edit profile
                </Button>
              )}
            </div>

            <form className="profile-form" onSubmit={(event) => event.preventDefault()}>
              <div className="profile-two-col-grid">
                <label className="profile-field">
                  <span>Full Name</span>
                  <Input
                    value={formState.fullName}
                    onChange={(event) =>
                      setFormState((currentState) =>
                        currentState
                          ? { ...currentState, fullName: event.target.value }
                          : currentState,
                      )
                    }
                    disabled={!isEditing}
                  />
                </label>

                <label className="profile-field">
                  <span>Email Address</span>
                  <Input value={formState.email} disabled />
                </label>
              </div>

              <div className="profile-two-col-grid">
                <label className="profile-field">
                  <span>Phone Number</span>
                  <Input
                    value={formState.phone}
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

                <label className="profile-field">
                  <span>City</span>
                  <Input
                    value={formState.city}
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

              <label className="profile-field">
                <span>Address</span>
                <Input
                  value={formState.address}
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

            <div className="profile-support-row">
              <div className="profile-support-card">
                <MapPin className="size-4" />
                <div>
                  <strong>Primary delivery location</strong>
                  <span>{profile.address}</span>
                </div>
              </div>
              <div className="profile-support-card">
                <BadgeCheck className="size-4" />
                <div>
                  <strong>Profile ready for checkout</strong>
                  <span>Saved details will help you complete orders faster.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}