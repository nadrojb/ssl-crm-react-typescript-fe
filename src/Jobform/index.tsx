import type { JobType } from "../api/job-types.ts";
import type {CreateJobRequest} from "../api/schemas/job-requests.ts";
import type {Institution} from "../api/institutions.ts";

type JobFormFields =
    | "name"
    | "institution_id"
    | "job_type_id"
    | "submit";

type JobFormValues = {
    name: string;
    institution_id: number;
    job_type_id: number;
};

type JobFormSubmitPayload = {
    job: CreateJobRequest;
};

type jobFormProps = {
    initialValues?: Partial<CreateJobRequest>
    jobTypes?: readonly JobType[]
    institutions?: readonly Institution[]
    submitLabel: string;
    isSubmitting: boolean;
    errorMessage?: string;
    onSubmit: (payload: JobFormSubmitPayload) => Promise<void>;
}

export function JobForm({
                            initialValues,
                            jobTypes,
                            institutions,
                            submitLabel,
                            isSubmitting,
                            errorMessage,
                            onSubmit,
                        }: jobFormProps) {
    // ...
}