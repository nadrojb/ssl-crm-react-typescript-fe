import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createContact, getContacts } from "../../api/contacts";
import { createInstitution } from "../../api/institutions";
import { getInstitutionTypes } from "../../api/institution-types";
import { getAppErrorMessage, isAppError, toAppError } from "../../api/errorHandler";
import type { Contact } from "../../api/schemas/contact";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/Card";
import { InstitutionForm } from "../../components/InstitutionForm";
import { useAsyncData } from "../../hooks/use-async-data";

type CreateInstitutionPageError = {
  message: string;
};

export const InstitutionCreate = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<CreateInstitutionPageError | null>(null);

  const { data: institutionTypesResponse } = useAsyncData(
    async () => getInstitutionTypes({ page: 1, perPage: 250, sort: "name" }),
    []
  );

  const { data: contactsResponse } = useAsyncData(
    async () => getContacts({ page: 1, perPage: 250, sort: "last_name" }),
    []
  );

  const institutionTypes = useMemo(() => {
    return institutionTypesResponse?.data ?? [];
  }, [institutionTypesResponse]);

  const contacts = useMemo((): readonly Contact[] => {
    return contactsResponse?.data ?? [];
  }, [contactsResponse]);

  return (
    <Layout title="Create institution">
      <div className="space-y-6">
        <Card title="New institution">
          <InstitutionForm
            institutionTypes={institutionTypes}
            contacts={contacts}
            submitLabel="Create"
            isSubmitting={isSubmitting}
            errorMessage={error?.message}
            onSubmit={async ({ institution, newContact }) => {
              setIsSubmitting(true);
              setError(null);

              try {
                const primaryContactId = newContact
                  ? (await createContact(newContact)).id
                  : institution.primary_contact_id;

                const created = await createInstitution({
                  ...institution,
                  primary_contact_id: primaryContactId,
                });

                navigate(`/institutions/${created.id}`);
              } catch (e: unknown) {
                const appError = isAppError(e) ? e : toAppError(e);
                setError({
                  message: getAppErrorMessage(appError),
                });
                throw appError;
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default InstitutionCreate;
