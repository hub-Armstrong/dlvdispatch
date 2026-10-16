import { User, Order, Earning, OrderStatus } from "./types";
import { generateTrackingCode } from "./utils";

// ======================
// IN-MEMORY DATA STORE
// This is for local demo. Replace with Prisma + SQLite / Supabase later.
// ======================

const COMMISSION_RATE = 0.18; // 18%

// Seed Users
let users: User[] = [
  {
    id: "admin-1",
    name: "DLV Admin",
    email: "admin@dlvdispatch.com",
    phone: "08011111111",
    password: "admin123", // plain for demo only
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rider-1",
    name: "Chinedu Okoro",
    phone: "08022222222",
    password: "rider123",
    role: "RIDER",
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: "Chinedu Okoro",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rider-2",
    name: "Amaka Eze",
    phone: "08033333333",
    password: "rider123",
    role: "RIDER",
    bankName: "Access Bank",
    accountNumber: "9876543210",
    accountName: "Amaka Eze",
    createdAt: new Date().toISOString(),
  },
  {
    id: "customer-1",
    name: "Etiosa Joseph",
    phone: "08044444444",
    password: "customer123",
    role: "CUSTOMER",
    createdAt: new Date().toISOString(),
  },
];

let orders: Order[] = [
  {
    id: "order-1",
    trackingCode: "DLV-241015-A7K9",
    status: "PENDING",
    paymentMethod: "CASH",
    paymentStatus: "PENDING",
    customerId: "customer-1",
    customerName: "Etiosa Joseph",
    customerPhone: "08044444444",
    pickupAddress: "Effurun Market, Warri",
    pickupLandmark: "Near First Bank",
    dropoffAddress: "PTI Road, Effurun",
    dropoffLandmark: "Beside NNPC Housing",
    packageDescription: "Documents and small parcel",
    packageSize: "Small",
    deliveryFee: 2500,
    platformFee: 450,
    riderEarning: 2050,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

let earnings: Earning[] = [];

// ======================
// AUTH HELPERS
// ======================

export function findUserByPhone(phone: string) {
  return users.find((u) => u.phone === phone);
}

export function findUserById(id: string) {
  return users.find((u) => u.id === id);
}

export function createUser(data: {
  name: string;
  phone: string;
  password: string;
  role?: "CUSTOMER" | "RIDER";
  email?: string;
}) {
  const exists = users.find((u) => u.phone === data.phone);
  if (exists) throw new Error("Phone number already registered");

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name,
    phone: data.phone,
    password: data.password,
    email: data.email,
    role: data.role || "CUSTOMER",
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
}

// ======================
// ORDER HELPERS
// ======================

export function getAllOrders() {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrdersByCustomer(customerId: string) {
  return orders
    .filter((o) => o.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOrdersByRider(riderId: string) {
  return orders
    .filter((o) => o.riderId === riderId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOrderById(id: string) {
  return orders.find((o) => o.id === id);
}

export function getOrderByTracking(code: string) {
  return orders.find((o) => o.trackingCode === code);
}

export function createOrder(data: {
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
  deliveryFee: number;
  paymentMethod: "ONLINE" | "CASH";
}) {
  const platformFee = Math.round(data.deliveryFee * COMMISSION_RATE);
  const riderEarning = data.deliveryFee - platformFee;

  const newOrder: Order = {
    id: `order-${Date.now()}`,
    trackingCode: generateTrackingCode(),
    status: "PENDING",
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentMethod === "ONLINE" ? "PAID" : "PENDING",
    customerId: data.customerId,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    pickupAddress: data.pickupAddress,
    pickupLandmark: data.pickupLandmark,
    dropoffAddress: data.dropoffAddress,
    dropoffLandmark: data.dropoffLandmark,
    packageDescription: data.packageDescription,
    packageSize: data.packageSize,
    notes: data.notes,
    deliveryFee: data.deliveryFee,
    platformFee,
    riderEarning,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  return newOrder;
}

export function assignRider(orderId: string, riderId: string) {
  const order = orders.find((o) => o.id === orderId);
  const rider = users.find((u) => u.id === riderId && u.role === "RIDER");
  if (!order || !rider) throw new Error("Order or rider not found");

  order.riderId = riderId;
  order.riderName = rider.name;
  order.status = "ASSIGNED";
  order.updatedAt = new Date().toISOString();
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found");

  order.status = status;
  order.updatedAt = new Date().toISOString();

  if (status === "PICKED_UP") {
    order.pickedUpAt = new Date().toISOString();
  }

  if (status === "DELIVERED") {
    order.deliveredAt = new Date().toISOString();
    // Create earning for rider
    if (order.riderId) {
      const earning: Earning = {
        id: `earn-${Date.now()}`,
        riderId: order.riderId,
        orderId: order.id,
        amount: order.riderEarning,
        type: "delivery",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      earnings.push(earning);
    }
  }

  return order;
}

// ======================
// RIDER HELPERS
// ======================

export function getRiders() {
  return users.filter((u) => u.role === "RIDER");
}

export function getRiderEarnings(riderId: string) {
  return earnings.filter((e) => e.riderId === riderId);
}

export function getRiderBalance(riderId: string) {
  const list = earnings.filter((e) => e.riderId === riderId);
  const pending = list
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + e.amount, 0);
  const paid = list
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);
  return { pending, paid, total: pending + paid };
}

export function markEarningsPaid(riderId: string) {
  earnings.forEach((e) => {
    if (e.riderId === riderId && e.status === "pending") {
      e.status = "paid";
    }
  });
}

// ======================
// STATS
// ======================

export function getDashboardStats() {
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const inProgress = orders.filter((o) =>
    ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(o.status)
  ).length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;
  const revenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.platformFee, 0);

  return { totalOrders, pending, inProgress, delivered, revenue };
}
