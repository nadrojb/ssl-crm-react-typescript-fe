import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getContacts } from "../../api/contacts";
import { getInstitutionTypes, type InstitutionType } from "../../api/institution-types";
import { getInstitution, updateInstitution } from "../../api/institutions";
import { getJobs, type Job } from "../../api/jobs";
import type { Institution } from "../../api/schemas/institution";
import type { Contact } from "../../api/schemas/contact";
import { getErrorMessage } from "../../utils/errors";
import { Card } from "../../components/Card";
import { Drawer } from "../../components/Drawer";
import { DataTable } from "../../components/DataTable";
import { InstitutionForm, type InstitutionFormSubmitPayload } from "../../components/InstitutionForm";
import { Layout } from "../../components/Layout";
import { ButtonStandard } from "../../components/ButtonStandard";

type TaskRow = {
  name: string;
  status: string;
};

type DocumentRow = {
  name: string;
  fileType: string;
};

const jobsColumns = [
  {
    id: "name",
    header: "JobDetails",
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
] as const;

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

export function InstitutionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const institutionId = id != null ? Number(id) : NaN;

  const [institution, setInstitution] = useState<Institution | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [institutionTypes, setInstitutionTypes] = useState<InstitutionType[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👉 load page data (institution + jobs)
  useEffect(() => {
    const loadPageData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [institutionRes, jobsRes] = await Promise.all([
          getInstitution(institutionId),
          getJobs({
            page: 1,
            perPage: 25,
            sort: "-created_at",
            filterInstitutionId: institutionId,
          }),
        ]);
        setInstitution(institutionRes);
        setJobs(jobsRes.data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    loadPageData();
  }, [institutionId]);

  // 👉 load dropdown data for edit form
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [typesRes, contactsRes] = await Promise.all([
          getInstitutionTypes({ page: 1, perPage: 250, sort: "name" }),
          getContacts({ page: 1, perPage: 250, sort: "last_name" }),
        ]);
        setInstitutionTypes(typesRes.data);
        setContacts(contactsRes.data);
      } catch {
        // silently fail — dropdowns will just be empty
      }
    };
    loadFormData();
  }, []);

  const handleEditSubmit = async ({ institution: payload }: InstitutionFormSubmitPayload) => {
    setIsSubmitting(true);
    try {
      const updatedInstitution = await updateInstitution(institutionId, payload);
      setInstitution(updatedInstitution);
      setIsEditDrawerOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title={institution?.name ?? "Institution"}>
      <div className="space-y-6">
        <Drawer
          isOpen={isEditDrawerOpen}
          title="Edit institution"
          onClose={() => {
            if (isSubmitting) return;
            setIsEditDrawerOpen(false);
          }}
        >
          {institution ? (
            <InstitutionForm
              initialValues={{
                name: institution.name,
                contact: institution.primary_contact
                  ? { id: institution.primary_contact.id }
                  : null,
                type_id: institution.type?.id ?? null,
                service_due_at: institution.service_due_at,
                service_booked_at: institution.service_booked_at,
                remedials_booked_at: institution.remedials_booked_at,
              }}
              institutionTypes={institutionTypes}
              contacts={contacts}
              submitLabel="Save"
              isSubmitting={isSubmitting}
              onSubmit={handleEditSubmit}
            />
          ) : null}
        </Drawer>

        {error ? (
          <div className="text-red-600">{error}</div>
        ) : null}

        {isLoading ? (
          <div>Loading…</div>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-end">
              <ButtonStandard
                  type="button"
                  size="sm"
                  onClick={() => setIsEditDrawerOpen(true)}
              >
                Edit
              </ButtonStandard>
            </div>
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

            <DataTable
              title="Associated jobs"
              data={jobs}
              columns={jobsColumns}
              getRowKey={(job) => job.id}
              onRowClick={(job) => navigate(`/jobs/${job.id}`)}
            />

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
