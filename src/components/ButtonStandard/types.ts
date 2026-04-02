export type ButtonVariant = "primary" | "success" | "dark" | "secondary";

export type ButtonSize = "sm" | "md";

export type ButtonStandardProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
    loadingText?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
  };
