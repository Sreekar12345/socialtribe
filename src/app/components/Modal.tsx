import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
  actions?: ReactNode;
}

export function Modal({ open, title, description, onClose, children, actions }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-6 pt-10">
      <div className="w-full max-w-[388px] rounded-[28px] border border-white/10 bg-neutral-950 p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">{title}</h2>
            {description ? <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="fin-topbar-action h-9 w-9">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children ? <div className="mt-4">{children}</div> : null}
        {actions ? <div className="mt-5 grid grid-cols-2 gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
