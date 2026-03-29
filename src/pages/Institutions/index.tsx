import { useMemo } from "react";

import { getInstitutions, type InstitutionsListResponse } from "../../api/institutions";
import { type Institution } from "../../api/schemas/institution";
import { getAppErrorMessage } from "../../api/errorHandler";
import { DataTable } from "../../components/DataTable";
import { InstitutionTypeChip } from "../../components/InstitutionTypeChip";
import { Layout } from "../../components/Layout";
import { useAsyncData } from "../../hooks/use-async-data";

export function Institutions() {
    const { data, isLoading, error } = useAsyncData<InstitutionsListResponse>(
        () => getInstitutions({ page: 1 }),
        []
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
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Institutions
                </h1>
            </div>

            {error ? (
                <div className="mb-4 text-red-600">
                    {getAppErrorMessage(error)}
                </div>
            ) : null}

            {isLoading ? (
                <div>Loading…</div>
            ) : (
                <DataTable
                    title="Institutions"
                    data={institutions}
                    columns={columns}
                    getRowKey={(institution) => institution.id}
                />
            )}
        </Layout>
    );
}

export default Institutions;