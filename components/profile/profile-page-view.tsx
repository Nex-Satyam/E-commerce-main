"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  CalendarDays,
  CheckCircle2,
  Heart,
  Loader2,
  Mail,
  MapPin,
  PackageCheck,
  PencilLine,
  Phone,
  Save,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import { useSession } from "next-auth/react";
import { type UserProfile } from "@/components/auth/auth-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CtaButton } from "@/components/home/cta-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-context";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  phone: z
    .string()
    .trim()
    .refine(
      (value) =>
        !value ||
        /^[6-9]\d{9}$|^\+91[6-9]\d{9}$/.test(value.replace(/\s/g, "")),
      "Enter a valid Indian phone number.",
    ),
  address: z.string().trim().min(5, "Enter a complete address."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const user = session?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const resetProfileForm = useCallback((data: UserProfile) => {
    reset({
      name: data.name ?? "",
      phone: data.phone ?? "",
      address: data.address ?? "",
    });
  }, [reset]);

  const profileQuery = useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data as UserProfile;
    },
    enabled: Boolean(user),
  });

  const profileData = profileQuery.data || null;
  const initials = useMemo(() => getInitials(user?.name ?? profileData?.name ?? "ASR"), [user?.name, profileData?.name]);

  useEffect(() => {
    if (profileData) resetProfileForm(profileData);
  }, [profileData, resetProfileForm]);

  const saveProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      await api.patch("/user/profile", {
        ...values,
        phone: values.phone.replace(/\s/g, ""),
      });

      const res = await api.get("/user/profile");
      return res.data as UserProfile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile, data);
      resetProfileForm(data);
      setIsEditing(false);
      setLastSavedAt(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      );
      showToast("Profile changes saved successfully.", "success");
    },
    onError: (err: unknown) => {
      console.error(err);
      showToast("Unable to save profile changes.", "error");
      setError("root", {
        message: "Failed to update profile. Please try again.",
      });
    },
  });

  const handleProfileSave = async (values: ProfileFormValues) => {
    try {
      await saveProfileMutation.mutateAsync(values);
    } catch {}
  };

  const completedFields = profileData
    ? [profileData.name, profileData.email, profileData.phone, profileData.address].filter(Boolean).length
    : 0;
  const completion = Math.round((completedFields / 4) * 100);

  const profileHighlights = [
    {
      label: "Saved profile",
      value: `${completion}%`,
      copy: "Account completion",
      icon: BadgeCheck,
    },
    {
      label: "Member since",
      value: profileData?.memberSince || "-",
      copy: "Loyal customer",
      icon: CalendarDays,
    },
    {
      label: "Checkout ready",
      value: profileData?.address ? "Ready" : "Pending",
      copy: "Delivery details",
      icon: Truck,
    },
  ];

  const quickActions = [
    { label: "Orders", href: "/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Cart", href: "/cart", icon: PackageCheck },
  ];

  const activityItems = [
    "Profile checked for faster checkout",
    "Delivery details synced with your account",
    "Secure account session is active",
  ];

  if (status === "loading") {
    return (
      <section className="profile-page">
        <div className="profile-loading-state">
          <Loader2 className="size-5 animate-spin" />
          Loading account...
        </div>
      </section>
    );
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

  if (!profileData) {
    return (
      <section className="profile-page">
        <div className="profile-loading-state">
          <Loader2 className="size-5 animate-spin" />
          Loading profile...
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page profile-modern-page">
      <div className="profile-breadcrumb profile-animate-in">
        <Link href="/" className="wishlist-back-link">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        <span>/</span>
        <strong>My profile</strong>
      </div>

      <section className="profile-dashboard-hero profile-animate-in">
        <div className="profile-hero-identity">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {initials || "ASR"}
            </div>
            <span className="profile-avatar-status">
              <CheckCircle2 className="size-3" />
              Active
            </span>
          </div>

          <div className="profile-hero-copy">
            <p className="eyebrow">Account Details</p>
            <h1>{profileData.name}</h1>
            <p>
              Manage your contact details, delivery preferences, saved shopping
              shortcuts, and account readiness from one clean dashboard.
            </p>
          </div>

          <div className="profile-chip-row">
            <span className="profile-chip">
              <BadgeCheck className="size-4" />
              Verified customer
            </span>
            <span className="profile-chip is-light">
              <Sparkles className="size-4" />
              Member since {profileData.memberSince}
            </span>
          </div>
        </div>

        <div className="profile-completion-card">
          <div>
            <span>Profile strength</span>
            <strong>{completion}% complete</strong>
          </div>
          <div
            className="profile-progress-ring"
            style={{ "--profile-progress": `${completion}%` } as CSSProperties}
            aria-label={`Profile completion ${completion}%`}
          >
            <span>{completion}</span>
          </div>
        </div>
      </section>

      <div className="profile-stat-grid profile-animate-in">
        {profileHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="profile-stat-card">
              <span className="profile-stat-icon">
                <Icon className="size-4" />
              </span>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.copy}</small>
              </div>
            </div>
          );
        })}
      </div>

      <div className="profile-layout profile-animate-in">
        <Card className="profile-details-card py-0 shadow-none">
          <CardContent className="profile-details-content">
            <div className="profile-section-head">
              <div>
                <p className="eyebrow">Personal Information</p>
                <h2>Your saved details</h2>
                <p>
                  Edit customer details used for checkout, delivery updates,
                  and support verification.
                </p>
              </div>

              {isEditing ? (
                <div className="profile-head-actions">
                  <Button
                    type="button"
                    variant="outline"
                    className="profile-secondary-action"
                    onClick={() => {
                      resetProfileForm(profileData);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <CtaButton
                    type="button"
                    className="profile-save-button"
                    onClick={handleSubmit(handleProfileSave)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </CtaButton>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="profile-secondary-action"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilLine className="size-4" /> Edit profile
                </Button>
              )}
            </div>

            {lastSavedAt && (
              <div className="profile-saved-banner">
                <CheckCircle2 className="size-4" />
                Saved at {lastSavedAt}. Your checkout details are up to date.
              </div>
            )}

            <form className="profile-form" onSubmit={handleSubmit(handleProfileSave)} noValidate>
              <div className="profile-two-col-grid">
                <label className="profile-field">
                  <span>
                    <UserRound className="size-4" />
                    Full Name
                  </span>
                  <Input
                    {...register("name")}
                    disabled={!isEditing}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && (
                    <small className="form-error">{errors.name.message}</small>
                  )}
                </label>
                <label className="profile-field">
                  <span>
                    <Mail className="size-4" />
                    Email Address
                  </span>
                  <Input value={profileData.email ?? ""} disabled />
                </label>
              </div>
              <div className="profile-two-col-grid">
                <label className="profile-field">
                  <span>
                    <Phone className="size-4" />
                    Phone Number
                  </span>
                  <Input
                    {...register("phone")}
                    disabled={!isEditing}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && (
                    <small className="form-error">{errors.phone.message}</small>
                  )}
                </label>
                <label className="profile-field">
                  <span>
                    <Truck className="size-4" />
                    Address
                  </span>
                  <Input
                    {...register("address")}
                    disabled={!isEditing}
                    aria-invalid={Boolean(errors.address)}
                  />
                  {errors.address && (
                    <small className="form-error">{errors.address.message}</small>
                  )}
                </label>
              </div>
              {errors.root?.message && (
                <div className="checkout-error-box">{errors.root.message}</div>
              )}
            </form>
          </CardContent>
        </Card>

        <aside className="profile-side-stack">
          <Card className="profile-side-card py-0 shadow-none">
            <CardContent className="profile-side-content">
              <div className="profile-mini-head">
                <ShieldCheck className="size-5" />
                <div>
                  <strong>Account protection</strong>
                  <span>Secure session and verified contact details.</span>
                </div>
              </div>
              <div className="profile-security-list">
                <span>
                  <CheckCircle2 className="size-4" />
                  Email linked to account
                </span>
                <span>
                  <CheckCircle2 className="size-4" />
                  Checkout profile validated
                </span>
                <span>
                  <CheckCircle2 className="size-4" />
                  Saved delivery preferences
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="profile-side-card py-0 shadow-none">
            <CardContent className="profile-side-content">
              <div className="profile-mini-head">
                <Bell className="size-5" />
                <div>
                  <strong>Quick actions</strong>
                  <span>Jump back into your shopping flow.</span>
                </div>
              </div>
              <div className="profile-action-grid">
                {quickActions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link key={item.label} href={item.href} className="profile-action-tile">
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="profile-side-card py-0 shadow-none">
            <CardContent className="profile-side-content">
              <div className="profile-mini-head">
                <Sparkles className="size-5" />
                <div>
                  <strong>Recent activity</strong>
                  <span>Small account updates that keep checkout smooth.</span>
                </div>
              </div>
              <div className="profile-activity-list">
                {activityItems.map((item, index) => (
                  <span key={item}>
                    <b>{index + 1}</b>
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="profile-support-card">
            <MapPin className="size-5" />
            <div>
              <strong>Primary delivery location</strong>
              <span>{profileData.address}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
