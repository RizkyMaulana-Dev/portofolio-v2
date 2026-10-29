"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  FileText,
  History,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { ApiError, uploadFile } from "@/lib/content-api";
import { withBase } from "@/lib/paths";
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

type MediaKind = "image" | "video" | "document";

function isImageValue(value: string): boolean {
  return /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(value);
}

function isVideoValue(value: string): boolean {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(value);
}

function uploadErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Upload gagal. Pastikan API lokal berjalan lalu coba lagi.";
}

function fileName(value: string): string {
  const name = value.split("/").pop()?.split("?")[0];
  return name || value;
}

function MediaPreview({
  value,
  kind,
  className,
  controls = true,
}: {
  value: string;
  kind: MediaKind;
  className?: string;
  controls?: boolean;
}) {
  if (kind === "image" && isImageValue(value)) {
    return (
      <img
        src={withBase(value)}
        alt=""
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  if (kind === "video" || isVideoValue(value)) {
    return (
      <video
        src={withBase(value)}
        controls={controls}
        muted
        playsInline
        preload="metadata"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center bg-white/50 text-foreground/45",
        className
      )}
    >
      <FileText aria-hidden="true" className="h-7 w-7" />
    </span>
  );
}

export function FileDropField({
  label,
  value,
  onChange,
  accept = "image/*",
  kind = "image",
  hint,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  kind?: MediaKind;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadOne(file: File | undefined) {
    if (!file || uploading) return;

    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadFile(file);
      onChange(uploaded.url);
    } catch (uploadError) {
      setError(uploadErrorMessage(uploadError));
    } finally {
      setUploading(false);
      setDragging(false);
    }
  }

  function openPicker() {
    if (!uploading) inputRef.current?.click();
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/55">
          {label}
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
          >
            Hapus
          </button>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label={`${label}: pilih atau tarik file untuk diunggah`}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void uploadOne(event.dataTransfer.files[0]);
        }}
        className={cn(
          "relative flex min-h-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed p-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
          dragging
            ? "border-foreground/45 bg-lime/20"
            : "border-[var(--color-border)] bg-white/35 hover:border-foreground/25 hover:bg-white/60",
          uploading && "cursor-wait"
        )}
      >
        {value ? (
          <MediaPreview value={value} kind={kind} className="max-h-44 rounded-xl object-contain" />
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 py-5 text-foreground/45">
            <UploadCloud aria-hidden="true" className="h-6 w-6" />
            <span className="text-xs font-medium text-foreground/60">
              Tarik file ke sini atau klik untuk memilih
            </span>
            <span className="text-[10px] leading-relaxed text-foreground/35">
              Maksimum 50 MB · {accept}
            </span>
          </span>
        )}

        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/75 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/65 backdrop-blur-[1px]">
            <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
            Mengunggah...
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          void uploadOne(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="/uploads/nama-file.ext"
        aria-label={`${label} URL`}
        className={inputClass}
      />

      {hint && <p className="text-[10px] leading-relaxed text-foreground/40">{hint}</p>}
      {error && (
        <p role="alert" className="text-[11px] leading-relaxed text-rose">
          {error}
        </p>
      )}
    </div>
  );
}

export function MediaListField({
  label,
  values,
  onChange,
  accept = "image/*",
  kind = "image",
  hint,
  className,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  accept?: string;
  kind?: MediaKind;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState("");

  const items = values.filter(Boolean);

  async function uploadMany(files: FileList | File[] | null | undefined) {
    const list = Array.from(files ?? []);
    if (list.length === 0) return;

    setDragging(false);
    setUploadingCount(list.length);
    setError("");

    const uploaded: string[] = [];
    const failures: string[] = [];

    for (const file of list) {
      try {
        const result = await uploadFile(file);
        uploaded.push(result.url);
      } catch (uploadError) {
        failures.push(`${file.name}: ${uploadErrorMessage(uploadError)}`);
      }
    }

    if (uploaded.length > 0) {
      onChange([...items, ...uploaded]);
    }

    if (failures.length > 0) {
      setError(failures.join(" "));
    }

    setUploadingCount(0);
  }

  function removeAt(index: number) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  function updateAt(index: number, next: string) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? next : item)));
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/55">
          {label}
        </span>
        <span className="text-[10px] uppercase tracking-[0.12em] text-foreground/35">
          {items.length} file
        </span>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label={`${label}: pilih atau tarik beberapa file untuk diunggah`}
        onClick={() => uploadingCount === 0 && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (uploadingCount === 0) inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          void uploadMany(event.dataTransfer.files);
        }}
        className={cn(
          "flex min-h-24 cursor-pointer items-center justify-center rounded-2xl border border-dashed px-4 py-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
          dragging
            ? "border-foreground/45 bg-lime/20"
            : "border-[var(--color-border)] bg-white/35 hover:border-foreground/25 hover:bg-white/60",
          uploadingCount > 0 && "cursor-wait"
        )}
      >
        <span className="flex flex-col items-center gap-2 text-foreground/45">
          {uploadingCount > 0 ? (
            <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
          ) : (
            <UploadCloud aria-hidden="true" className="h-5 w-5" />
          )}
          <span className="text-xs font-medium text-foreground/60">
            {uploadingCount > 0
              ? `Mengunggah ${uploadingCount} file...`
              : "Tarik beberapa file ke sini atau klik untuk memilih"}
          </span>
          <span className="text-[10px] leading-relaxed text-foreground/35">
            Maksimum 50 MB per file · {accept}
          </span>
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          void uploadMany(event.target.files);
          event.target.value = "";
        }}
      />

      {items.length > 0 && (
        <div className="grid gap-2">
          {items.map((value, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/45 p-2"
            >
              <span className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white/70">
                <MediaPreview
                  value={value}
                  kind={kind}
                  controls={false}
                  className="object-cover"
                />
              </span>
              <input
                type="text"
                value={value}
                onChange={(event) => updateAt(index, event.target.value)}
                aria-label={`${label} ${index + 1} URL`}
                className={cn(inputClass, "min-w-0 flex-1")}
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Hapus ${fileName(value)}`}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-foreground/40 transition-colors hover:border-rose/40 hover:bg-rose/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              >
                <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {hint && <p className="text-[10px] leading-relaxed text-foreground/40">{hint}</p>}
      {error && (
        <p role="alert" className="text-[11px] leading-relaxed text-rose">
          {error}
        </p>
      )}
    </div>
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
  isSaving = false,
  restoredAt = null,
  onSave,
  onReset,
  onDiscardDraft,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  isDirty: boolean;
  isSaving?: boolean;
  restoredAt?: number | null;
  onSave: () => void | boolean | Promise<boolean>;
  onReset: () => void | Promise<void>;
  onDiscardDraft?: () => void;
  children: ReactNode;
}) {
  const actions = (
    <>
      <button
        type="button"
        onClick={() => void onReset()}
        disabled={isSaving}
        className="inline-flex min-h-10 items-center rounded-full border border-[var(--color-border)] bg-white/50 px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:border-foreground/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
      >
        Reset ke default
      </button>
      <button
        type="submit"
        disabled={!isDirty || isSaving}
        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-foreground px-5 text-[10px] font-medium uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2"
      >
        {isSaving && <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />}
        {isSaving ? "Menyimpan..." : "Simpan perubahan"}
      </button>
    </>
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (isDirty && !isSaving) void onSave();
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

      {restoredAt && (
        <div
          role="status"
          className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-lime/60 bg-lime/20 px-4 py-3"
        >
          <p className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/70">
            <History aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Draft dari{" "}
              <strong className="font-medium text-foreground">
                {new Date(restoredAt).toLocaleString("id-ID")}
              </strong>{" "}
              dipulihkan otomatis. Simpan untuk menerapkannya.
            </span>
          </p>
          {onDiscardDraft && (
            <button
              type="button"
              onClick={onDiscardDraft}
              className="inline-flex min-h-9 items-center rounded-full border border-foreground/15 bg-white/40 px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/60 transition-colors hover:border-foreground/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
            >
              Buang draft
            </button>
          )}
        </div>
      )}

      {children}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
        <p
          aria-live="polite"
          className="text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/45"
        >
          {isSaving
            ? "Menyimpan perubahan..."
            : isDirty
              ? "Draft aman otomatis. Klik simpan untuk menerapkan."
              : "Bagian ini sudah sinkron."}
        </p>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>
    </form>
  );
}
