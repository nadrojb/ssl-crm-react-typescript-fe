import { SlidersHorizontal, ArrowUpDown, Search } from "lucide-react";

type ToolbarOption = {
    value: string;
    label: string;
};

type DataTableToolbarProps = {
    searchValue: string;
    onSearchValueChange: (value: string) => void;
    filterLabel: string;
    filterValue: string;
    onFilterValueChange: (value: string) => void;
    filterOptions: readonly ToolbarOption[];
    sortLabel: string;
    sortValue: string;
    onSortValueChange: (value: string) => void;
    sortOptions: readonly ToolbarOption[];
};

export function DataTableToolbar({
    searchValue,
    onSearchValueChange,
    filterLabel,
    filterValue,
    onFilterValueChange,
    filterOptions,
    sortLabel,
    sortValue,
    onSortValueChange,
    sortOptions,
}: DataTableToolbarProps) {
    return (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchValueChange(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <label className="flex w-full items-center gap-2 sm:w-auto">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                        <SlidersHorizontal className="h-4 w-4" />
                        {filterLabel}
                    </span>
                    <select
                        value={filterValue}
                        onChange={(e) => onFilterValueChange(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-auto"
                    >
                        {filterOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex w-full items-center gap-2 sm:w-auto">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                        <ArrowUpDown className="h-4 w-4" />
                        {sortLabel}
                    </span>
                    <select
                        value={sortValue}
                        onChange={(e) => onSortValueChange(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-auto"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}

export default DataTableToolbar;
