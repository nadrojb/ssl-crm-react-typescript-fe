export const uiColors = {
  surface: "bg-white",
  surfaceMuted: "bg-gray-50",
  borderSubtle: "border-gray-100",
  divideSubtle: "divide-gray-100",
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600",
  textMuted: "text-gray-500",
  hoverSurfaceMuted: "hover:bg-gray-50",


  buttonPrimary: {
    background: "bg-blue-600",
    backgroundHover: "hover:bg-blue-800",
    text: "text-white",
    focusRing: "focus-visible:ring-blue-500",
  },

  pill: {
    neutral: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800",
    pink: "bg-pink-100 text-pink-800",
    orange: "bg-orange-100 text-orange-800",
  },
} as const;

export type UiColors = typeof uiColors;
