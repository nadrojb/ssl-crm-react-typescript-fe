import type { FormErrorProps } from "./types";

export function FormError({ error, id }: FormErrorProps) {
  if (!error) return null;

  return (
    <div
      id={id}
      className="rounded-sm bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200"
    >
      {error}
    </div>
  );
}
