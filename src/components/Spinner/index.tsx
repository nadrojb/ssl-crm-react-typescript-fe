type SpinnerSize = "sm" | "md" | "lg";

type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
};

const getSizeClasses = (size: SpinnerSize) => {
  if (size === "sm") {
    return "h-4 w-4 border-2";
  }

  if (size === "lg") {
    return "h-6 w-6 border-[3px]";
  }

  return "h-5 w-5 border-2";
};

export const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses} ${className}`}
    />
  );
};

export default Spinner;
