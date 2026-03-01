export type StatusBadgeStatus = "Active" | "Pending" | "Inactive";

interface StatusBadgeProps {
  status: StatusBadgeStatus;
}

const statusStyles: Record<StatusBadgeStatus, string> = {
  Active: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Inactive: "bg-gray-100 text-gray-800",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
