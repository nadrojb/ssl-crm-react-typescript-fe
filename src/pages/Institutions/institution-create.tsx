import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getContacts } from "../../api/contacts";
import { createInstitution } from "../../api/institutions";
import { getInstitutionTypes, type InstitutionType } from "../../api/institution-types";
import type { Contact } from "../../api/schemas/contact";

import { getErrorMessage } from "../../utils/errors";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/Card";
import { InstitutionForm, type InstitutionFormSubmitPayload } from "../../components/InstitutionForm";

export const InstitutionCreate = () => {
  const navigate = useNavigate();

  const [institutionTypes, setInstitutionTypes] = useState<InstitutionType[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadData = async () => {
      try {
        const institutionTypesRes = await getInstitutionTypes({ page: 1, perPage: 250 });
        const contactsRes = await getContacts({ page: 1, perPage: 250 });

        setInstitutionTypes(institutionTypesRes.data);
        setContacts(contactsRes.data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      }
    };

    loadData();
  }, []);

  const handleSubmit = async ({ institution }: InstitutionFormSubmitPayload) => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      const createdInstitution = await createInstitution(institution);
      navigate(`/institutions/${createdInstitution.id}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      throw err;
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
              onSubmit={handleSubmit}
          />
        </Card>
      </Layout>
  );
};

export default InstitutionCreate;