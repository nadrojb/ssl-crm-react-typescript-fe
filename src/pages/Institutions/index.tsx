import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getInstitutions, type InstitutionsListResponse } from "../../api/institutions";
import { getInstitutionTypes } from "../../api/institution-types";
import { type Institution } from "../../api/schemas/institution";
import { getAppErrorMessage } from "../../api/errorHandler";
import { DataTable } from "../../components/DataTable";
import { DataTableToolbar } from "../../components/DataTableToolbar";
import { InstitutionTypeChip } from "../../components/InstitutionTypeChip";
import { Layout } from "../../components/Layout";
import { useAsyncData } from "../../hooks/use-async-data";

export function Institutions() {
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState<string>("");
    const [filterValue, setFilterValue] = useState<string>("all");
    const [sortValue, setSortValue] = useState<string>("name");

    const { data: institutionTypesData } = useAsyncData(
        async () => getInstitutionTypes({ page: 1, perPage: 250, sort: "name" }),
        []
    );

    const institutionTypeOptions = useMemo(() => {
        const apiTypes = institutionTypesData?.data ?? [];
        return apiTypes.map((type) => ({
            value: String(type.id),
            label: type.name,
        }));
    }, [institutionTypesData]);

    const filterOptions = useMemo(() => {
        return [{ value: "all", label: "All" }, ...institutionTypeOptions] as const;
    }, [institutionTypeOptions]);

    const sortOptions = useMemo(
        () =>
            [
                { value: "name", label: "Name (A–Z)" },
                { value: "-name", label: "Name (Z–A)" },
                { value: "service_due_at", label: "Service due (soonest)" },
                { value: "-service_due_at", label: "Service due (latest)" },
                { value: "created_at", label: "Created (oldest)" },
                { value: "-created_at", label: "Created (newest)" },
            ] as const,
        []
    );

    const { data, isLoading, error } = useAsyncData<InstitutionsListResponse>(
        () =>
            getInstitutions({
                page: 1,
                perPage: 25,
                sort: sortValue,
                filterName: searchValue.trim().length > 0 ? searchValue.trim() : undefined,
                filterTypeId:
                    filterValue === "all" ? undefined : Number(filterValue),
            }),
        [filterValue, searchValue, sortValue]
    );

    const institutions = data?.data ?? [];

    const columns = useMemo(
        () =>
            [
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
            ] as const,
        []
    );

    return (
        <Layout>

            {error ? (
                <div className="mb-4 text-red-600">
                    {getAppErrorMessage(error)}
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