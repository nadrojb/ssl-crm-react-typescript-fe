import { uiColors } from "../../styles/ui-colors";

type JobTypeChipProps = {
    typeName: string | null | undefined;
};

const getJobTypeClasses = (typeName: string | null | undefined): string => {
    const normalized = typeName?.trim().toLowerCase();

    if (normalized === "service") return uiColors.pill.blue;
    if (normalized === "remedial") return uiColors.pill.orange;

    return uiColors.pill.neutral;
};

export function JobTypeChip({ typeName }: JobTypeChipProps) {
    const label = typeName?.trim() ? typeName : "—";

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getJobTypeClasses(
                typeName
            )}`}
        >
            {label}
        </span>
    );
}

export default JobTypeChip;
