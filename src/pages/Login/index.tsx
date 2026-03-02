import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z, ZodError } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { FormError } from "../../components/FormError";
import { TextInput } from "../../components/TextInput";
import { ButtonStandard } from "../../components/ButtonStandard";
import { loginUser } from "../../api/auth";
import { mapValidationErrors } from "../../utils/errors";
import type { AppError } from "../../api/errorHandler";

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFields = "email" | "password";

type FieldErrors = Partial<Record<LoginFields | "submit", string>>;

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (errors[name as keyof FieldErrors]) {
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

      // Client-side validation
      const validated = LoginSchema.parse(candidate);

      // API call (already wrapped with AppError)
      const { token, user } = await loginUser(validated);

      login(token, user);
      navigate("/");
    } catch (err) {
      // Zod (client-side validation errors)
      if (err instanceof ZodError) {
        const fieldErrors: FieldErrors = {};

        for (const issue of err.issues) {
          const field = issue.path[0];
          if (typeof field === "string") {
            fieldErrors[field as LoginFields] = issue.message;
          }
        }

        setErrors(fieldErrors);
        return;
      }

      // API errors (already normalised)
      const error = err as AppError;

      if (error.type === "validation") {
        setErrors(mapValidationErrors<LoginFields>(error.errors));
      } else {
        setErrors({
          submit: error.message ?? "Unable to sign in. Please try again.",
        });
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

            <ButtonStandard type="submit" isLoading={isSubmitting}>
              Log in
            </ButtonStandard>
          </form>
        </div>
      </div>
  );
}