import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getContacts } from "../../api/contacts";
import { createJob } from "../../api/jobs";
import { getJobTypes, type JobType } from "../../api/job-types";
import type { Contact } from "../../api/schemas/contact";

import { getErrorMessage } from "../../utils/errors";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/Card";
import { JobForm, type JobFormSubmitPayload } from "../../components/JobForm";

export const JobCreate = () => {
    const navigate = useNavigate();

    const [jobTypes, setJobTypes] = useState<JobType[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            try {
                const jobTypesRes = await getJobTypes({ page: 1, perPage: 250 });
                const contactsRes = await getContacts({ page: 1, perPage: 250 });

                setJobTypes(jobTypesRes.data);
                setContacts(contactsRes.data);
            } catch (err: unknown) {
                setError(getErrorMessage(err));
            }
        };

        loadData();
    }, []);

    const handleSubmit = async ({ job }: jobFormSubmitPayload) => {
        setIsSubmitting(true);
        setError(undefined);

        try {
            const createdJob = await createJob(job);
            navigate(`/institutions/${createdJob.id}`);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout title="Create job">
            <Card title="New Job">
                <JobForm
                    jobTypes={jobTypes}
                    contacts={contacts}
                    submitLabel="Create"
                    isSubmitting={isSubmitting}
                    errorMessage={error}
                    onSubmit={handleSubmit}
                />
            </Card>
        </Layout>
    );
};

export default JobCreate;