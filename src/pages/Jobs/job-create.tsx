import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createJob } from "../../api/jobs";
import { getJobTypes, type JobType } from "../../api/job-types";
import { getInstitutions, type Institution } from "../../api/institutions";

import { getErrorMessage } from "../../utils/errors";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/Card";
import { JobForm, type JobFormSubmitPayload } from "../../Jobform";

export const JobCreate = () => {
    const navigate = useNavigate();

    const [jobTypes, setJobTypes] = useState<JobType[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const jobTypesRes = await getJobTypes({ page: 1, perPage: 250 });
                const institutionsRes = await getInstitutions({ page: 1, perPage: 250 });

                setJobTypes(jobTypesRes.data);
                setInstitutions(institutionsRes.data);
            } catch (err: unknown) {
                setError(getErrorMessage(err));
            }
        };

        loadData();
    }, []);

    const handleSubmit = async ({ job }: JobFormSubmitPayload) => {
        setIsSubmitting(true);
        setError(undefined);
        setFieldErrors({});

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

    const handleFieldErrorsClear = (name: string) => {
        setFieldErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    return (
        <Layout title="Create job">
            <Card title="New Job">
                <JobForm
                    jobTypes={jobTypes}
                    institutions={institutions}
                    submitLabel="Create"
                    isSubmitting={isSubmitting}
                    errorMessage={error}
                    fieldErrors={fieldErrors}
                    onFieldErrorsClear={handleFieldErrorsClear}
                    onSubmit={handleSubmit}
                />
            </Card>
        </Layout>
    );
};

export default JobCreate;