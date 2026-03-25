import { useEffect, useMemo, useState } from "react";
import { Layout } from "../../components/Layout";
import { DataTable } from "../../components/DataTable";
import { getJobs, type Job } from "../../api/jobs";
import {
    getAppErrorMessage,
    isAppError,
    toAppError,
    type AppError,
} from "../../api/errorHandler";

export function Jobs() {
    const [jobs, setJobs] = useState<readonly Job[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AppError | null>(null);
    console.log(jobs)
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

    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await getJobs({ page: 1 });
                if (isMounted) {
                    setJobs(result.data);
                }
            } catch (e: unknown) {
                if (isMounted) {
                    setError(isAppError(e) ? e : toAppError(e));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void run();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
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
                    title="Jobs"
                    data={jobs}
                    columns={columns}
                    getRowKey={(job) => job.id}
                />
            )}
        </Layout>
    );
}

export default Jobs;