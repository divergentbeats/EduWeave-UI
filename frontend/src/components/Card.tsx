import { ReactNode } from 'react';

type CardProps = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function Card({ title, actions, children }: CardProps) {
  return (
    <div className="card-hover rounded-xl border bg-white shadow-sm p-4">
      {(title || actions) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h3 className="font-semibold text-sm text-gray-700">{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}


