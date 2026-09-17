import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Package,
  Save,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  User,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import {
  deleteAccount,
  updateProfile,
  uploadAvatar,
} from "../services/profileService";

const MyAccount = () => {
  const {
    user,
    token,
    updateUser,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [avatarPreview, setAvatarPreview] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [
    uploadingAvatar,
    setUploadingAvatar,
  ] = useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  // ==========================================
  // DELETE ACCOUNT STATES
  // ==========================================

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [
    deletePassword,
    setDeletePassword,
  ] = useState("");

  const [
    showDeletePassword,
    setShowDeletePassword,
  ] = useState(false);

  const [
    deletingAccount,
    setDeletingAccount,
  ] = useState(false);

  const [
    deleteError,
    setDeleteError,
  ] = useState("");

  // ==========================================
  // SYNC USER DATA
  // ==========================================

  useEffect(() => {
    if (!user) return;

    setName(user.name);
    setEmail(user.email);
    setAvatarPreview(user.avatar ?? "");
  }, [user]);

  // Prevent page scrolling while delete modal is open
  useEffect(() => {
    if (!showDeleteModal) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [showDeleteModal]);

  if (!user || !token) {
    return null;
  }

  // ==========================================
  // ERROR HELPER
  // ==========================================

  const getErrorMessage = (
    err: unknown,
    fallback: string,
  ) => {
    if (axios.isAxiosError(err)) {
      return (
        err.response?.data?.message ??
        fallback
      );
    }

    return fallback;
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();

    const cleanEmail = email
      .trim()
      .toLowerCase();

    if (!cleanName || !cleanEmail) {
      setError(
        "Name and email address are required.",
      );
      return;
    }

    try {
      setSaving(true);

      const data = await updateProfile(
        token,
        {
          name: cleanName,
          email: cleanEmail,
        },
      );

      updateUser(data.user);

      if (
        data.requiresEmailVerification
      ) {
        const verificationEmail =
          data.verificationEmail ??
          data.user.email;

        navigate(
          `/verify-email?email=${encodeURIComponent(
            verificationEmail,
          )}`,
          {
            replace: true,
          },
        );

        return;
      }

      setSuccess(
        data.message ||
          "Your profile has been updated successfully.",
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to update your profile.",
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // AVATAR UPLOAD
  // ==========================================

  const handleAvatarChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      setError(
        "Please choose a JPG, PNG or WEBP image.",
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Profile photo cannot exceed 5MB.",
      );

      event.target.value = "";
      return;
    }

    const temporaryPreview =
      URL.createObjectURL(file);

    setAvatarPreview(temporaryPreview);

    try {
      setUploadingAvatar(true);

      const data = await uploadAvatar(
        token,
        file,
      );

      updateUser(data.user);

      setAvatarPreview(data.avatar);

      setSuccess(
        "Profile photo updated successfully.",
      );
    } catch (err) {
      setAvatarPreview(
        user.avatar ?? "",
      );

      setError(
        getErrorMessage(
          err,
          "Unable to upload your profile photo.",
        ),
      );
    } finally {
      URL.revokeObjectURL(
        temporaryPreview,
      );

      setUploadingAvatar(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ==========================================
  // DELETE ACCOUNT MODAL
  // ==========================================

  const openDeleteModal = () => {
    setDeletePassword("");
    setDeleteError("");
    setShowDeletePassword(false);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deletingAccount) {
      return;
    }

    setShowDeleteModal(false);
    setDeletePassword("");
    setDeleteError("");
    setShowDeletePassword(false);
  };

  // ==========================================
  // DELETE ACCOUNT
  // ==========================================

  const handleDeleteAccount = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setDeleteError("");

    if (!deletePassword.trim()) {
      setDeleteError(
        "Please enter your current password.",
      );
      return;
    }

    try {
      setDeletingAccount(true);

      await deleteAccount(
        token,
        deletePassword,
      );

      logout();

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      setDeleteError(
        getErrorMessage(
          err,
          "Unable to delete your account.",
        ),
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  // ==========================================
  // PROFILE HELPERS
  // ==========================================

  const hasChanges =
    name.trim() !== user.name ||
    email.trim().toLowerCase() !==
      user.email.toLowerCase();

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-50 sm:text-sm";

  return (
    <>
      <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 sm:py-10 lg:py-14">
        <div className="mx-auto max-w-6xl">
          {/* HEADER */}

          <div className="mb-6 sm:mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm">
              SUMART Account
            </p>

            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:mt-3 sm:text-base">
              Manage your personal
              information, profile photo and
              SUMART account.
            </p>
          </div>

          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[330px_1fr]">
            {/* PROFILE CARD */}

            <aside className="h-fit overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:rounded-3xl">
              <div className="h-24 bg-linear-to-r from-green-600 to-emerald-500 sm:h-28" />

              <div className="px-4 pb-5 sm:px-6 sm:pb-7">
                <div className="-mt-12 sm:-mt-14">
                  <div className="relative inline-block">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-green-50 shadow-md sm:h-28 sm:w-28">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-green-700 sm:text-3xl">
                          {initials}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={
                        uploadingAvatar
                      }
                      className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-green-600 text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Change profile photo"
                    >
                      {uploadingAvatar ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Camera size={16} />
                      )}
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleAvatarChange
                      }
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <h2 className="wrap-break-word text-xl font-bold text-slate-900 sm:text-2xl">
                    {user.name}
                  </h2>

                  <p className="mt-1 break-all text-sm leading-5 text-slate-500">
                    {user.email}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold capitalize text-green-700 sm:mt-4">
                    <ShieldCheck size={14} />
                    {user.role}
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 sm:mt-5">
                  <p className="text-xs leading-5 text-slate-500">
                    Tap the camera icon to
                    update your photo. JPG,
                    PNG or WEBP, up to 5MB.
                  </p>
                </div>

                <div className="my-5 border-t border-slate-100 sm:my-6" />

                <Link
                  to="/orders"
                  className="flex min-h-12 items-center justify-between rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  <span className="flex items-center gap-2">
                    <Package size={17} />
                    My Orders
                  </span>

                  <span aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </aside>

            {/* RIGHT */}

            <section className="min-w-0 space-y-5 sm:space-y-6">
              {/* Messages */}

              {success && (
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm leading-6 text-green-800 sm:rounded-2xl sm:px-5 sm:py-4">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0"
                  />

                  <p>{success}</p>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-6 text-red-700 sm:rounded-2xl sm:px-5 sm:py-4">
                  {error}
                </div>
              )}

              {/* PERSONAL INFORMATION */}

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8">
                <div className="mb-5 border-b border-slate-100 pb-5 sm:mb-8 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:pb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Update your personal
                      details below.
                    </p>
                  </div>

                  <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 sm:mt-0">
                    <ShieldCheck
                      size={14}
                      className="text-green-600"
                    />

                    Secure account
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                    {/* Name */}

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Full Name
                      </label>

                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(event) =>
                            setName(
                              event.target.value,
                            )
                          }
                          maxLength={50}
                          autoComplete="name"
                          className={
                            inputClassName
                          }
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* Email */}

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Email Address
                      </label>

                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(event) =>
                            setEmail(
                              event.target.value,
                            )
                          }
                          autoComplete="email"
                          className={
                            inputClassName
                          }
                          placeholder="Enter your email address"
                        />
                      </div>

                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        Changing your email
                        requires verification
                        of the new address.
                      </p>
                    </div>
                  </div>

                  {/* Role */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Account Role
                    </label>

                    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
                      <ShieldCheck
                        size={18}
                        className="mt-0.5 shrink-0 text-green-600"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-semibold capitalize text-slate-800">
                          {user.role}
                        </p>

                        <p className="mt-0.5 text-xs leading-5 text-slate-400">
                          Your account role
                          cannot be changed
                          here.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Save */}

                  <div className="border-t border-slate-100 pt-5 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:pt-6">
                    <p className="text-xs leading-5 text-slate-400">
                      Changes will be reflected
                      across your SUMART
                      account.
                    </p>

                    <button
                      type="submit"
                      disabled={
                        saving ||
                        uploadingAvatar ||
                        !hasChanges
                      }
                      className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:mt-0 sm:w-auto"
                    >
                      {saving ? (
                        <>
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={17} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* SHOPPING CTA */}

              <div className="rounded-2xl bg-linear-to-br from-green-600 to-emerald-500 p-5 text-white shadow-sm sm:rounded-3xl sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-100 sm:text-sm">
                  SUMART
                </p>

                <h2 className="mt-2.5 text-xl font-bold leading-tight sm:mt-3 sm:text-2xl">
                  Everything you need, all in
                  one place.
                </h2>

                <p className="mt-2.5 text-sm leading-6 text-green-50 sm:mt-3 sm:max-w-xl sm:text-base sm:leading-7">
                  Keep your profile up to
                  date, manage your orders and
                  continue discovering
                  products across SUMART.
                </p>

                <Link
                  to="/shop"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-700 transition hover:bg-green-50 sm:mt-6 sm:w-auto"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* DANGER ZONE */}

              {user.role !== "admin" && (
                <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm sm:rounded-3xl">
                  <div className="border-b border-red-100 bg-red-50 px-4 py-4 sm:px-8 sm:py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <TriangleAlert
                          size={20}
                        />
                      </div>

                      <div>
                        <h2 className="font-bold text-red-700">
                          Danger Zone
                        </h2>

                        <p className="mt-0.5 text-xs text-red-500 sm:text-sm">
                          Irreversible account
                          actions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
                    <div className="max-w-xl">
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                        Delete your SUMART
                        account
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Permanently delete your
                        account and remove your
                        access to SUMART. Your
                        existing transaction
                        and order records may
                        be retained for
                        business and
                        record-keeping
                        purposes.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        openDeleteModal
                      }
                      className="mt-5 inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 sm:mt-0 sm:w-auto"
                    >
                      <Trash2 size={17} />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* DELETE ACCOUNT MODAL */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-100 flex items-end justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
          >
            {/* Header */}

            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white p-4 sm:p-6">
              <div className="flex min-w-0 gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 sm:h-12 sm:w-12 sm:rounded-2xl">
                  <Trash2 size={20} />
                </div>

                <div className="min-w-0">
                  <h2
                    id="delete-account-title"
                    className="text-lg font-bold text-slate-900 sm:text-xl"
                  >
                    Delete account?
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">
                    This action cannot be
                    undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={
                  deletingAccount
                }
                className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={
                handleDeleteAccount
              }
              className="p-4 sm:p-6"
            >
              <div className="rounded-xl border border-red-100 bg-red-50 p-3.5 sm:rounded-2xl sm:p-4">
                <div className="flex gap-3">
                  <TriangleAlert
                    size={18}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <p className="min-w-0 wrap-break-word text-sm leading-6 text-red-700">
                    You're about to
                    permanently delete the
                    account for{" "}
                    <span className="break-all font-semibold">
                      {user.email}
                    </span>
                    . You will immediately
                    lose access to this
                    account.
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <label
                  htmlFor="delete-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Enter your current password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="delete-password"
                    type={
                      showDeletePassword
                        ? "text"
                        : "password"
                    }
                    value={deletePassword}
                    onChange={(event) => {
                      setDeletePassword(
                        event.target.value,
                      );

                      if (deleteError) {
                        setDeleteError("");
                      }
                    }}
                    autoComplete="current-password"
                    disabled={
                      deletingAccount
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-50 disabled:bg-slate-50 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowDeletePassword(
                        (current) =>
                          !current,
                      )
                    }
                    disabled={
                      deletingAccount
                    }
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed"
                    aria-label={
                      showDeletePassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showDeletePassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {deleteError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                  {deleteError}
                </div>
              )}

              <p className="mt-4 text-xs leading-5 text-slate-400">
                For your security, we require
                your current password before
                deleting your account.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-7 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={
                    deletingAccount
                  }
                  className="min-h-12 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    deletingAccount ||
                    !deletePassword.trim()
                  }
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 sm:w-auto"
                >
                  {deletingAccount ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={17} />
                      Permanently Delete
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyAccount;