"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  FileText,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import {
  ApiError,
  listUploads,
  removeUpload,
  uploadFile,
  type UploadedFile,
} from "@/lib/content-api";
import { withBase } from "@/lib/paths";
import { cn } from "@/lib/utils";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("id-ID");
}

function mediaKind(mimeType: string): "image" | "video" | "document" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
}

function errorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Tidak bisa menghubungi API upload lokal. Pastikan server berjalan.";
}

function MediaThumb({ upload }: { upload: UploadedFile }) {
  const kind = mediaKind(upload.mimeType);

  if (kind === "image") {
    return (
      <img
        src={withBase(upload.url)}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <span className="flex h-full w-full items-center justify-center bg-[var(--color-glass)] text-foreground/40">
      {kind === "video" ? (
        <Video aria-hidden="true" className="h-7 w-7" />
      ) : (
        <FileText aria-hidden="true" className="h-7 w-7" />
      )}
    </span>
  );
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand("copy")) throw new Error("Copy command failed.");
  } finally {
    textarea.remove();
  }
}

export function MediaLibrary() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      setUploads(await listUploads());
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function uploadMany(files: FileList | File[] | null | undefined) {
    const list = Array.from(files ?? []);
    if (list.length === 0) return;

    setDragging(false);
    setUploadingCount(list.length);
    setError("");

    const created: UploadedFile[] = [];
    const failures: string[] = [];

    for (const file of list) {
      try {
        created.push(await uploadFile(file));
      } catch (uploadError) {
        failures.push(`${file.name}: ${errorMessage(uploadError)}`);
      }
    }

    if (created.length > 0) {
      setUploads((current) => [...created, ...current]);
    }

    if (failures.length > 0) {
      setError(failures.join(" "));
    }

    setUploadingCount(0);
  }

  async function handleCopy(upload: UploadedFile) {
    try {
      const absoluteUrl = new URL(withBase(upload.url), window.location.origin).toString();
      await copyText(absoluteUrl);
      setCopiedId(upload.id);
      window.setTimeout(() => setCopiedId((current) => (current === upload.id ? null : current)), 1800);
    } catch {
      setError(`Gagal menyalin URL ${upload.originalName}. Salin path ${upload.url} secara manual.`);
    }
  }

  async function handleDelete(upload: UploadedFile) {
    if (!window.confirm(`Hapus ${upload.originalName} dari media library?`)) return;

    try {
      await removeUpload(upload.id);
      setUploads((current) => current.filter((item) => item.id !== upload.id));
    } catch (deleteError) {
      setError(errorMessage(deleteError));
    }
  }

  return (
    <div className="max-w-6xl pb-16">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--color-border)] pb-6">
        <div>
          <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.24em] text-foreground/55">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground" />
            Admin / Media
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.8rem,5vw,4.6rem)] leading-[0.9] tracking-[-0.03em]">
            Media
          </h2>
          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-foreground/55">
            Upload gambar, video, atau PDF ke folder lokal. File tersimpan di{" "}
            <code className="rounded bg-[var(--color-glass)] px-1.5 py-0.5 text-[0.9em]">uploads/</code> dan
            tidak ikut build statis GitHub Pages.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:border-foreground/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
        >
          <RefreshCw aria-hidden="true" className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Muat ulang
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Media library: pilih atau tarik beberapa file untuk diunggah"
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
          "mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
          dragging
            ? "border-foreground/45 bg-lime/20"
            : "border-[var(--color-border)] bg-[var(--color-glass-soft)] hover:border-foreground/25 hover:bg-[var(--color-glass)]",
          uploadingCount > 0 && "cursor-wait"
        )}
      >
        {uploadingCount > 0 ? (
          <Loader2 aria-hidden="true" className="h-7 w-7 animate-spin text-foreground/45" />
        ) : (
          <UploadCloud aria-hidden="true" className="h-7 w-7 text-foreground/45" />
        )}
        <span className="mt-3 text-sm font-medium text-foreground/65">
          {uploadingCount > 0
            ? `Mengunggah ${uploadingCount} file...`
            : "Tarik file ke sini, atau klik untuk memilih"}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-foreground/35">
          PNG · JPEG · WebP · GIF · AVIF · MP4 · WebM · MOV · PDF · maks. 50 MB
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        onChange={(event) => {
          void uploadMany(event.target.files);
          event.target.value = "";
        }}
      />

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-xs leading-relaxed text-foreground/65"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <h3 className="font-display text-2xl leading-none tracking-[-0.01em]">
          File tersimpan
        </h3>
        <span className="text-[10px] uppercase tracking-[0.14em] text-foreground/35">
          {uploads.length} file
        </span>
      </div>

      {loading ? (
        <p className="mt-6 flex items-center gap-2 text-xs text-foreground/45">
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          Memuat media...
        </p>
      ) : uploads.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-6 py-10 text-center">
          <ImageIcon aria-hidden="true" className="mx-auto h-7 w-7 text-foreground/30" />
          <p className="mt-3 text-sm text-foreground/55">Belum ada file yang diunggah.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {uploads.map((upload) => (
            <article
              key={upload.id}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <a
                href={withBase(upload.url)}
                target="_blank"
                rel="noreferrer"
                className="block aspect-[4/3] bg-[var(--color-glass-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              >
                <MediaThumb upload={upload} />
              </a>
              <div className="p-4">
                <p className="truncate text-sm font-medium text-foreground/80" title={upload.originalName}>
                  {upload.originalName}
                </p>
                <p className="mt-1 truncate text-[10px] uppercase tracking-[0.12em] text-foreground/35">
                  {formatSize(upload.size)} · {formatDate(upload.createdAt)}
                </p>
                <p className="mt-2 truncate font-mono text-[10px] text-foreground/35" title={upload.url}>
                  {upload.url}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleCopy(upload)}
                    className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/55 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                  >
                    {copiedId === upload.id ? (
                      <Check aria-hidden="true" className="h-3.5 w-3.5" />
                    ) : (
                      <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    {copiedId === upload.id ? "Tersalin" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(upload)}
                    aria-label={`Hapus ${upload.originalName}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-foreground/40 transition-colors hover:border-rose/40 hover:bg-rose/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
