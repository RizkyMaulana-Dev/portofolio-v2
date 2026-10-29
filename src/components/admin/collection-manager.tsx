"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AddButton } from "@/components/admin/admin-fields";
import { withBase } from "@/lib/paths";
import { cn } from "@/lib/utils";

export interface CollectionColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (item: T, index: number) => ReactNode;
}

interface CollectionManagerProps<T> {
  title: string;
  description?: string;
  items: T[];
  onChange: (items: T[]) => void;
  getKey: (item: T, index: number) => string;
  getTitle: (item: T) => string;
  getSubtitle?: (item: T) => string;
  searchText: (item: T) => string;
  columns: Array<CollectionColumn<T>>;
  createItem: () => T;
  renderDetail: (item: T, index: number) => ReactNode;
  renderEditor: (item: T, onChange: (patch: Partial<T>) => void) => ReactNode;
  addLabel?: string;
  emptyLabel?: string;
  itemLabel?: string;
  className?: string;
}

export function CollectionManager<T>({
  title,
  description,
  items,
  onChange,
  getKey,
  getTitle,
  getSubtitle,
  searchText,
  columns,
  createItem,
  renderDetail,
  renderEditor,
  addLabel = "Tambah data",
  emptyLabel = "Belum ada data.",
  itemLabel = "data",
  className,
}: CollectionManagerProps<T>) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<"detail" | "edit">("detail");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchId = useId();
  const selected = selectedIndex === null ? null : items[selectedIndex] ?? null;
  const needle = query.trim().toLocaleLowerCase("id-ID");

  const filtered = useMemo(
    () =>
      items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => {
          if (!needle) return true;

          return `${getTitle(item)} ${getSubtitle?.(item) ?? ""} ${searchText(item)}`
            .toLocaleLowerCase("id-ID")
            .includes(needle);
        }),
    [getSubtitle, getTitle, items, needle, searchText]
  );

  useEffect(() => {
    if (selectedIndex !== null && !items[selectedIndex]) {
      setSelectedIndex(null);
      setMode("detail");
    }
  }, [items, selectedIndex]);

  function scrollToManager() {
    window.requestAnimationFrame(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rootRef.current?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function openDetail(index: number) {
    setSelectedIndex(index);
    setMode("detail");
    scrollToManager();
  }

  function backToTable() {
    setSelectedIndex(null);
    setMode("detail");
    scrollToManager();
  }

  function handleAdd() {
    const nextItems = [...items, createItem()];

    onChange(nextItems);
    setQuery("");
    setSelectedIndex(items.length);
    setMode("edit");
    scrollToManager();
  }

  function handleDelete() {
    if (selectedIndex === null || !selected) return;

    const confirmed = window.confirm(
      `Hapus ${itemLabel} “${getTitle(selected)}”? Perubahan ini masuk ke draft sampai kamu klik Simpan perubahan.`
    );

    if (!confirmed) return;

    onChange(items.filter((_, index) => index !== selectedIndex));
    setSelectedIndex(null);
    setMode("detail");
    scrollToManager();
  }

  function updateSelected(patch: Partial<T>) {
    if (selectedIndex === null) return;

    onChange(
      items.map((item, index) =>
        index === selectedIndex ? { ...item, ...patch } : item
      )
    );
  }

  return (
    <section ref={rootRef} className={cn("scroll-mt-24", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl leading-none tracking-[-0.01em]">
            {title}
          </h3>
          {description && (
            <p className="mt-2 max-w-[62ch] text-xs leading-relaxed text-foreground/55">
              {description}
            </p>
          )}
        </div>
        {!selected && <AddButton onClick={handleAdd}>{addLabel}</AddButton>}
      </div>

      {!selected ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-3">
            <label htmlFor={searchId} className="relative min-w-[220px] flex-1">
              <span className="sr-only">Cari {title.toLocaleLowerCase("id-ID")}</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/35"
              />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  // The manager lives inside the section's form; Enter in a
                  // search field should never trigger a section save.
                  if (event.key === "Enter") event.preventDefault();
                }}
                placeholder={`Cari ${title.toLocaleLowerCase("id-ID")}…`}
                className="h-10 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] pl-9 pr-9 text-xs text-foreground placeholder:text-foreground/35 transition-colors focus:border-foreground/25 focus:bg-[var(--color-glass-strong)] focus:outline-none focus:ring-2 focus:ring-ring/10 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-[var(--color-glass-strong)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                >
                  <X aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
            <p className="px-1 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/40">
              {filtered.length} / {items.length} {itemLabel}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-foreground/55">{emptyLabel}</p>
              <button
                type="button"
                onClick={handleAdd}
                className="mt-4 inline-flex min-h-9 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/60 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              >
                {addLabel}
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-foreground/55">
                Tidak ada {itemLabel} yang cocok dengan “{query}”.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 inline-flex min-h-9 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/60 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              >
                Hapus pencarian
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[340px] border-collapse text-left sm:min-w-[620px]">
                <thead className="bg-[var(--color-glass-soft)]">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className={cn(
                          "px-4 py-3 text-[9px] font-medium uppercase tracking-[0.16em] text-foreground/45",
                          column.className
                        )}
                      >
                        {column.header}
                      </th>
                    ))}
                    <th scope="col" className="w-12 px-4 py-3">
                      <span className="sr-only">Buka detail</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {filtered.map(({ item, index }) => (
                    <tr
                      key={`${getKey(item, index)}-${index}`}
                      onClick={() => openDetail(index)}
                      className="group cursor-pointer transition-colors hover:bg-[var(--color-glass-soft)]"
                    >
                      {columns.map((column, columnIndex) => (
                        <td
                          key={column.key}
                          className={cn("px-4 py-3.5 align-middle", column.className)}
                        >
                          {columnIndex === 0 ? (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                openDetail(index);
                              }}
                              className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                            >
                              {column.render(item, index)}
                            </button>
                          ) : (
                            column.render(item, index)
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3.5 text-right">
                        <ChevronRight
                          aria-hidden="true"
                          className="ml-auto h-4 w-4 text-foreground/25 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground/60"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] p-4 md:p-5">
            <div className="min-w-0">
              <button
                type="button"
                onClick={backToTable}
                className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/45 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              >
                <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
                Kembali ke daftar
              </button>
              <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.18em] text-foreground/40">
                {mode === "edit" ? "Mode edit" : "Detail"} · {String((selectedIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                <span className="capitalize">{itemLabel}</span>
              </p>
              <h4 className="mt-2 max-w-[56ch] break-words font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[0.95] tracking-[-0.02em]">
                {getTitle(selected)}
              </h4>
              {getSubtitle?.(selected) && (
                <p className="mt-2 max-w-[62ch] text-xs leading-relaxed text-foreground/55">
                  {getSubtitle(selected)}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {mode === "detail" ? (
                <>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/50 transition-colors hover:border-rose/40 hover:bg-rose/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("edit");
                      scrollToManager();
                    }}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-foreground px-5 text-[10px] font-medium uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2"
                  >
                    <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                    Edit
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMode("detail");
                    scrollToManager();
                  }}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-foreground px-5 text-[10px] font-medium uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2"
                >
                  <Check aria-hidden="true" className="h-3.5 w-3.5" />
                  Selesai edit
                </button>
              )}
            </div>
          </div>

          {mode === "edit" ? (
            <div className="p-4 md:p-5">
              <p className="mb-5 flex items-start gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-3.5 py-3 text-[11px] leading-relaxed text-foreground/55">
                <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Perubahan field langsung masuk ke draft. Klik <strong className="font-medium text-foreground">Simpan perubahan</strong> di bagian atas untuk menerapkannya ke situs.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {renderEditor(selected, updateSelected)}
              </div>
            </div>
          ) : (
            <div className="p-4 md:p-5">{renderDetail(selected, selectedIndex ?? 0)}</div>
          )}
        </div>
      )}
    </section>
  );
}

export function CollectionTabs({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: string; label: string; count?: number }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Pilih daftar konten"
      className="mt-8 inline-flex flex-wrap gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] p-1"
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex min-h-9 items-center gap-2 rounded-full px-4 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
              active
                ? "bg-foreground text-background"
                : "text-foreground/50 hover:bg-[var(--color-glass-strong)] hover:text-foreground"
            )}
          >
            {option.label}
            {typeof option.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[8px]",
                  active ? "bg-background/15" : "bg-[var(--color-glass-strong)]"
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function DetailGrid({
  fields,
}: {
  fields: Array<{ label: string; value: ReactNode; full?: boolean }>;
}) {
  return (
    <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">
      {fields.map((field) => {
        const empty =
          field.value === null ||
          field.value === undefined ||
          field.value === "";

        return (
          <div key={field.label} className={field.full ? "md:col-span-2" : undefined}>
            <dt className="text-[9px] font-medium uppercase tracking-[0.16em] text-foreground/40">
              {field.label}
            </dt>
            <dd className="mt-1.5 break-words text-sm leading-relaxed text-foreground/75">
              {empty ? <span className="text-foreground/35">—</span> : field.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function DetailImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-glass-soft)] px-4 text-center text-[11px] leading-relaxed text-foreground/40">
        Belum ada gambar.
      </div>
    );
  }

  return (
    <img
      src={withBase(src)}
      alt={alt}
      className="max-h-72 w-full rounded-xl border border-[var(--color-border)] object-cover"
    />
  );
}

export function DetailGallery({ values, alt }: { values?: string[]; alt: string }) {
  if (!values?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {values.map((value, index) => (
        <img
          key={`${value}-${index}`}
          src={withBase(value)}
          alt={`${alt} ${index + 1}`}
          className="aspect-[4/3] w-full rounded-lg border border-[var(--color-border)] object-cover"
          loading="lazy"
        />
      ))}
    </div>
  );
}
