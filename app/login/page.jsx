"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data));

      router.replace("/products");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-4">

      <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl"></div>

     
      <div className="relative w-full max-w-md">

        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

         
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

         
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Admin Login
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Welcome back to Product Dashboard
            </p>
          </div>

          
          <form onSubmit={handleLogin} className="space-y-5">

          
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Username
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  👤
                </span>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full rounded-xl border border-white/10 bg-white/10 py-3.5 pl-12 pr-4 text-white placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white/15 focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>
            </div>

          
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔒
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-white/10 bg-white/10 py-3.5 pl-12 pr-4 text-white placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white/15 focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>
            </div>

           
            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

          </form>

         
          <div className="mt-8 border-t border-white/10 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Secure Admin Dashboard
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}