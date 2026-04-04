import React, { useState } from "react";
import { ZodError } from "zod";

import { ButtonStandard } from "../ButtonStandard";
import { FormError } from "../FormError";
import { TextInput } from "../TextInput";
import { mapValidationErrors, type FieldErrors } from "../../utils/errors";
import { isAppError, toAppError } from "../../api/errorHandler";
import {
  CreateInstitutionRequestSchema,
  NewContactPayloadSchema,
  type CreateInstitutionRequest,
} from "../../api/schemas/institution-requests";
import type { Contact } from "../../api/schemas/contact";
import type { InstitutionType } from "../../api/institution-types";

type PrimaryContactMode = "existing" | "new";

type InstitutionFormFields =
  | "name"
  | "type_id"
  | "contact_id"
  | "service_due_at"
  | "service_booked_at"
  | "remedials_booked_at"
  | "first_name"
  | "last_name"
  | "email"
  | "phone_number"
  | "submit";

type InstitutionFormValues = {
  name: string;
  type_id: string;
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
  initialValues?: Partial<CreateInstitutionRequest>;
  institutionTypes: readonly InstitutionType[];
  contacts: readonly Contact[];
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (payload: InstitutionFormSubmitPayload) => Promise<void>;
};

const toNullableNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  const asNumber = Number(trimmed);
  return Number.isFinite(asNumber) ? asNumber : null;
};

const toNullableDateString = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getContactLabel = (contact: Contact): string => {
  const name = `${contact.first_name} ${contact.last_name}`.trim();
  return contact.email ? `${name} (${contact.email})` : name;
};

export const InstitutionForm = ({
  initialValues,
  institutionTypes,
  contacts,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: InstitutionFormProps) => {
  const [values, setValues] = useState<InstitutionFormValues>({
    name: initialValues?.name ?? "",
    type_id: initialValues?.type_id != null ? String(initialValues.type_id) : "",
    service_due_at: initialValues?.service_due_at ?? "",
    service_booked_at: initialValues?.service_booked_at ?? "",
    remedials_booked_at: initialValues?.remedials_booked_at ?? "",
    primaryContactMode:
      initialValues?.contact != null && "id" in initialValues.contact
        ? "existing"
        : "existing",
    existingPrimaryContactId:
      initialValues?.contact != null && "id" in initialValues.contact
        ? String(initialValues.contact.id)
        : "",
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    contactPhoneNumber: "",
  });

  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<InstitutionFormFields>
  >({});

  const contactOptions = contacts
    .slice()
    .sort((a, b) => {
      const aKey = `${a.last_name} ${a.first_name}`.toLowerCase();
      const bKey = `${b.last_name} ${b.first_name}`.toLowerCase();
      return aKey.localeCompare(bKey);
    })
    .map((contact) => ({
      value: String(contact.id),
      label: getContactLabel(contact),
    }));

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as InstitutionFormFields]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const setPrimaryContactMode = (mode: PrimaryContactMode) => {
    setValues((prev) => ({ ...prev, primaryContactMode: mode }));
    setFieldErrors((prev) => ({ ...prev, contact_id: undefined }));
  };

  const validatePayload = (
    payload: InstitutionFormSubmitPayload
  ): FieldErrors<InstitutionFormFields> => {
    const nextErrors: FieldErrors<InstitutionFormFields> = {};

    try {
      CreateInstitutionRequestSchema.omit({ contact: true }).parse(payload.institution);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        for (const issue of e.issues) {
          const path = issue.path[0];
          if (path === "name") nextErrors.name = issue.message;
          if (path === "type_id") nextErrors.type_id = issue.message;
          if (path === "service_due_at") nextErrors.service_due_at = "Invalid date";
          if (path === "service_booked_at") nextErrors.service_booked_at = "Invalid date";
          if (path === "remedials_booked_at") nextErrors.remedials_booked_at = "Invalid date";
        }
      }
    }

    const { contact } = payload.institution;
    if (contact !== null && "first_name" in contact) {
      try {
        NewContactPayloadSchema.parse(contact);
      } catch (e: unknown) {
        if (e instanceof ZodError) {
          for (const issue of e.issues) {
            const path = issue.path[0];
            if (path === "first_name") nextErrors.first_name = issue.message;
            if (path === "last_name") nextErrors.last_name = issue.message;
            if (path === "email") nextErrors.email = issue.message;
            if (path === "phone_number") nextErrors.phone_number = issue.message;
          }
        }
      }
    }

    return nextErrors;
  };

  const buildSubmitPayload = (): InstitutionFormSubmitPayload => {
    const existingContactId = toNullableNumber(values.existingPrimaryContactId);

    const contact =
      values.primaryContactMode === "existing"
        ? existingContactId !== null
          ? { id: existingContactId }
          : null
        : {
            first_name: values.contactFirstName.trim(),
            last_name: values.contactLastName.trim(),
            email: values.contactEmail.trim().toLowerCase(),
            phone_number:
              values.contactPhoneNumber.trim().length > 0
                ? values.contactPhoneNumber.trim()
                : null,
          };

    return {
      institution: {
        name: values.name.trim(),
        contact,
        type_id: toNullableNumber(values.type_id),
        service_due_at: toNullableDateString(values.service_due_at),
        service_booked_at: toNullableDateString(values.service_booked_at),
        remedials_booked_at: toNullableDateString(values.remedials_booked_at),
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const payload = buildSubmitPayload();
    const nextErrors = validatePayload(payload);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      await onSubmit(payload);
    } catch (err: unknown) {
      const appError = isAppError(err) ? err : toAppError(err);
      if (appError.type === "validation") {
        setFieldErrors(
          mapValidationErrors<InstitutionFormFields>(appError.errors)
        );
        return;
      }

      setFieldErrors((prev) => ({
        ...prev,
        submit: appError.message ?? "Something went wrong. Please try again.",
      }));
    }
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
        <label className="block text-sm font-medium" style={{ color: "#1a2133" }}>
          Type
        </label>
        <select
          name="type_id"
          value={values.type_id}
          onChange={handleChange}
          className="block w-full rounded-sm border-0 bg-white py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">No type</option>
          {institutionTypes.map((type) => (
            <option key={type.id} value={String(type.id)}>
              {type.name}
            </option>
          ))}
        </select>
        {fieldErrors.type_id ? (
          <p className="text-sm text-red-600">{fieldErrors.type_id}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium" style={{ color: "#1a2133" }}>
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
            <label className="block text-sm font-medium" style={{ color: "#1a2133" }}>
              Existing contact
            </label>
            <select
              name="existingPrimaryContactId"
              value={values.existingPrimaryContactId}
              onChange={handleChange}
              className="block w-full rounded-sm border-0 bg-white py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">No primary contact</option>
              {contactOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.contact_id ? (
              <p className="text-sm text-red-600">{fieldErrors.contact_id}</p>
            ) : null}
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
                errorId="contact-first-name-error"
              />
              <TextInput
                label="Last name"
                name="contactLastName"
                value={values.contactLastName}
                onChange={handleChange}
                error={fieldErrors.last_name}
                errorId="contact-last-name-error"
              />
            </div>

            <TextInput
              label="Email"
              name="contactEmail"
              type="email"
              value={values.contactEmail}
              onChange={handleChange}
              error={fieldErrors.email}
              errorId="contact-email-error"
            />

            <TextInput
              label="Phone number"
              name="contactPhoneNumber"
              value={values.contactPhoneNumber}
              onChange={handleChange}
              error={fieldErrors.phone_number}
              errorId="contact-phone-number-error"
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
          errorId="service-due-error"
        />
        <TextInput
          label="Service booked"
          name="service_booked_at"
          type="date"
          value={values.service_booked_at}
          onChange={handleChange}
          error={fieldErrors.service_booked_at}
          errorId="service-booked-error"
        />
        <TextInput
          label="Remedials booked"
          name="remedials_booked_at"
          type="date"
          value={values.remedials_booked_at}
          onChange={handleChange}
          error={fieldErrors.remedials_booked_at}
          errorId="remedials-booked-error"
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
