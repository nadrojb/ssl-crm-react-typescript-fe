import { Layout } from "../../components/Layout";
import { useAsyncData } from "../../hooks/use-async-data";
import { getInstitutions } from "../../api/institutions";
import {
    getAppErrorMessage,
} from "../../api/errorHandler";

export function Institutions() {
    const { isLoading, error } = useAsyncData<unknown>(
        () => getInstitutions({ page: 1 }),
        []
    );

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Institutions
                </h1>
            </div>

            {error ? (
                <div className="mb-4 text-red-600">
                    {getAppErrorMessage(error)}
                </div>
            ) : null}

            {isLoading ? (
                <div>Loading…</div>
            ) : (
                <div>Institutions loaded.</div>
            )}
        </Layout>
    );
}

export default Institutions;