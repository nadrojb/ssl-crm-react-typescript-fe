import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getInstitutions } from "../../api/institutions";
import { getInstitutionTypes, type InstitutionType } from "../../api/institution-types";
import { type Institution } from "../../api/schemas/institution";
import { getErrorMessage } from "../../utils/errors";
import { DataTable } from "../../components/DataTable";
import { DataTableToolbar } from "../../components/DataTableToolbar";
import { InstitutionTypeChip } from "../../components/InstitutionTypeChip";
import { Layout } from "../../components/Layout";
import { ButtonStandard } from "../../components/ButtonStandard";

const sortOptions = [
    { value: "name", label: "Name (A–Z)" },
    { value: "-name", label: "Name (Z–A)" },
    { value: "service_due_at", label: "Service due (soonest)" },
    { value: "-service_due_at", label: "Service due (latest)" },
    { value: "created_at", label: "Created (oldest)" },
    { value: "-created_at", label: "Created (newest)" },
] as const;

const columns = [
    {
        id: "name",
        header: "Institution",
        cell: (institution: Institution) => institution.name,
        cellClassName:
            "whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900",
    },
    {
        id: "primaryContact",
        header: "Primary contact",
        cell: (institution: Institution) =>
            institution.primary_contact
                ? `${institution.primary_contact.first_name} ${institution.primary_contact.last_name}`
                : "—",
        cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
    },
    {
        id: "type",
        header: "Type",
        cell: (institution: Institution) => (
            <InstitutionTypeChip typeName={institution.type?.name} />
        ),
        cellClassName: "whitespace-nowrap px-6 py-4",
    },
    {
        id: "serviceDue",
        header: "Service due",
        cell: (institution: Institution) =>
            institution.service_due_at ?? "—",
        cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
    },
    {
        id: "serviceBooked",
        header: "Service booked",
        cell: (institution: Institution) =>
            institution.service_booked_at ?? "—",
        cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
    },
    {
        id: "remedialsBooked",
        header: "Remedials booked",
        cell: (institution: Institution) =>
            institution.remedials_booked_at ?? "—",
        cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
    },
] as const;

export function Institutions() {
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState("");
    const [filterValue, setFilterValue] = useState("all");
    const [sortValue, setSortValue] = useState("name");

    const [institutionTypes, setInstitutionTypes] = useState<InstitutionType[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 👉 load institution types once (for filter dropdown)
    useEffect(() => {
        const loadTypes = async () => {
            try {
                const res = await getInstitutionTypes({ page: 1, perPage: 250, sort: "name" });
                setInstitutionTypes(res.data);
            } catch {
                // silently fail — filter dropdown will just be empty
            }
        };
        loadTypes();
    }, []);

    // 👉 load institutions when search/filter/sort change
    useEffect(() => {
        const loadInstitutions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await getInstitutions({
                    page: 1,
                    perPage: 25,
                    sort: sortValue,
                    filterName: searchValue.trim().length > 0 ? searchValue.trim() : undefined,
                    filterTypeId:
                        filterValue === "all" ? undefined : Number(filterValue),
                });
                setInstitutions(res.data);
            } catch (err: unknown) {
                setError(getErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };
        loadInstitutions();
    }, [filterValue, searchValue, sortValue]);

    const filterOptions = [
        { value: "all", label: "All" },
        ...institutionTypes.map((type) => ({
            value: String(type.id),
            label: type.name,
        })),
    ];

    return (
        <Layout>

            <div className="mb-4 flex items-start justify-end">
                <ButtonStandard
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/institutions/new")}
                >
                    Create Institution
                </ButtonStandard>
            </div>

            {error ? (
                <div className="mb-4 text-red-600">
                    {error}
                </div>
            ) : null}

            {isLoading ? (
                <div>Loading…</div>
            ) : (
                <>
                    <DataTableToolbar
                        searchValue={searchValue}
                        onSearchValueChange={setSearchValue}
                        filterLabel="Filter"
                        filterValue={filterValue}
                        onFilterValueChange={setFilterValue}
                        filterOptions={filterOptions}
                        sortLabel="Sort"
                        sortValue={sortValue}
                        onSortValueChange={setSortValue}
                        sortOptions={sortOptions}
                    />
                    <DataTable
                        title="Institutions"
                        data={institutions}
                        columns={columns}
                        getRowKey={(institution) => institution.id}
                        onRowClick={(institution) =>
                            navigate(`/institutions/${institution.id}`)
                        }
                    />
                </>
            )}
        </Layout>
    );
}

export default Institutions;