import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAppErrorMessage } from "../../api/errorHandler";
import { getInstitution } from "../../api/institutions";
import { getJobs, type Job } from "../../api/jobs";
import { Card } from "../../components/Card";
import { DataTable } from "../../components/DataTable";
import { Layout } from "../../components/Layout";
import { useAsyncData } from "../../hooks/use-async-data";

export function InstitutionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const institutionId = id != null ? Number(id) : NaN;

  const {
    data: institution,
    isLoading: isInstitutionLoading,
    error: institutionError,
  } = useAsyncData(
    async () => getInstitution(institutionId),
    [institutionId]
  );

  const {
    data: jobsResponse,
    isLoading: isJobsLoading,
    error: jobsError,
  } = useAsyncData(
    async () =>
      getJobs({
        page: 1,
        perPage: 25,
        sort: "-created_at",
        filterInstitutionId: institutionId,
      }),
    [institutionId]
  );

  const jobs = jobsResponse?.data ?? [];

  type TaskRow = {
    name: string;
    status: string;
  };

  type DocumentRow = {
    name: string;
    fileType: string;
  };

  const jobsColumns = useMemo(
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

  const tasksColumns = useMemo(
    () =>
      [
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
      ] as const,
    []
  );

  const documentsColumns = useMemo(
    () =>
      [
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
      ] as const,
    []
  );

  return (
    <Layout title={institution?.name ?? "Institution"}>
      <div className="space-y-6">
        {institutionError ? (
          <div className="text-red-600">{getAppErrorMessage(institutionError)}</div>
        ) : null}
        {jobsError ? (
          <div className="text-red-600">{getAppErrorMessage(jobsError)}</div>
        ) : null}

        {isInstitutionLoading ? (
          <div>Loading…</div>
        ) : (
          <>
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <Card title="Overview">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Type
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {institution?.type?.name ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Service due
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {institution?.service_due_at ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Service date
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {institution?.service_booked_at ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Remedials date
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {institution?.remedials_booked_at ?? "—"}
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
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {institution?.primary_contact
                          ? `${institution.primary_contact.first_name} ${institution.primary_contact.last_name}`
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Email</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {institution?.primary_contact?.email ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Phone</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {institution?.primary_contact?.phone_number ?? "—"}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {isJobsLoading ? (
              <div>Loading jobs…</div>
            ) : (
              <DataTable
                title="Associated jobs"
                data={jobs}
                columns={jobsColumns}
                getRowKey={(job) => job.id}
                onRowClick={(job) => navigate(`/jobs/${job.id}`)}
              />
            )}

            <DataTable<TaskRow>
              title="Tasks"
              data={[]}
              columns={tasksColumns}
              getRowKey={(row) => row.name}
            />

            <DataTable<DocumentRow>
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

export default InstitutionDetails;
