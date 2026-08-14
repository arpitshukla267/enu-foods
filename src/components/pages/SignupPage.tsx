import React, { useState } from "react";
import { Lock, Mail, Shield, User, Phone, AlertCircle } from "lucide-react";
import { NavigationPage } from "../../types";

interface SignupPageProps {
  onLogin: (user: { name: string; email: string; phone: string }) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onLogin, onNavigate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    // Mock signup
    const user = {
      name,
      email,
      phone,
    };

    localStorage.setItem("enu_user", JSON.stringify(user));
    onLogin(user);
    onNavigate("home");
  };

  return (
    <div className="pt-28 pb-20 bg-[#F7F5EF] min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl w-full max-w-md border border-[#D6A146]/20 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#1E3A2B] text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D6A146]/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#D6A146]/20 border border-[#D6A146]/40 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-[#D6A146]" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Create Account</h1>
            <p className="font-body text-xs text-gray-300 font-light mt-1">
              Join ENU Foods for gourmet spices and express delivery
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F7F5EF] border border-transparent focus:border-[#D6A146] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F5EF] border border-transparent focus:border-[#D6A146] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F7F5EF] border border-transparent focus:border-[#D6A146] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F7F5EF] border border-transparent focus:border-[#D6A146] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
                Confirm
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F7F5EF] border border-transparent focus:border-[#D6A146] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="accent-[#284C38] rounded border-gray-300 mt-1"
            />
            <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer select-none">
              I agree to the{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Terms of Service (simulated)."); }} className="text-[#284C38] hover:underline font-semibold">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Privacy Policy (simulated)."); }} className="text-[#284C38] hover:underline font-semibold">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#284C38] hover:bg-[#1E3A2B] text-white font-btn font-bold text-sm py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-[1px] mt-2"
          >
            Create Account
          </button>

          {/* Bottom Navigation */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="text-[#284C38] font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
