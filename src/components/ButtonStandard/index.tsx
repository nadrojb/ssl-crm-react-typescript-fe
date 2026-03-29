import type { ButtonStandardProps } from "./types";

import { uiColors } from "../../styles/ui-colors";

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
      className={`inline-flex w-full items-center justify-center rounded-sm ${uiColors.buttonPrimary.background} px-4 py-2.5 text-sm font-semibold ${uiColors.buttonPrimary.text} shadow-sm ${uiColors.buttonPrimary.backgroundHover} hover:cursor-pointer transition hover:ease-in-out focus-visible:outline-none focus-visible:ring-2 ${uiColors.buttonPrimary.focusRing} disabled:opacity-60 ${className}`}
      {...props}
    >
      {isLoading ? loadingText || "Loading..." : children}
    </button>
  );
}
