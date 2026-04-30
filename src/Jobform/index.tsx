import type { JobType } from "../api/job-types.ts";
import type {CreateJobRequest} from "../api/schemas/job-requests.ts";
import type {Institution} from "../api/institutions.ts";
import React, {useState} from "react";
import {FormError} from "../components/FormError";
import {TextInput} from "../components/TextInput";
import {ButtonStandard} from "../components/ButtonStandard";

type JobFormValues = {
    name: string;
    institution_id: string;
    job_type_id: string;
};

export type JobFormSubmitPayload = {
    job: CreateJobRequest;
};

type JobFormProps = {
    initialValues?: Partial<CreateJobRequest>
    jobTypes?: readonly JobType[]
    institutions?: readonly Institution[]
    submitLabel: string;
    isSubmitting: boolean;
    errorMessage?: string;
    fieldErrors: Record<string, string | undefined>;
    onFieldErrorsClear: (name: string) => void;
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
                            fieldErrors,
                            onFieldErrorsClear,
                        }: JobFormProps) {
    const [values, setValues] = useState<JobFormValues>(() => {
      let name = "";
      if (initialValues?.name) {
          name = initialValues.name
      }

      let institution_id = "";
      if (initialValues?.institution_id) {
          institution_id = String(initialValues.institution_id)
      }

      let job_type_id = "";
      if (initialValues?.job_type_id) {
          job_type_id = String(initialValues.job_type_id)
      }

      return {
          name,
          institution_id,
          job_type_id
      }
    })

    const buildSubmitPayload = (): JobFormSubmitPayload => {
        return {
            job: {
                name: values.name.trim(),
                institution_id: Number(values.institution_id),
                job_type_id: Number(values.job_type_id),
            },
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (fieldErrors[name]) {
            onFieldErrorsClear(name);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(buildSubmitPayload());
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <FormError error={errorMessage || fieldErrors.submit} />
            <TextInput
                label="Job name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={fieldErrors.name}
                errorId="job-name-error"
                placeholder="Job name"
            />

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                    Type
                </label>

                <select
                    name="job_type_id"
                    value={values.job_type_id}
                    onChange={handleChange}
                    className="block w-full rounded-sm border-0 bg-white py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-blue-500 sm:text-sm cursor-pointer"
                >
                    <option value="">No type</option>
                    {jobTypes?.map((type) => (
                        <option key={type.id} value={String(type.id)}>
                            {type.name}
                        </option>
                    ))}
                </select>

                {fieldErrors.job_type_id && (
                    <p className="text-sm text-red-600">
                        {fieldErrors.job_type_id}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                    Type
                </label>

                <select
                    name="institution_id"
                    value={values.institution_id}
                    onChange={handleChange}
                    className="block w-full rounded-sm border-0 bg-white py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-blue-500 sm:text-sm cursor-pointer"
                >
                    <option value="">No type</option>
                    {institutions?.map((type) => (
                        <option key={type.id} value={String(type.id)}>
                            {type.name}
                        </option>
                    ))}
                </select>

                {fieldErrors.job_type_id && (
                    <p className="text-sm text-red-600">
                        {fieldErrors.job_type_id}
                    </p>
                )}
            </div>
            <div className="flex justify-end">
                <ButtonStandard type="submit" isLoading={isSubmitting}>
                    {submitLabel}
                </ButtonStandard>
            </div>
        </form>
    )
}