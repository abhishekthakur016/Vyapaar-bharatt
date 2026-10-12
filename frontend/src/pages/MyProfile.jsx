import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Camera,
  Pencil,
  Check,
  X,
  Building2,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Settings,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "U";

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const getRoleName = (role) => {
  const roles = {
    buyer: "Buyer",
    supplier: "Supplier",
    admin: "Administrator",
    super_admin: "Super Administrator",
  };

  return roles[role] || "Member";
};

const getProfilePhoto = (user) =>
  user?.photoURL ||
  user?.photoUrl ||
  user?.picture ||
  user?.avatar ||
  user?.profilePhoto ||
  user?.profile_picture ||
  user?.photo ||
  "";

export default function MyProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem("vyapaar_user");

    if (!savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);
      setForm({
        name: parsedUser.name || "",
        phone: parsedUser.phone || "",
      });
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("vyapaar_user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const updateUser = (updatedUser) => {
    localStorage.setItem("vyapaar_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleSave = async () => {
    const name = form.name.trim();
    const phone = form.phone.trim();

    if (!name) {
      alert("Name is required");
      return;
    }

    const token = localStorage.getItem("vyapaar_token");

    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local profile using the database response
      const updatedUser = {
        ...user,
        ...data.user,
        name: data.user.name,
        phone: data.user.phone || "",
      };

      updateUser(updatedUser);
      setForm({
        name: updatedUser.name || "",
        phone: updatedUser.phone || "",
      });

      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      phone: user.phone || "",
    });
    setEditing(false);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      window.alert("Please choose an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      const updatedUser = {
        ...user,
        profilePhoto: reader.result,
      };

      try {
        updateUser(updatedUser);
        setPhotoError(false);
      } catch (error) {
        console.error("Unable to save profile photo:", error);
        window.alert(
          "Unable to save this photo in your browser storage. Please use a smaller image.",
        );
      }
    };

    reader.onerror = () => {
      window.alert("Could not read the selected image.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleLogout = () => {
    localStorage.removeItem("vyapaar_token");
    localStorage.removeItem("vyapaar_user");
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  const photo = getProfilePhoto(user);
  const showPhoto = Boolean(photo) && !photoError;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      {/* Top navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm shadow-blue-200">
              <Building2 size={19} />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight text-[#102448]">
                Vyapaar Bharat
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Your account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-700"
            aria-label="Go to home"
          >
            <Settings size={19} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            Account overview
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#102448] sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your personal information and keep your Vyapaar Bharat
            account up to date.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.55fr]">
          {/* Left profile card */}
          <aside className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_40px_rgba(15,35,75,0.04)]">
              {/* Decorative banner */}
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#102448] via-[#1647a2] to-[#4d8df5]">
                <div className="absolute -right-8 -top-16 h-48 w-48 rounded-full border-[28px] border-white/10" />
                <div className="absolute -bottom-20 left-12 h-40 w-40 rounded-full bg-blue-300/15 blur-2xl" />

                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                  Member profile
                </div>
              </div>

              <div className="px-5 pb-6 sm:px-6">
                {/* Profile picture */}
                <div className="-mt-14 flex items-end justify-between gap-3">
                  <div className="relative shrink-0">
                    {showPhoto ? (
                      <img
                        src={photo}
                        alt={`${user.name || "User"} profile`}
                        onError={() => setPhotoError(true)}
                        className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover shadow-lg"
                      />
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 text-3xl font-bold tracking-wide text-blue-800 shadow-lg">
                        {getInitials(user.name)}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Change profile picture"
                      title="Change profile picture"
                      className="absolute bottom-1 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-700 text-white shadow-md transition hover:scale-105 hover:bg-blue-800"
                    >
                      <Camera size={16} />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>

                  <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>

                <div className="mt-5">
                  <h2 className="break-words text-2xl font-bold tracking-tight text-[#102448]">
                    {user.name || "Welcome, Member"}
                  </h2>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {user.email || "No email address added"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">
                      <ShieldCheck size={15} />
                      {getRoleName(user.role)}
                    </span>

                    {user.is_verified && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                        <BadgeCheck size={15} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="my-6 border-t border-slate-100" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <Mail size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Email address
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                        {user.email || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <Phone size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Phone number
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <LockKeyhole size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Sign-in method
                      </p>
                      <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
                        {user.auth_provider || "Standard login"}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-6 rounded-xl bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-500">
                  <Camera size={14} className="mr-1 inline-block" />
                  Choose a square photo for the best result. JPG, PNG, and other
                  supported image formats up to 2 MB are accepted.
                </p>
              </div>
            </section>

            {/* Security card */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_40px_rgba(15,35,75,0.04)] sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-[#102448]">Account security</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Your account information is available from your profile.
                    Keep your login details secure.
                  </p>
                </div>
              </div>
            </section>
          </aside>

          {/* Right column */}
          <div className="space-y-6">
            {/* Personal information */}
            <section className="rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_40px_rgba(15,35,75,0.04)]">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <h2 className="text-lg font-bold text-[#102448]">
                    Personal information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your basic account details.
                  </p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:self-auto"
                  >
                    <Pencil size={15} />
                    Edit profile
                  </button>
                )}
              </div>

              <div className="space-y-6 p-5 sm:p-7">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>

                  {editing ? (
                    <input
                      id="profile-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  ) : (
                    <div className="flex min-h-12 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                      <UserRound
                        size={18}
                        className="shrink-0 text-slate-400"
                      />
                      <span className="break-words text-sm font-medium text-slate-800">
                        {user.name || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="flex min-h-12 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <Mail size={18} className="shrink-0 text-slate-400" />
                    <span
                      id="profile-email"
                      className="min-w-0 flex-1 break-all text-sm font-medium text-slate-800"
                    >
                      {user.email || "Not provided"}
                    </span>
                    <span className="shrink-0 rounded-md bg-slate-200/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Account
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Your email is read-only on this page.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="profile-phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Phone number
                  </label>

                  {editing ? (
                    <input
                      id="profile-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(event) =>
                        setForm({ ...form, phone: event.target.value })
                      }
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  ) : (
                    <div className="flex min-h-12 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                      <Phone size={18} className="shrink-0 text-slate-400" />
                      <span className="text-sm font-medium text-slate-800">
                        {user.phone || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                {editing && (
                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={saving || !form.name.trim()}
                      onClick={handleSave}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Check size={16} />
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Account overview */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_40px_rgba(15,35,75,0.04)] sm:p-7">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#102448]">
                  Account overview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your membership and account status.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <ShieldCheck size={21} />
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Account type
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#102448]">
                    {getRoleName(user.role)}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Your registered role
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <BadgeCheck size={21} />
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Verification status
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#102448]">
                    {user.is_verified ? "Verified" : "Not verified"}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Based on your saved account data
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <CalendarDays size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Account activity
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Sign-in method: {user.auth_provider || "Standard login"}
                  </p>
                </div>

                <ChevronRight size={18} className="shrink-0 text-slate-300" />
              </div>
            </section>

            {/* Logout */}
            <section className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="font-bold text-slate-800">Sign out</h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Sign out of your Vyapaar Bharat account on this device.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
              >
                <LogOut size={17} />
                Logout
              </button>
            </section>

            <p className="pb-4 text-center text-xs text-slate-400">
              Vyapaar Bharat · Your business, your profile.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
