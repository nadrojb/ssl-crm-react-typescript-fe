type InstitutionTypeChipProps = {
    typeName: string | null | undefined;
};

const getInstitutionTypeClasses = (
    typeName: string | null | undefined
): string => {
    const normalized = typeName?.trim().toLowerCase();

    if (normalized === "school") return "bg-red-100 text-red-800";
    if (normalized === "arena") return "bg-blue-100 text-blue-800";
    if (normalized === "leisure centre") return "bg-green-100 text-green-800";
    if (normalized === "theatre") return "bg-purple-100 text-purple-800";
    if (normalized === "university" || normalized === "unniversity") {
        return "bg-pink-100 text-pink-800";
    }

    return "bg-gray-100 text-gray-800";
};

export function InstitutionTypeChip({ typeName }: InstitutionTypeChipProps) {
    const label = typeName?.trim() ? typeName : "—";

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getInstitutionTypeClasses(
                typeName
            )}`}
        >
            {label}
        </span>
    );
}

export default InstitutionTypeChip;
