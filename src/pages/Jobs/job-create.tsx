import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJobTypes } from "../../api/job-types";
import { getErrorMessage } from "../../utils/errors";
import { Layout } from "../../components/Layout";

export function JobCreate() {
    const navigate = useNavigate();

    const [jobTypes, setJobTypes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getJobTypes();
                setJobTypes(res.data ?? []);
            } catch (err: unknown) {
                setError(getErrorMessage(err));
            }
        };
        loadData();
    }, []);

    return (
        <Layout title="Create job">
        </Layout>
    );
}

export default JobCreate;