import type { ReactNode } from "react";

type DrawerProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export const Drawer = ({ isOpen, title, onClose, children }: DrawerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="h-full overflow-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
