import { uiColors } from "../../styles/ui-colors";

type InstitutionTypeChipProps = {
    typeName: string | null | undefined;
};

const getInstitutionTypeClasses = (
    typeName: string | null | undefined
): string => {
    const normalized = typeName?.trim().toLowerCase();

    if (normalized === "school") return uiColors.pill.red;
    if (normalized === "arena") return uiColors.pill.blue;
    if (normalized === "leisure centre") return uiColors.pill.green;
    if (normalized === "theatre") return uiColors.pill.purple;
    if (normalized === "university" || normalized === "unniversity") {
        return uiColors.pill.pink;
    }

    return uiColors.pill.neutral;
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
