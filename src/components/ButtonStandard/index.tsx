import type { ButtonStandardProps, ButtonSize, ButtonVariant } from "./types";

import { uiColors } from "../../styles/ui-colors";
import { Spinner } from "../Spinner";

const getVariantClasses = (variant: ButtonVariant) => {
  if (variant === "primary") {
    return {
      base: `${uiColors.buttonPrimary.background} ${uiColors.buttonPrimary.text} ${uiColors.buttonPrimary.backgroundHover} ${uiColors.buttonPrimary.focusRing}`,
    };
  }

  if (variant === "success") {
    return {
      base: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
    };
  }

  if (variant === "dark") {
    return {
      base: "bg-red-600 text-white hover:bg-red-800 focus-visible:ring-red-500",
    };
  }

  return {
    base: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500",
  };
};

const getSizeClasses = (size: ButtonSize) => {
  if (size === "sm") {
    return "px-4 py-2 text-sm";
  }

  return "px-4 py-2.5 text-sm";
};

export function ButtonStandard({
  isLoading,
  loadingText,
  children,
  disabled,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonStandardProps) {
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex ${widthClass} items-center justify-center rounded-md ${sizeClasses} font-medium shadow-sm hover:cursor-pointer transition hover:ease-in-out focus-visible:outline-none focus-visible:ring-2 disabled:opacity-60 ${variantClasses.base} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Spinner size="sm" />
          <span>{loadingText || "Loading..."}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
