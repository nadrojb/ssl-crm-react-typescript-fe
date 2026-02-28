import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z, ZodError } from "zod";
import { FormError } from "../../components/FormError";
import { TextInput } from "../../components/TextInput";
import { ButtonStandard } from "../../components/ButtonStandard";

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FieldErrors = {
  email?: string;
  password?: string;
  submit?: string;
};

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const buildPayload = <T extends Record<string, unknown>>(obj: T): Partial<T> =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => {
        return !(typeof v === "string" && v.trim() === "");
      })
    ) as Partial<T>;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const candidate = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const validated = LoginSchema.parse(candidate);

      const payload = buildPayload(validated);

      await axios.post("/login", payload, {
        headers: { "Content-Type": "application/json" },
      });

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const fieldErrors: FieldErrors = {};
        for (const issue of err.issues) {
          const field = issue.path[0];
          if (typeof field === "string" && !fieldErrors[field as keyof FieldErrors]) {
            fieldErrors[field as keyof FieldErrors] = issue.message;
          }
        }
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data as Record<string, unknown>;

        if (status === 422 && data?.errors && typeof data.errors === "object") {
          const fieldErrors: FieldErrors = {};
          for (const [key, messages] of Object.entries(data.errors as Record<string, string[]>)) {
            if (Array.isArray(messages) && messages.length) {
              fieldErrors[key as keyof FieldErrors] = messages[0];
            }
          }
          setErrors(fieldErrors);
        } else {
          setErrors({
            submit: (data?.message as string) ?? "Unable to sign in. Please try again.",
          });
        }
      } else {
        setErrors({ submit: "An unexpected error occurred" });
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

        <div className="">
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
    </div>
  );
}
