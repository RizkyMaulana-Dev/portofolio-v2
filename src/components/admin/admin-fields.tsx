"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputClass =
  "h-11 w-full rounded-xl border border-[var(--color-border)] bg-white/60 px-3.5 text-sm text-foreground placeholder:text-foreground/35 transition-colors focus:border-foreground/25 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring/10";

const textareaClass =
  "min-h-28 w-full resize-y rounded-xl border border-[var(--color-border)] bg-white/60 px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-foreground/35 transition-colors focus:border-foreground/25 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring/10";

function FieldWrap({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/60"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-foreground/45">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  type?: "text" | "email" | "url";
  className?: string;
}) {
  const id = useId();

  return (
    <FieldWrap label={label} hint={hint} htmlFor={id} className={className}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </FieldWrap>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  rows = 4,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const id = useId();

  return (
    <FieldWrap label={label} hint={hint} htmlFor={id} className={className}>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={textareaClass}
      />
    </FieldWrap>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
  className,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  hint?: string;
  className?: string;
}) {
  const id = useId();

  return (
    <FieldWrap label={label} hint={hint} htmlFor={id} className={className}>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className={cn(inputClass, "appearance-none pr-10")}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
        />
      </div>
    </FieldWrap>
  );
}

export function CommaListField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  className,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
  placeholder?: string;
  className?: string;
}) {
  const [text, setText] = useState(value.join(", "));
  const lastEmitted = useRef(value.join(", "));

  useEffect(() => {
    const next = value.join(", ");

    // Keep the free-form input stable while the user is typing, but resync if
    // the underlying list changes from elsewhere (for example when repeatable
    // items shift after a delete).
    if (next !== lastEmitted.current) {
      setText(next);
      lastEmitted.current = next;
    }
  }, [value]);

  return (
    <TextField
      label={label}
      value={text}
      onChange={(next) => {
        const parsed = next
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        setText(next);
        lastEmitted.current = parsed.join(", ");
        onChange(parsed);
      }}
      hint={hint}
      placeholder={placeholder}
      className={className}
    />
  );
}

export function Subsection({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl leading-none tracking-[-0.01em]">{title}</h3>
          {description && (
            <p className="mt-2 max-w-[62ch] text-xs leading-relaxed text-foreground/55">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function ItemCard({
  index,
  label,
  onRemove,
  children,
}: {
  index: number;
  label: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white/45 p-4 md:p-5">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/50">
          {String(index + 1).padStart(2, "0")} / {label}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/45 transition-colors hover:bg-rose/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
        >
          <Trash2 aria-hidden="true" className="h-3 w-3" />
          Hapus
        </button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

export function AddButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dashed border-foreground/20 px-4 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/60 transition-colors hover:border-foreground/50 hover:bg-white/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
    >
      <Plus aria-hidden="true" className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

export function FormShell({
  eyebrow,
  title,
  description,
  isDirty,
  onSave,
  onReset,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  isDirty: boolean;
  onSave: () => void;
  onReset: () => void;
  children: ReactNode;
}) {
  const actions = (
    <>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex min-h-10 items-center rounded-full border border-[var(--color-border)] bg-white/50 px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
      >
        Reset ke default
      </button>
      <button
        type="submit"
        disabled={!isDirty}
        className="inline-flex min-h-10 items-center rounded-full bg-foreground px-5 text-[10px] font-medium uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2"
      >
        Simpan perubahan
      </button>
    </>
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (isDirty) onSave();
      }}
      className="max-w-5xl pb-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--color-border)] pb-6">
        <div>
          <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.24em] text-foreground/55">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground" />
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.8rem,5vw,4.6rem)] leading-[0.9] tracking-[-0.03em]">
            {title}
          </h2>
          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-foreground/55">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>

      {children}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/45">
          {isDirty ? "Ada perubahan yang belum disimpan." : "Bagian ini sudah sinkron."}
        </p>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>
    </form>
  );
}
