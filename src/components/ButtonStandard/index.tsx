import type { ButtonStandardProps } from "./types";

export function ButtonStandard({
  isLoading,
  loadingText,
  children,
  disabled,
  className = "",
  ...props
}: ButtonStandardProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex w-full items-center justify-center rounded-sm bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 hover:cursor-pointer transition hover:ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 ${className}`}
      {...props}
    >
      {isLoading ? loadingText || "Loading..." : children}
    </button>
  );
}
