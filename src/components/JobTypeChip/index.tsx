type JobTypeChipProps = {
    typeName: string | null | undefined;
};

const getJobTypeClasses = (typeName: string | null | undefined): string => {
    const normalized = typeName?.trim().toLowerCase();

    if (normalized === "service") return "bg-blue-100 text-blue-800";
    if (normalized === "remedial") return "bg-orange-100 text-orange-800";

    return "bg-gray-100 text-gray-800";
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
