import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getContacts } from "../../api/contacts";
import { createInstitution } from "../../api/institutions";
import { getInstitutionTypes, type InstitutionType } from "../../api/institution-types";
import type { Contact } from "../../api/schemas/contact";

import { getErrorMessage, mapValidationErrors } from "../../utils/errors";
import { isAppError } from "../../api/errorHandler";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/Card";
import { InstitutionForm, type InstitutionFormSubmitPayload } from "../../components/InstitutionForm";

export const InstitutionCreate = () => {
  const navigate = useNavigate();

  const [institutionTypes, setInstitutionTypes] = useState<InstitutionType[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const institutionTypesRes = await getInstitutionTypes({ page: 1, perPage: 250 });
        const contactsRes = await getContacts({ page: 1, perPage: 250 });

        setInstitutionTypes(institutionTypesRes.data);
        setContacts(contactsRes.data);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };

    loadData();
  }, []);

  const handleSubmit = async ({ institution }: InstitutionFormSubmitPayload) => {
    setIsSubmitting(true);
    setError(undefined);
    setFieldErrors({});

    try {
      const createdInstitution = await createInstitution(institution);
      navigate(`/institutions/${createdInstitution.id}`);
    } catch (err) {
      if (isAppError(err) && err.type === "validation") {
        setFieldErrors(mapValidationErrors(err.errors));
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Layout title="Create institution">
        <Card title="New institution">
          <InstitutionForm
              institutionTypes={institutionTypes}
              contacts={contacts}
              submitLabel="Create"
              isSubmitting={isSubmitting}
              errorMessage={error}
              fieldErrors={fieldErrors}
              onFieldErrorsClear={(name) => setFieldErrors((prev) => ({ ...prev, [name]: undefined }))}
              onSubmit={handleSubmit}
          />
        </Card>
      </Layout>
  );
};

export default InstitutionCreate;