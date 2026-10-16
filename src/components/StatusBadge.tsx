import { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ASSIGNED: "bg-blue-100 text-blue-800 border-blue-200",
  PICKED_UP: "bg-orange-100 text-orange-800 border-orange-200",
  IN_TRANSIT: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  ASSIGNED: "Assigned",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
