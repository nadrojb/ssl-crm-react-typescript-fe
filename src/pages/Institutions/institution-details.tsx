import { useParams } from "react-router-dom";

import { Layout } from "../../components/Layout";

export function InstitutionDetails() {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout title="Institution">
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
        <div className="text-sm text-gray-600">Institution ID</div>
        <div className="mt-1 text-lg font-semibold text-gray-900">{id}</div>
      </div>
    </Layout>
  );
}

export default InstitutionDetails;
