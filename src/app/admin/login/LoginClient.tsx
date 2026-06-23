"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, LogIn, Sparkles, AlertCircle } from "lucide-react";
import { loginAction } from "./actions";
import { useRouter } from "next/navigation";

export const LoginClient: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await loginAction({ username, password });

    if (result.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setLoading(false);
      setError(result.error || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0C0A09]">
      {/* Workshop background */}
      <div className="absolute inset-0">
        <img
          src="/workshop.png"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C0A09]/95 via-[#1C1917]/80 to-[#0C0A09]/95" />
      </div>

      {/* Floating gold blur orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#CA8A04]/8 blur-3xl pointer-events-none"
        animate={{ x: [0, 30, -15, 0], y: [0, -25, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#CA8A04]/5 blur-3xl pointer-events-none"
        animate={{ x: [0, -20, 25, 0], y: [0, 20, -30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />



      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="flex justify-center mb-4">
              <img
                src="/logo.png"
                alt="Ageman"
                className="h-14 w-auto opacity-90"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CA8A04]/15 border border-[#CA8A04]/25 text-[#CA8A04] text-[10px] font-bold tracking-widest uppercase">
              <Sparkles size={10} /> ATELIER OWNER ACCESS
            </div>
            <h1 className="font-cormorant text-3xl font-bold text-white tracking-wide">
              Dashboard Login
            </h1>
            <p className="text-xs text-white/40 font-light">
              Authenticate to manage your storefront, orders & collections.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#CA8A04]/30 to-transparent mb-8" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold tracking-widest text-white/50 uppercase">
                Username
              </label>
              <div className="relative group">
                <User
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#CA8A04] transition-colors duration-200"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#CA8A04]/60 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-all duration-200 focus:bg-white/[0.07]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold tracking-widest text-white/50 uppercase">
                Password
              </label>
              <div className="relative group">
                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#CA8A04] transition-colors duration-200"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#CA8A04]/60 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-all duration-200 focus:bg-white/[0.07]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs"
              >
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#CA8A04] hover:bg-[#CA8A04]/90 disabled:bg-[#CA8A04]/40 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-[#CA8A04]/20 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <LogIn size={15} /> ENTER DASHBOARD
                </>
              )}
            </button>
          </form>

          {/* Footer hint */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 tracking-wide">
              AGEMAN BESPOKE · OWNER PORTAL · PRIVATE ACCESS ONLY
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
