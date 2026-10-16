"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getOrderById } from "@/lib/store";
import { Order } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { formatNaira } from "@/lib/utils";
import { ArrowLeft, MapPin, Package, Phone } from "lucide-react";

export default function OrderDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (params.id) {
      const found = getOrderById(params.id as string);
      setOrder(found || null);
    }
  }, [params.id]);

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/customer/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Deliveries
      </Link>

      <div className="card p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono font-bold text-lg">{order.trackingCode}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString("en-NG")}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Pickup</p>
              <p className="font-medium">{order.pickupAddress}</p>
              {order.pickupLandmark && (
                <p className="text-sm text-gray-500">{order.pickupLandmark}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Drop-off</p>
              <p className="font-medium">{order.dropoffAddress}</p>
              {order.dropoffLandmark && (
                <p className="text-sm text-gray-500">{order.dropoffLandmark}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex gap-3 mb-3">
            <Package className="w-5 h-5 text-gray-400 shrink-0" />
            <div>
              <p className="font-medium">{order.packageDescription}</p>
              <p className="text-sm text-gray-500">Size: {order.packageSize}</p>
              {order.notes && (
                <p className="text-sm text-gray-500 mt-1">Note: {order.notes}</p>
              )}
            </div>
          </div>
        </div>

        {order.riderName && (
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Rider:</strong> {order.riderName}
            </p>
          </div>
        )}

        <div className="border-t pt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Payment</p>
            <p className="font-medium">
              {order.paymentMethod === "ONLINE" ? "Paid Online" : "Cash on Delivery"}
            </p>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {formatNaira(order.deliveryFee)}
          </p>
        </div>
      </div>
    </div>
  );
}
