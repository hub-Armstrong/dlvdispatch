"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createOrder } from "@/lib/store";
import { formatNaira } from "@/lib/utils";

export default function BookDeliveryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupLandmark, setPickupLandmark] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [dropoffLandmark, setDropoffLandmark] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [packageSize, setPackageSize] = useState("Small");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "CASH">("CASH");
  const [deliveryFee] = useState(2500); // Fixed for MVP – can be calculated later
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "CUSTOMER")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSubmitting(true);

    try {
      // In production: if ONLINE, redirect to Paystack checkout here
      const order = createOrder({
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.phone,
        pickupAddress,
        pickupLandmark,
        dropoffAddress,
        dropoffLandmark,
        packageDescription,
        packageSize,
        notes,
        deliveryFee,
        paymentMethod,
      });

      router.push(`/customer/orders/${order.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Book a Delivery</h1>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Pickup */}
        <div>
          <h2 className="font-semibold mb-3 text-green-700">Pickup Location</h2>
          <div className="space-y-3">
            <input
              className="input"
              placeholder="Pickup address (e.g. Effurun Market)"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Landmark (optional)"
              value={pickupLandmark}
              onChange={(e) => setPickupLandmark(e.target.value)}
            />
          </div>
        </div>

        {/* Dropoff */}
        <div>
          <h2 className="font-semibold mb-3 text-green-700">Drop-off Location</h2>
          <div className="space-y-3">
            <input
              className="input"
              placeholder="Drop-off address"
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Landmark (optional)"
              value={dropoffLandmark}
              onChange={(e) => setDropoffLandmark(e.target.value)}
            />
          </div>
        </div>

        {/* Package */}
        <div>
          <h2 className="font-semibold mb-3">Package Details</h2>
          <div className="space-y-3">
            <input
              className="input"
              placeholder="What are you sending?"
              value={packageDescription}
              onChange={(e) => setPackageDescription(e.target.value)}
              required
            />
            <select
              className="input"
              value={packageSize}
              onChange={(e) => setPackageSize(e.target.value)}
            >
              <option value="Small">Small (documents, phone, etc.)</option>
              <option value="Medium">Medium (bag, box)</option>
              <option value="Large">Large (bigger items)</option>
            </select>
            <textarea
              className="input"
              placeholder="Additional notes (optional)"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Payment */}
        <div>
          <h2 className="font-semibold mb-3">Payment Method</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("CASH")}
              className={`p-3 rounded-lg border text-sm font-medium ${
                paymentMethod === "CASH"
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200"
              }`}
            >
              Cash on Delivery
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("ONLINE")}
              className={`p-3 rounded-lg border text-sm font-medium ${
                paymentMethod === "ONLINE"
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200"
              }`}
            >
              Pay Online (Paystack)
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {paymentMethod === "ONLINE"
              ? "You will be redirected to Paystack (demo: payment marked as paid)"
              : "Pay the rider when they deliver"}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
          <span className="font-medium">Delivery Fee</span>
          <span className="text-xl font-bold text-green-700">
            {formatNaira(deliveryFee)}
          </span>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Creating order..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}
