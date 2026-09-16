import React, { useState } from "react";
import { Lock, Mail, Shield, AlertCircle } from "lucide-react";
import { NavigationPage } from "../../types";

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; phone: string }) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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

    // Mock Login
    const name = email.split("@")[0];
    const user = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      phone: "+91 98765 43210",
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
            <h1 className="font-heading text-2xl font-bold tracking-tight">Welcome Back</h1>
            <p className="font-body text-xs text-gray-300 font-light mt-1">
              Sign in to manage your premium spice orders
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
                className="w-full bg-[#F7F5EF] border border-transparent focus:border-[#D6A146] focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset link sent (simulated).")}
                className="text-xs text-[#C86D39] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F5EF] border border-transparent focus:border-[#D6A146] focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="accent-[#284C38] rounded border-gray-300"
              defaultChecked
            />
            <label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer">
              Remember me on this device
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#284C38] hover:bg-[#1E3A2B] text-white font-btn font-bold text-sm py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-[1px]"
          >
            Sign In
          </button>

          {/* Social Sign-in (Visual Only) */}
          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 border-b border-gray-200 -z-10"></span>
            <span className="bg-white px-3 text-xs text-gray-400">or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => alert("Google sign in is simulated.")}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-[#F7F5EF] py-2.5 rounded-xl text-xs font-semibold text-gray-600 transition-all"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-4 h-4"
              />
              Google
            </button>
            <button
              type="button"
              onClick={() => alert("Apple sign in is simulated.")}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-[#F7F5EF] py-2.5 rounded-xl text-xs font-semibold text-gray-600 transition-all"
            >
              <img
                src="https://www.svgrepo.com/show/475633/apple-color.svg"
                alt="Apple"
                className="w-4 h-4"
              />
              Apple
            </button>
          </div>

          {/* Bottom Navigation */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("signup")}
                className="text-[#284C38] font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          <div className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1.5 pt-2">
            <span>🔒</span>
            <span>256-bit SSL Encrypted Connection</span>
          </div>
        </form>
      </div>
    </div>
  );
};
