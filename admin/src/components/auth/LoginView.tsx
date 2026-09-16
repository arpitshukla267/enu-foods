import React, { useState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E2D5] shadow-lg overflow-hidden">
        <div className="px-8 py-6 bg-[#173D2A] text-white">
          <h1 className="text-2xl font-semibold font-serif-brand">ENU Foods Admin</h1>
          <p className="text-sm text-[#A6C5B3] mt-1">
            Sign in with your admin account to manage the store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-medium text-[#736854] uppercase tracking-wider mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                placeholder="admin@enufoods.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium text-[#736854] uppercase tracking-wider mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-[#173D2A] text-white text-sm font-medium hover:bg-[#245A3F] transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
