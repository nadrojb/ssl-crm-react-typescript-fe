import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJobs, type Job } from "../../api/jobs";
import { getErrorMessage } from "../../utils/errors";
import { Layout } from "../../components/Layout";
import { DataTable } from "../../components/DataTable";
import { DataTableToolbar } from "../../components/DataTableToolbar";
import { ButtonStandard } from "../../components/ButtonStandard";

const filterOptions = [
    { value: "all", label: "All" },
] as const;

const sortOptions = [
    { value: "-created_at", label: "Created (newest)" },
    { value: "created_at", label: "Created (oldest)" },
    { value: "name", label: "Name (A–Z)" },
    { value: "-name", label: "Name (Z–A)" },
] as const;

const columns = [
    {
        id: "name",
        header: "JobDetails",
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
] as const;

export function Jobs() {
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState("");
    const [filterValue, setFilterValue] = useState("all");
    const [sortValue, setSortValue] = useState("-created_at");

    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await getJobs({
                    page: 1,
                    perPage: 25,
                    sort: sortValue,
                    filterName: searchValue.trim().length > 0 ? searchValue.trim() : undefined,
                });
                setJobs(res.data);
            } catch (err: unknown) {
                setError(getErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, [searchValue, sortValue]);

    return (
        <Layout>
            <div className="mb-4 flex items-start justify-end">
                <ButtonStandard
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/jobs/new")}
                >
                    Create Job
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