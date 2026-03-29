import { uiColors } from "../../styles/ui-colors";

export type StatusBadgeStatus = "Active" | "Pending" | "Inactive";

type StatusBadgeProps = {
    status: StatusBadgeStatus;
};

const statusStyles: Record<StatusBadgeStatus, string> = {
    Active: uiColors.pill.green,
    Pending: uiColors.pill.yellow,
    Inactive: uiColors.pill.neutral,
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

export default StatusBadge;
