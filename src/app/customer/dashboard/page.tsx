"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getOrdersByCustomer } from "@/lib/store";
import { Order } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { formatNaira } from "@/lib/utils";
import { Plus, Package } from "lucide-react";

export default function CustomerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "CUSTOMER")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setOrders(getOrdersByCustomer(user.id));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Deliveries</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user.name}</p>
        </div>
        <Link
          href="/customer/book"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Book Delivery
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No deliveries yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            Book your first delivery and we&apos;ll take care of the rest.
          </p>
          <Link href="/customer/book" className="btn-primary inline-flex">
            Book Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/customer/orders/${order.id}`}
              className="card p-5 block hover:border-green-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono font-semibold text-sm">
                      {order.trackingCode}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.pickupAddress} → {order.dropoffAddress}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString("en-NG")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatNaira(order.deliveryFee)}</p>
                  <p className="text-xs text-gray-500">
                    {order.paymentMethod === "ONLINE" ? "Paid Online" : "Cash"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
