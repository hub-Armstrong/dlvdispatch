"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(phone, password);
      if (user.role === "ADMIN") router.push("/admin/dashboard");
      else if (user.role === "RIDER") router.push("/rider/dashboard");
      else router.push("/customer/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Login to DLVdispatch
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              className="input"
              placeholder="08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-green-600 font-medium hover:underline">
            Register
          </Link>
        </p>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
          <p className="font-medium mb-2">Demo Accounts:</p>
          <p>Admin: 08011111111 / admin123</p>
          <p>Rider: 08022222222 / rider123</p>
          <p>Customer: 08044444444 / customer123</p>
        </div>
      </div>
    </div>
  );
}
