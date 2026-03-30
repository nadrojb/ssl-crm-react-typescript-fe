import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { DataTable } from "../../components/DataTable";
import { DataTableToolbar } from "../../components/DataTableToolbar";
import { getJobs, type Job } from "../../api/jobs";
import { getAppErrorMessage } from "../../api/errorHandler";
import { useAsyncData } from "../../hooks/use-async-data";

export function Jobs() {
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState<string>("");
    const [filterValue, setFilterValue] = useState<string>("all");
    const [sortValue, setSortValue] = useState<string>("-created_at");

    const filterOptions = useMemo(
        () =>
            [
                { value: "all", label: "All" },
            ] as const,
        []
    );

    const sortOptions = useMemo(
        () =>
            [
                { value: "-created_at", label: "Created (newest)" },
                { value: "created_at", label: "Created (oldest)" },
                { value: "name", label: "Name (A–Z)" },
                { value: "-name", label: "Name (Z–A)" },
            ] as const,
        []
    );

    const { data, isLoading, error } = useAsyncData(
        async () =>
            getJobs({
                page: 1,
                perPage: 25,
                sort: sortValue,
                filterName: searchValue.trim().length > 0 ? searchValue.trim() : undefined,
            }),
        [searchValue, sortValue]
    );

    const jobs = data?.data ?? [];
    const columns = useMemo(
        () =>
            [
                {
                    id: "name",
                    header: "Job",
                    cell: (job: Job) => job.name,
                    cellClassName:
                        "whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900",
                },
                {
                    id: "institution",
                    header: "Institution",
                    cell: (job: Job) => job.institution.name,
                    cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
                },
                {
                    id: "createdAt",
                    header: "Created",
                    cell: (job: Job) => job.created_at,
                    cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
                },
                {
                    id: "completedAt",
                    header: "Completed",
                    cell: (job: Job) => job.completed_at ?? "—",
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
                        title="Jobs"
                        data={jobs}
                        columns={columns}
                        getRowKey={(job) => job.id}
                        onRowClick={(job) => navigate(`/jobs/${job.id}`)}
                    />
                </>
            )}
        </Layout>
    );
}

export default Jobs;