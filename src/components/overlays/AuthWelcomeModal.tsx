import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { NavigationPage } from "../../types";

type AuthTab = "login" | "signup";

interface AuthWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string; phone: string }) => void;
  onNavigate: (page: NavigationPage) => void;
  initialTab?: AuthTab;
}

export const AuthWelcomeModal: React.FC<AuthWelcomeModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onNavigate,
  initialTab = "login",
}) => {
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setError("");
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchTab = (next: AuthTab) => {
    if (next === tab) return;
    resetForm();
    setTab(next);
  };

  const handleMaybeLater = () => {
    localStorage.setItem("enu_auth_modal_dismissed", "true");
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const displayName = email.split("@")[0];
    const user = {
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email,
      phone: "+91 98765 43210",
    };

    localStorage.setItem("enu_user", JSON.stringify(user));
    localStorage.setItem("enu_auth_modal_dismissed", "true");
    onLogin(user);
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const user = { name, email, phone };
    localStorage.setItem("enu_user", JSON.stringify(user));
    localStorage.setItem("enu_auth_modal_dismissed", "true");
    onLogin(user);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 animate-fadeIn"
      onClick={handleMaybeLater}
    >
      <div
        className="bg-white rounded-lg w-full max-w-[400px] shadow-xl border border-gray-200 overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#1D1D1D]">
              {tab === "login" ? "Sign in" : "Create account"}
            </h2>
            <p className="text-[13px] text-gray-500 mt-1">
              {tab === "login"
                ? "Welcome back to ENU Foods."
                : "Join ENU Foods to track orders and save favourites."}
            </p>
          </div>
          <button
            onClick={handleMaybeLater}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === "login"
                  ? "border-[#284C38] text-[#284C38]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab("signup")}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === "signup"
                  ? "border-[#284C38] text-[#284C38]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-center gap-2 text-red-600 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <FormField label="Email address">
                <InputField
                  icon={<Mail className="w-4 h-4" />}
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={setEmail}
                />
              </FormField>

              <FormField label="Password">
                <InputField
                  icon={<Lock className="w-4 h-4" />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={setPassword}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                />
              </FormField>

              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-[#284C38] font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#284C38] hover:bg-[#1E3A2B] text-white font-semibold text-sm py-2.5 rounded-md transition-colors"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <FormField label="Full name">
                <InputField
                  icon={<User className="w-4 h-4" />}
                  type="text"
                  placeholder="Enter Your Full Name"
                  value={name}
                  onChange={setName}
                />
              </FormField>

              <FormField label="Email address">
                <InputField
                  icon={<Mail className="w-4 h-4" />}
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={setEmail}
                />
              </FormField>

              <FormField label="Phone number">
                <InputField
                  icon={<Phone className="w-4 h-4" />}
                  type="tel"
                  placeholder="Enter your Phone Number"
                  value={phone}
                  onChange={setPhone}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Password">
                  <InputField
                    icon={<Lock className="w-4 h-4" />}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={setPassword}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    }
                  />
                </FormField>
                <FormField label="Confirm">
                  <InputField
                    icon={<Lock className="w-4 h-4" />}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    }
                  />
                </FormField>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                By creating an account, you agree to ENU Foods'{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate("terms");
                  }}
                  className="text-[#284C38] hover:underline font-medium"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate("privacy");
                  }}
                  className="text-[#284C38] hover:underline font-medium"
                >
                  Privacy Policy
                </button>
                .
              </p>

              <button
                type="submit"
                className="w-full bg-[#284C38] hover:bg-[#1E3A2B] text-white font-semibold text-sm py-2.5 rounded-md transition-colors"
              >
                Create Account
              </button>
            </form>
          )}

          <button
            onClick={handleMaybeLater}
            className="w-full mt-4 py-2 text-[13px] text-gray-400 hover:text-gray-600 font-medium transition-colors"
          >
            Continue as guest
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
        .animate-slideUp { animation: slideUp 0.2s ease-out; }
      `}</style>
    </div>
  );
};

/* Label sits above the field, not inside it as a placeholder-only cue —
   this is the pattern used by Amazon, Stripe, and most professional
   checkout/auth forms, since it keeps the field's purpose visible even
   after the user starts typing. */
const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const InputField: React.FC<{
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  trailing?: React.ReactNode;
}> = ({ icon, type, placeholder, value, onChange, trailing }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <span
        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
          focused ? "text-[#284C38]" : "text-gray-400"
        }`}
      >
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full bg-white border rounded-md py-2.5 pl-10 text-sm outline-none transition-colors ${
          trailing ? "pr-10" : "pr-3"
        } ${
          focused
            ? "border-[#284C38] ring-1 ring-[#284C38]/15"
            : "border-gray-300 hover:border-gray-400"
        }`}
      />
      {trailing && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {trailing}
        </span>
      )}
    </div>
  );
};
