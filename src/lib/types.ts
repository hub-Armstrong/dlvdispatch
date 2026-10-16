export type Role = "CUSTOMER" | "RIDER" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "ONLINE" | "CASH";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  password: string; // hashed in real app
  role: Role;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  trackingCode: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  customerId: string;
  customerName: string;
  customerPhone: string;

  pickupAddress: string;
  pickupLandmark?: string;
  dropoffAddress: string;
  dropoffLandmark?: string;

  packageDescription: string;
  packageSize?: string;
  notes?: string;

  riderId?: string;
  riderName?: string;

  deliveryFee: number;
  platformFee: number;
  riderEarning: number;

  paystackReference?: string;

  createdAt: string;
  updatedAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export interface Earning {
  id: string;
  riderId: string;
  orderId: string;
  amount: number;
  type: "delivery" | "tip";
  status: "pending" | "paid";
  createdAt: string;
}
