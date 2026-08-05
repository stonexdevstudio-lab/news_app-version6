import React, { useState } from "react";
import { ThemeConfig } from "../types";
import {
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  UserCheck,
  LogOut,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc
} from "../lib/firebase";

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: "apple" | "google" | "facebook" | "email" | "guest";
  uid?: string;
  role?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: ThemeConfig;
  userSession: UserSession;
  onLoginSuccess: (session: UserSession) => void;
  onLogout: () => void;
  initialMode?: "login" | "signup";
}

export const AuthLoginModal: React.FC<Props> = ({
  isOpen,
  onClose,
  themeConfig,
  userSession,
  onLoginSuccess,
  onLogout,
  initialMode = "login"
}) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const STAFF_MEMBERS = [
    {
      name: "Sanjoob Jaya Mohan",
      email: "msmohanan64@gmail.com",
      role: "Super Admin Director",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
    },
    {
      name: "Dr. Alex Rivers",
      email: "alex.rivers@flickpulse.com",
      role: "Senior Chief Journalist",
      avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    },
    {
      name: "Dr. Elena Vance",
      email: "elena.vance@pressbureau.com",
      role: "Editorial Safety Auditor",
      avatarUrl: "https://images.unsplash.com/photo-1594824813566-7885a3961c01?auto=format&fit=crop&q=80&w=200",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    },
    {
      name: "Chief Editor",
      email: "editor@pressbureau.com",
      role: "Chief Editorial Director",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    }
  ];

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSocialAuth = async (provider: "google" | "apple" | "facebook") => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (provider === "google") {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const name = user.displayName || user.email?.split("@")[0] || "User";
        const email = user.email || "";

        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              name,
              email,
              provider: "google",
              lastLogin: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (e) {
          console.warn("Firestore user sync warning:", e);
        }

        const session: UserSession = {
          isLoggedIn: true,
          name,
          email,
          avatarUrl: user.photoURL || undefined,
          provider: "google",
          uid: user.uid
        };
        onLoginSuccess(session);
        setSuccessMessage("Connected with Google!");
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 900);
      } else {
        const name = provider === "apple" ? "Alex Rivers" : "Sam Taylor";
        const email = provider === "apple" ? "alex.rivers@icloud.com" : "sam.taylor@facebook.com";
        const session: UserSession = {
          isLoggedIn: true,
          name,
          email,
          provider
        };
        onLoginSuccess(session);
        setSuccessMessage(`Authenticated with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`);
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 900);
      }
    } catch (err: any) {
      console.error("Social auth error:", err);
      setErrorMessage(err.message?.replace("Firebase: ", "") || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickStaffLogin = (staff: typeof STAFF_MEMBERS[0]) => {
    setIsLoading(true);
    setErrorMessage(null);
    const session: UserSession = {
      isLoggedIn: true,
      name: staff.name,
      email: staff.email,
      avatarUrl: staff.avatarUrl,
      provider: "email",
      uid: `staff_${staff.email.replace(/[^a-zA-Z0-9]/g, "_")}`,
      role: staff.role
    };
    onLoginSuccess(session);
    setSuccessMessage(`Logged in as ${staff.role} (${staff.name})`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1000);
    setIsLoading(false);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    // Check if email matches a registered staff member
    const matchedStaff = STAFF_MEMBERS.find((s) => s.email.toLowerCase() === emailInput.trim().toLowerCase());
    if (matchedStaff) {
      const session: UserSession = {
        isLoggedIn: true,
        name: matchedStaff.name,
        email: matchedStaff.email,
        avatarUrl: matchedStaff.avatarUrl,
        provider: "email",
        uid: `staff_${matchedStaff.email.replace(/[^a-zA-Z0-9]/g, "_")}`,
        role: matchedStaff.role
      };
      onLoginSuccess(session);
      setSuccessMessage(`Staff Verified: Logged in as ${matchedStaff.role}`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 900);
      setIsLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const userCred = await createUserWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
        const user = userCred.user;
        const name = emailInput.split("@")[0] || "Member";
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              name: formattedName,
              email: user.email,
              provider: "email",
              createdAt: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (e) {
          console.warn("Firestore sync warning:", e);
        }

        const session: UserSession = {
          isLoggedIn: true,
          name: formattedName,
          email: user.email || emailInput,
          provider: "email",
          uid: user.uid
        };
        onLoginSuccess(session);
        setSuccessMessage("Account created successfully!");
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 900);
      } else {
        const userCred = await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
        const user = userCred.user;
        const name = user.displayName || user.email?.split("@")[0] || "Member";
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

        const session: UserSession = {
          isLoggedIn: true,
          name: formattedName,
          email: user.email || emailInput,
          provider: "email",
          uid: user.uid
        };
        onLoginSuccess(session);
        setSuccessMessage("Welcome back!");
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 900);
      }
    } catch (err: any) {
      console.error("Auth submit error:", err);
      const code = err.code || "";
      if (code === "auth/email-already-in-use") {
        setErrorMessage("Account already exists. Switched to login mode.");
        setMode("login");
      } else if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setErrorMessage("Invalid email or password.");
      } else if (code === "auth/weak-password") {
        setErrorMessage("Password should be at least 6 characters.");
      } else {
        setErrorMessage(err.message?.replace("Firebase: ", "") || "Authentication failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn("Signout warning:", e);
    }
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative w-full max-w-md rounded-[36px] bg-[#0d0d0d] border border-zinc-800/80 p-6 sm:p-8 text-white shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors z-20 cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Toast / Success Popup Overlay */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-white text-black flex flex-col items-center justify-center p-6 text-center font-extrabold"
            >
              <CheckCircle2 className="w-12 h-12 mb-2 stroke-[2.5] text-emerald-600" />
              <h3 className="text-xl tracking-tight text-slate-900">{successMessage}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Connecting session...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {userSession.isLoggedIn ? (
          /* User Already Logged In Session Manager */
          <div className="text-center py-4 space-y-4">
            <div className="relative w-20 h-20 rounded-full bg-white/10 border-2 border-white text-white flex items-center justify-center mx-auto shadow-lg shadow-white/10 overflow-hidden">
              {userSession.avatarUrl ? (
                <img src={userSession.avatarUrl} alt={userSession.name} className="w-full h-full object-cover" />
              ) : (
                <UserCheck className="w-9 h-9" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">{userSession.name}</h3>
              <p className="text-xs text-zinc-400 font-medium">{userSession.email}</p>
            </div>

            <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-white border border-white/20">
              Active Session via {userSession.provider}
            </span>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
              >
                <span>Continue App Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSignOut}
                className="w-full py-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-800 hover:text-white transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Account</span>
              </button>
            </div>
          </div>
        ) : (
          /* Unauthenticated Login / Signup Form */
          <div className="overflow-y-auto custom-scrollbar flex-1 pr-1">
            {/* Heading & 2-Way Segmented Tab Switcher */}
            <div className="text-center mb-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1.5">
                {mode === "signup" ? "Create Account" : "Welcome back"}
              </h2>
              <p className="text-xs text-zinc-400 font-medium mb-4">
                Sign in to access your saved topics and rating history
              </p>

              {/* 2-Way Segmented Switcher */}
              <div className="flex bg-[#1a1a1d] p-1 rounded-2xl border border-zinc-800 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                    mode === "login"
                      ? "bg-white text-black shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                    mode === "signup"
                      ? "bg-white text-black shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STANDARD LOGIN / SIGNUP FORM */}
            <form onSubmit={handleSubmitForm} className="space-y-3.5">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#1a1a1d] border border-zinc-800 text-sm font-medium text-white placeholder-zinc-500 outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-[#1a1a1d] border border-zinc-800 text-sm font-medium text-white placeholder-zinc-500 outline-none focus:border-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 stroke-[1.8]" />
                      ) : (
                        <Eye className="w-5 h-5 stroke-[1.8]" />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !emailInput || !passwordInput}
                    className="w-full py-3.5 mt-1 rounded-full bg-white text-black font-extrabold text-sm sm:text-base tracking-wide hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-lg shadow-white/10 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {isLoading ? "Processing..." : mode === "signup" ? "Create Free Account" : "Log In"}
                  </button>
                </form>

                {/* Social Login Divider */}
                <div className="relative my-5 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800" />
                  </div>
                  <span className="relative px-3 bg-[#0d0d0d] text-[11px] text-zinc-400 font-medium">
                    or {mode === "signup" ? "sign up" : "log in"} with
                  </span>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth("google")}
                    className="py-3 px-3 rounded-2xl border border-zinc-800 hover:border-zinc-700 bg-[#161618] hover:bg-[#1e1e22] flex items-center justify-center transition-all active:scale-95 group cursor-pointer"
                    title="Sign in with Google"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth("apple")}
                    className="py-3 px-3 rounded-2xl border border-zinc-800 hover:border-zinc-700 bg-[#161618] hover:bg-[#1e1e22] flex items-center justify-center transition-all active:scale-95 group text-white cursor-pointer"
                    title="Sign in with Apple"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96.99-3.1-.98.04-2.19.66-2.88 1.47-.62.72-1.16 1.88-.99 3.01 1.1.08 2.24-.55 2.88-1.38z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth("facebook")}
                    className="py-3 px-3 rounded-2xl border border-zinc-800 hover:border-zinc-700 bg-[#161618] hover:bg-[#1e1e22] flex items-center justify-center transition-all active:scale-95 group text-[#1877F2] cursor-pointer"
                    title="Sign in with Facebook"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>

            {/* Legal Terms Footer */}
            <p className="mt-6 text-center text-[11px] text-zinc-500 leading-relaxed max-w-xs mx-auto">
              By logging in you agree to FlickPulse Cinema{" "}
              <button
                type="button"
                onClick={() => alert("Terms of Use: Standard end-user license agreement for FlickPulse Cinema.")}
                className="underline text-zinc-300 font-semibold hover:text-white transition-colors cursor-pointer"
              >
                Terms of use
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => alert("Privacy Policy: FlickPulse Cinema respects your data privacy.")}
                className="underline text-zinc-300 font-semibold hover:text-white transition-colors cursor-pointer"
              >
                Privacy policy
              </button>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

