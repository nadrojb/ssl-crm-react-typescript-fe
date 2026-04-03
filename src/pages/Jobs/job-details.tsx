import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getJob, type JobDetails as JobDetailsData } from "../../api/jobs";
import { getErrorMessage } from "../../utils/errors";
import { ButtonStandard } from "../../components/ButtonStandard";
import { Card } from "../../components/Card";
import { DataTable } from "../../components/DataTable";
import { Layout } from "../../components/Layout";
import { ConfirmModal } from "../../components/ConfirmModal";

type TaskRow = {
  name: string;
  status: string;
};

type DocumentRow = {
  name: string;
  fileType: string;
};

const tasksColumns = [
  {
    id: "name",
    header: "Task",
    cell: (row: TaskRow) => row.name,
    cellClassName:
      "whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900",
  },
  {
    id: "status",
    header: "Status",
    cell: (row: TaskRow) => row.status,
    cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
  },
] as const;

const documentsColumns = [
  {
    id: "name",
    header: "Document",
    cell: (row: DocumentRow) => row.name,
    cellClassName:
      "whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900",
  },
  {
    id: "fileType",
    header: "File type",
    cell: (row: DocumentRow) => row.fileType,
    cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
  },
] as const;

export function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const jobId = id != null ? Number(id) : NaN;

  const [job, setJob] = useState<JobDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getJob(jobId);
        setJob(res);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [jobId]);

  return (
    <Layout title={job?.name ?? "JobDetails"}>
      <div className="space-y-6">
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          title="Confirm Archive"
          message="Are you sure you want to archive this job?"
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => {
            setIsConfirmModalOpen(false);
          }}
        />
        <div className="flex items-start justify-end gap-3">
          <ButtonStandard type="button" variant="success" size="sm">
            Complete
          </ButtonStandard>
          <ButtonStandard
            type="button"
            variant="dark"
            size="sm"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            Archive
          </ButtonStandard>
          <ButtonStandard type="button" variant="secondary" size="sm">
            Edit
          </ButtonStandard>
        </div>

        {error ? (
          <div className="text-red-600">{error}</div>
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

export default JobDetails;
