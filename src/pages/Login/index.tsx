import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { z, ZodError } from "zod";

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

    // Clear field error as the user fixes it
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const buildPayload = <T extends Record<string, unknown>>(obj: T): Partial<T> =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => {
        // Only omit empty strings; keep other falsy values (like 0 or false) if present
        return !(typeof v === "string" && v.trim() === "");
      })
    ) as Partial<T>;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Normalize on submit (trim, lowercase email). Do not modify password.
      const candidate = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      // Frontend validation
      const validated = LoginSchema.parse(candidate);

      // Omit empty strings from payload (future-proof if optional fields are added)
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
        const data = err.response?.data as any;

        if (status === 422 && data?.errors && typeof data.errors === "object") {
          // Laravel validation error format: { errors: { email: ["..."], password: ["..."] } }
          const fieldErrors: FieldErrors = {};
          for (const [key, messages] of Object.entries<Record<string, string[]>>(data.errors)) {
            if (Array.isArray(messages) && messages.length) {
              fieldErrors[key as keyof FieldErrors] = messages[0];
            }
          }
          setErrors(fieldErrors);
        } else {
          setErrors({
            submit: data?.message ?? "Unable to sign in. Please try again.",
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
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {errors.submit ? (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
                {errors.submit}
              </div>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email) || undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`block w-full rounded-lg border-0 bg-white py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm
                  ${errors.email ? "ring-red-500 focus:ring-red-500" : "ring-gray-300 focus:ring-indigo-500"}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password) || undefined}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`block w-full rounded-lg border-0 bg-white py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm
                  ${errors.password ? "ring-red-500 focus:ring-red-500" : "ring-gray-300 focus:ring-indigo-500"}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}