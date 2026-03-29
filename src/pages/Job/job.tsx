import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { getAppErrorMessage } from "../../api/errorHandler";
import { getJob, type JobDetails } from "../../api/jobs";
import { Card } from "../../components/Card";
import { DataTable } from "../../components/DataTable";
import { Layout } from "../../components/Layout";
import { useAsyncData } from "../../hooks/use-async-data";

export function Job() {
  const { id } = useParams<{ id: string }>();

  const jobId = id != null ? Number(id) : NaN;

  const { data: job, isLoading, error } = useAsyncData<JobDetails>(
    async () => getJob(jobId),
    [jobId]
  );

  const tasksColumns = useMemo(
    () =>
      [
        {
          id: "name",
          header: "Task",
          cell: (row: { name: string }) => row.name,
          cellClassName:
            "whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900",
        },
        {
          id: "status",
          header: "Status",
          cell: (row: { status: string }) => row.status,
          cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
        },
      ] as const,
    []
  );

  const documentsColumns = useMemo(
    () =>
      [
        {
          id: "name",
          header: "Document",
          cell: (row: { name: string }) => row.name,
          cellClassName:
            "whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900",
        },
        {
          id: "fileType",
          header: "File type",
          cell: (row: { fileType: string }) => row.fileType,
          cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
        },
      ] as const,
    []
  );

  return (
    <Layout title={job?.name ?? "Job"}>
      <div className="space-y-6">
        <div className="flex items-start justify-end gap-3">
          <button
            type="button"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Complete
          </button>
          <button
            type="button"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Archive
          </button>
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Edit
          </button>
        </div>

        {error ? (
          <div className="text-red-600">{getAppErrorMessage(error)}</div>
        ) : null}

        {isLoading ? (
          <div>Loading…</div>
        ) : (
          <>
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <Card title="Overview">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Institution
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {job?.institution?.name ?? "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Job type
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {job?.crm_job_type?.name ?? "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Status
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {job?.completed_at != null ? "Complete" : "Due"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Assigned to
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {job?.users != null && job.users.length > 0
                          ? job.users.map((u) => u.name).join(", ")
                          : "—"}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="w-full lg:w-1/2">
                <Card title="Primary contact">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Name</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">—</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Email</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">—</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Phone</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">—</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <DataTable
              title="Tasks"
              data={[]}
              columns={tasksColumns}
              getRowKey={(row) => row.name}
            />

            <DataTable
              title="Documents"
              data={[]}
              columns={documentsColumns}
              getRowKey={(row) => row.name}
            />
          </>
        )}
      </div>
    </Layout>
  );
}

export default Job;
