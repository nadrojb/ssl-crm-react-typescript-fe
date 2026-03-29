import type { ReactNode } from "react";

type CardProps = {
  title: ReactNode;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export function Card({ title, rightSlot, children }: CardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        {rightSlot != null ? <div>{rightSlot}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default Card;
