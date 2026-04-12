import React, { useRef, useState } from "react";
 

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
  initialValues?: Partial<CreateInstitutionRequest>;
  institutionTypes: readonly InstitutionType[];
  contacts: readonly Contact[];
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  fieldErrors: Record<string, string | undefined>;
  onFieldErrorsClear: (name: string) => void;
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

const compareContactsByName = (a: Contact, b: Contact): number => {
  const aKey = `${a.last_name} ${a.first_name}`.toLowerCase();
  const bKey = `${b.last_name} ${b.first_name}`.toLowerCase();
  return aKey.localeCompare(bKey);
};

const toContactOption = (contact: Contact) => {
  return {
    value: String(contact.id),
    label: getContactLabel(contact),
  };
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
  const formRef = useRef<HTMLFormElement | null>(null);
  const [values, setValues] = useState<InstitutionFormValues>({
    name: initialValues?.name ?? "",
    institution_type_id: initialValues?.institution_type_id != null ? String(initialValues.institution_type_id) : "",
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


  const contactOptions = [...contacts].sort(compareContactsByName).map(toContactOption);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      onFieldErrorsClear(name);
    }
  };

  const setPrimaryContactMode = (mode: PrimaryContactMode) => {
    setValues((prev) => ({ ...prev, primaryContactMode: mode }));
    onFieldErrorsClear("contact_id");
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
        institution_type_id: toNullableNumber(values.institution_type_id),
        service_due_at: toNullableDateString(values.service_due_at),
        service_booked_at: toNullableDateString(values.service_booked_at),
        remedials_booked_at: toNullableDateString(values.remedials_booked_at),
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = buildSubmitPayload();
    await onSubmit(payload);
  };

  return (
    <form ref={formRef} className="space-y-6" onSubmit={handleSubmit} noValidate>
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
        {fieldErrors.institution_type_id ? (
          <p className="text-sm text-red-600">{fieldErrors.institution_type_id}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium" style={{ color: "#1a2133" }}>
          Primary contact
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className={`rounded-md px-3 py-2 text-sm ring-1 ring-inset cursor-pointer ${
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
            className={`rounded-md px-3 py-2 text-sm ring-1 ring-inset cursor-pointer ${
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
              className="block w-full rounded-sm border-0 bg-white py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-blue-500 sm:text-sm cursor-pointer"
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
        <ButtonStandard
          type="button"
          isLoading={isSubmitting}
          onClick={() => formRef.current?.requestSubmit()}
        >
          {submitLabel}
        </ButtonStandard>
      </div>
    </form>
  );
};

export default InstitutionForm;
