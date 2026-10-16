"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  getAllOrders,
  getDashboardStats,
  getRiders,
  assignRider,
  updateOrderStatus,
} from "@/lib/store";
import { Order, OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { formatNaira } from "@/lib/utils";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    inProgress: 0,
    delivered: 0,
    revenue: 0,
  });
  const [riders, setRiders] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const refresh = () => {
    setOrders(getAllOrders());
    setStats(getDashboardStats());
    setRiders(getRiders());
  };

  useEffect(() => {
    if (user?.role === "ADMIN") refresh();
  }, [user]);

  const handleAssign = (orderId: string, riderId: string) => {
    assignRider(orderId, riderId);
    refresh();
  };

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Orders", value: stats.totalOrders },
          { label: "Pending", value: stats.pending },
          { label: "In Progress", value: stats.inProgress },
          { label: "Delivered", value: stats.delivered },
          { label: "Revenue", value: formatNaira(stats.revenue) },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders */}
      <h2 className="font-semibold text-lg mb-4">All Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono font-semibold text-sm">
                    {order.trackingCode}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm">
                  {order.customerName} • {order.customerPhone}
                </p>
                <p className="text-sm text-gray-600">
                  {order.pickupAddress} → {order.dropoffAddress}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatNaira(order.deliveryFee)} •{" "}
                  {order.paymentMethod === "ONLINE" ? "Online" : "Cash"}
                  {order.riderName && ` • Rider: ${order.riderName}`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {order.status === "PENDING" && (
                  <select
                    className="text-sm border rounded-lg px-2 py-1.5"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) handleAssign(order.id, e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Assign Rider
                    </option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                )}

                {["ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(order.status) && (
                  <select
                    className="text-sm border rounded-lg px-2 py-1.5"
                    value={order.status}
                    onChange={(e) =>
                      handleStatus(order.id, e.target.value as OrderStatus)
                    }
                  >
                    <option value="ASSIGNED">Assigned</option>
                    <option value="PICKED_UP">Picked Up</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
