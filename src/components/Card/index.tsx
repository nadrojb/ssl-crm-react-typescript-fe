import type { ReactNode } from "react";

import { uiColors } from "../../styles/ui-colors";

type CardProps = {
  title: ReactNode;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export function Card({ title, rightSlot, children }: CardProps) {
  return (
    <div
      className={`rounded-lg ${uiColors.surface} p-6 shadow-sm border ${uiColors.borderSubtle}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`text-sm font-medium ${uiColors.textPrimary}`}>{title}</div>
        {rightSlot != null ? <div>{rightSlot}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default Card;
