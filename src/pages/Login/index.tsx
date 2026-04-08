import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { FormError } from "../../components/FormError";
import { TextInput } from "../../components/TextInput";
import { ButtonStandard } from "../../components/ButtonStandard";
import { loginUser } from "../../api/auth";
import { isAppError } from "../../api/errorHandler";
import { mapValidationErrors } from "../../utils/errors";

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const candidate = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const result = LoginSchema.safeParse(candidate);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0];
          if (typeof field === "string") {
            fieldErrors[field] = issue.message;
          }
        }
        setErrors(fieldErrors);
        return;
      }

      const { token } = await loginUser(result.data);
      await login(token);
      navigate("/");
    } catch (err) {
      if (isAppError(err) && err.type === "validation") {
        setErrors(mapValidationErrors(err.errors));
      } else if (isAppError(err) && err.type !== "validation") {
        setErrors({
          submit: err.message ?? "Unable to sign in. Please try again.",
        });
      } else {
        setErrors({ submit: "Unable to sign in. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <h1 className="text-2xl font-semibold text-gray-900">
              Log in
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormError error={errors.submit} />

            <TextInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                errorId="email-error"
                placeholder="Email"
                aria-label="Email"
            />

            <TextInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                errorId="password-error"
                placeholder="••••••••"
                aria-label="Password"
            />

            <ButtonStandard type="submit" isLoading={isSubmitting} fullWidth>
              Log in
            </ButtonStandard>
          </form>
        </div>
      </div>
  );
}