import React, { useState } from "react";

import { ButtonStandard } from "../ButtonStandard";
import { FormError } from "../FormError";
import { TextInput } from "../TextInput";
import { type CreateInstitutionRequest } from "../../api/schemas/institution-requests";
import type { Contact } from "../../api/schemas/contact";
import type { InstitutionType } from "../../api/institution-types";

type PrimaryContactMode = "existing" | "new";

type InstitutionFormValues = {
    name: string;
    institution_type_id: string;
    service_due_at: string;
    service_booked_at: string;
    remedials_booked_at: string;
    primaryContactMode: PrimaryContactMode;
    existingPrimaryContactId: string;
    contactFirstName: string;
    contactLastName: string;
    contactEmail: string;
    contactPhoneNumber: string;
};

export type InstitutionFormSubmitPayload = {
    institution: CreateInstitutionRequest;
};

type InstitutionFormProps = {
    initialValues?: CreateInstitutionRequest;
    institutionTypes: readonly InstitutionType[];
    contacts: readonly Contact[];
    submitLabel: string;
    isSubmitting: boolean;
    errorMessage?: string;
    fieldErrors: Record<string, string | undefined>;
    onFieldErrorsClear: (name: string) => void;
    onSubmit: (payload: InstitutionFormSubmitPayload) => Promise<void>;
};

export const InstitutionForm = ({
                                    initialValues,
                                    institutionTypes,
                                    contacts,
                                    submitLabel,
                                    isSubmitting,
                                    errorMessage,
                                    fieldErrors,
                                    onFieldErrorsClear,
                                    onSubmit,
                                }: InstitutionFormProps) => {
    const [values, setValues] = useState<InstitutionFormValues>(() => {
        let name = "";
        if (initialValues?.name) {
            name = initialValues.name;
        }

        let institution_type_id = "";
        if (initialValues?.institution_type_id) {
            institution_type_id = String(initialValues.institution_type_id);
        }

        let service_due_at = "";
        if (initialValues?.service_due_at) {
            service_due_at = initialValues.service_due_at;
        }

        let service_booked_at = "";
        if (initialValues?.service_booked_at) {
            service_booked_at = initialValues.service_booked_at;
        }

        let remedials_booked_at = "";
        if (initialValues?.remedials_booked_at) {
            remedials_booked_at = initialValues.remedials_booked_at;
        }

        let existingPrimaryContactId = "";
        if (
            initialValues?.contact &&
            "id" in initialValues.contact
        ) {
            existingPrimaryContactId = String(initialValues.contact.id);
        }

        return {
            name,
            institution_type_id,
            service_due_at,
            service_booked_at,
            remedials_booked_at,
            primaryContactMode: "existing",
            existingPrimaryContactId,
            contactFirstName: "",
            contactLastName: "",
            contactEmail: "",
            contactPhoneNumber: "",
        };
    });

    const contactOptions = contacts.map((contact) => {
        const name = `${contact.first_name} ${contact.last_name}`.trim();

        let label = name;
        if (contact.email) {
            label = `${name} (${contact.email})`;
        }

        return {
            value: String(contact.id),
            label,
        };
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (fieldErrors[name]) {
            onFieldErrorsClear(name);
        }
    };

    const setPrimaryContactMode = (mode: PrimaryContactMode) => {
        setValues((prev) => ({
            ...prev,
            primaryContactMode: mode,
        }));

        onFieldErrorsClear("contact_id");
    };

    const buildSubmitPayload = (): InstitutionFormSubmitPayload => {
        let contact = null;

        if (values.primaryContactMode === "existing") {
            if (values.existingPrimaryContactId) {
                contact = { id: Number(values.existingPrimaryContactId) };
            }
        } else {
            let phone_number = null;
            if (values.contactPhoneNumber.trim()) {
                phone_number = values.contactPhoneNumber.trim();
            }

            contact = {
                first_name: values.contactFirstName.trim(),
                last_name: values.contactLastName.trim(),
                email: values.contactEmail.trim().toLowerCase(),
                phone_number,
            };
        }

        let institution_type_id = null;
        if (values.institution_type_id) {
            institution_type_id = Number(values.institution_type_id);
        }

        let service_due_at = null;
        if (values.service_due_at) {
            service_due_at = values.service_due_at;
        }

        let service_booked_at = null;
        if (values.service_booked_at) {
            service_booked_at = values.service_booked_at;
        }

        let remedials_booked_at = null;
        if (values.remedials_booked_at) {
            remedials_booked_at = values.remedials_booked_at;
        }

        return {
            institution: {
                name: values.name.trim(),
                contact,
                institution_type_id,
                service_due_at,
                service_booked_at,
                remedials_booked_at,
            },
        };
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(buildSubmitPayload());
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <FormError error={errorMessage || fieldErrors.submit} />

            <TextInput
                label="Institution name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={fieldErrors.name}
                errorId="institution-name-error"
                placeholder="Institution name"
            />

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                    Type
                </label>

                <select
                    name="institution_type_id"
                    value={values.institution_type_id}
                    onChange={handleChange}
                    className="block w-full rounded-sm border-0 bg-white py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-blue-500 sm:text-sm cursor-pointer"
                >
                    <option value="">No type</option>
                    {institutionTypes.map((type) => (
                        <option key={type.id} value={String(type.id)}>
                            {type.name}
                        </option>
                    ))}
                </select>

                {fieldErrors.institution_type_id && (
                    <p className="text-sm text-red-600">
                        {fieldErrors.institution_type_id}
                    </p>
                )}
            </div>

            <div className="space-y-3">
                <div className="text-sm font-medium text-gray-900">
                    Primary contact
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        className={`rounded-md px-3 py-2 text-sm ring-1 ring-inset ${
                            values.primaryContactMode === "existing"
                                ? "bg-blue-50 text-blue-700 ring-blue-200"
                                : "bg-white text-gray-700 ring-gray-200"
                        }`}
                        onClick={() => setPrimaryContactMode("existing")}
                        disabled={isSubmitting}
                    >
                        Choose existing
                    </button>

                    <button
                        type="button"
                        className={`rounded-md px-3 py-2 text-sm ring-1 ring-inset ${
                            values.primaryContactMode === "new"
                                ? "bg-blue-50 text-blue-700 ring-blue-200"
                                : "bg-white text-gray-700 ring-gray-200"
                        }`}
                        onClick={() => setPrimaryContactMode("new")}
                        disabled={isSubmitting}
                    >
                        Create new
                    </button>
                </div>

                {values.primaryContactMode === "existing" ? (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                            Existing contact
                        </label>

                        <select
                            name="existingPrimaryContactId"
                            value={values.existingPrimaryContactId}
                            onChange={handleChange}
                            className="block w-full rounded-sm border-0 bg-white py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-blue-500 sm:text-sm cursor-pointer"
                        >
                            <option value="">No primary contact</option>
                            {contactOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        {fieldErrors.contact_id && (
                            <p className="text-sm text-red-600">
                                {fieldErrors.contact_id}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <TextInput
                                label="First name"
                                name="contactFirstName"
                                value={values.contactFirstName}
                                onChange={handleChange}
                                error={fieldErrors.first_name}
                            />

                            <TextInput
                                label="Last name"
                                name="contactLastName"
                                value={values.contactLastName}
                                onChange={handleChange}
                                error={fieldErrors.last_name}
                            />
                        </div>

                        <TextInput
                            label="Email"
                            name="contactEmail"
                            type="email"
                            value={values.contactEmail}
                            onChange={handleChange}
                            error={fieldErrors.email}
                        />

                        <TextInput
                            label="Phone number"
                            name="contactPhoneNumber"
                            value={values.contactPhoneNumber}
                            onChange={handleChange}
                            error={fieldErrors.phone_number}
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <TextInput
                    label="Service due"
                    name="service_due_at"
                    type="date"
                    value={values.service_due_at}
                    onChange={handleChange}
                    error={fieldErrors.service_due_at}
                />

                <TextInput
                    label="Service booked"
                    name="service_booked_at"
                    type="date"
                    value={values.service_booked_at}
                    onChange={handleChange}
                    error={fieldErrors.service_booked_at}
                />

                <TextInput
                    label="Remedials booked"
                    name="remedials_booked_at"
                    type="date"
                    value={values.remedials_booked_at}
                    onChange={handleChange}
                    error={fieldErrors.remedials_booked_at}
                />
            </div>

            <div className="flex justify-end">
                <ButtonStandard type="submit" isLoading={isSubmitting}>
                    {submitLabel}
                </ButtonStandard>
            </div>
        </form>
    );
};

export default InstitutionForm;