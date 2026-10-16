"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  getOrdersByRider,
  updateOrderStatus,
  getRiderBalance,
} from "@/lib/store";
import { Order, OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { formatNaira } from "@/lib/utils";

export default function RiderDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Order[]>([]);
  const [balance, setBalance] = useState({ pending: 0, paid: 0, total: 0 });

  useEffect(() => {
    if (!loading && (!user || user.role !== "RIDER")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const refresh = () => {
    if (user) {
      setJobs(getOrdersByRider(user.id));
      setBalance(getRiderBalance(user.id));
    }
  };

  useEffect(() => {
    if (user?.role === "RIDER") refresh();
  }, [user]);

  const handleStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    refresh();
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">My Jobs</h1>
      <p className="text-gray-500 text-sm mb-6">Welcome, {user.name}</p>

      {/* Earnings */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-green-700">
            {formatNaira(balance.pending)}
          </p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold">{formatNaira(balance.paid)}</p>
          <p className="text-xs text-gray-500">Paid Out</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold">{formatNaira(balance.total)}</p>
          <p className="text-xs text-gray-500">Total Earned</p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          No jobs assigned yet. Check back soon!
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-semibold text-sm">
                      {job.trackingCode}
                    </span>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="text-sm font-medium">
                    {job.pickupAddress} → {job.dropoffAddress}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.packageDescription} • {job.customerName} ({job.customerPhone})
                  </p>
                  <p className="text-sm font-semibold text-green-700 mt-2">
                    You earn: {formatNaira(job.riderEarning)}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {job.status === "ASSIGNED" && (
                    <button
                      onClick={() => handleStatus(job.id, "PICKED_UP")}
                      className="btn-primary text-sm"
                    >
                      Mark Picked Up
                    </button>
                  )}
                  {job.status === "PICKED_UP" && (
                    <button
                      onClick={() => handleStatus(job.id, "IN_TRANSIT")}
                      className="btn-primary text-sm"
                    >
                      Start Transit
                    </button>
                  )}
                  {job.status === "IN_TRANSIT" && (
                    <button
                      onClick={() => handleStatus(job.id, "DELIVERED")}
                      className="btn-primary text-sm"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {job.status === "DELIVERED" && (
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
