import type { ReactNode } from 'react';

interface FormSectionProps { number: number; title: string; description: string; children: ReactNode }

export function FormSection({ number, title, description, children }: FormSectionProps) {
  return <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><legend className="sr-only">{title}</legend><div className="mb-6 flex gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-900 text-sm font-black text-white">{number}</span><div><h2 className="text-xl font-black text-brand-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div></div>{children}</fieldset>;
}
