"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LogOut, Package, User as UserIcon, Menu, X } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push("/login");
  };

  const dashboardPath =
    user?.role === "ADMIN"
      ? "/admin/dashboard"
      : user?.role === "RIDER"
      ? "/rider/dashboard"
      : "/customer/dashboard";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">
              DLV<span className="text-green-600">dispatch</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={dashboardPath}
                  className="text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserIcon className="w-4 h-4" />
                  <span>{user.name}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-100 py-3 space-y-2">
            {user ? (
              <>
                <div className="px-2 py-2 text-sm text-gray-600">
                  {user.name} · <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{user.role}</span>
                </div>
                <Link
                  href={dashboardPath}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
