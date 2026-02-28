import type { TextInputProps } from "./types";

export function TextInput({
  label,
  error,
  errorId,
  className = "",
  id,
  ...props
}: TextInputProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium" style={{ color: "#1a2133" }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`block w-full rounded-sm border-0 bg-white py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm
          ${error ? "ring-red-500 focus:ring-red-500" : "ring-gray-300 focus:ring-blue-500"} ${className}`}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
