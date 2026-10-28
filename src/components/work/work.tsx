"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { withBase } from "@/lib/paths";
import type { Project, WorkAccent } from "@/content/work";
import { useSiteContent } from "@/lib/site-content";
import { Reveal, RevealLine, useReveal } from "@/components/motion/reveal";
import { SectionPattern } from "@/components/ui/section-pattern";

const WASH: Record<WorkAccent, string> = {
  violet: "bg-violet/55",
  sky: "bg-sky/55",
  peach: "bg-peach/55",
  lime: "bg-lime/55",
};

const FILL: Record<WorkAccent, string> = {
  violet: "bg-violet/80",
  sky: "bg-sky/80",
  peach: "bg-peach/80",
  lime: "bg-lime/80",
};

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(to right, rgb(17 17 17 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(17 17 17 / 0.045) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
};

function CoverArt({ project }: { project: Project }) {
  if (project.visual === "halo") {
    return (
      <div className="relative aspect-square h-[56%]">
        <span className="absolute inset-0 rounded-full border border-foreground/10" />
        <span className="absolute inset-[11%] rounded-full border border-foreground/[0.07]" />
        <span
          className={cn(
            "absolute inset-[28%] rounded-full shadow-[0_24px_60px_-20px_rgb(0_0_0/0.4)]",
            FILL[project.accent]
          )}
        />
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/70" />
      </div>
    );
  }

  if (project.visual === "arch") {
    return (
      <div className="relative h-[62%] w-[42%]">
        <span className="absolute inset-0 overflow-hidden rounded-t-full border border-foreground/10 bg-white/30">
          <span
            className={cn(
              "absolute inset-x-0 bottom-0 h-[78%] rounded-t-full",
              FILL[project.accent]
            )}
          />
          <span className="absolute inset-x-0 bottom-[32%] h-px bg-foreground/15" />
        </span>
        <span className="absolute -right-6 top-[32%] h-14 w-14 translate-x-full rounded-full border border-foreground/10 bg-white/40 backdrop-blur-sm" />
      </div>
    );
  }

  if (project.visual === "stack") {
    return (
      <div className="relative h-[56%] w-[55%]">
        <span className="absolute left-0 top-[18%] h-2/3 w-2/3 -rotate-6 rounded-[18px] border border-foreground/10 bg-white/55 shadow-[0_16px_36px_-24px_rgb(0_0_0/0.35)]" />
        <span className="absolute left-[16%] top-[6%] h-2/3 w-2/3 rotate-3 rounded-[18px] border border-foreground/10 bg-[var(--color-surface)] shadow-[0_16px_36px_-24px_rgb(0_0_0/0.3)]" />
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2/3 w-2/3 rotate-12 rounded-[18px] border border-foreground/10 shadow-[0_20px_40px_-24px_rgb(0_0_0/0.4)]",
            FILL[project.accent]
          )}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[56%] items-end gap-2.5 md:gap-3.5">
      {[38, 62, 46, 82, 57].map((height, index) => (
        <span
          key={height}
          className={cn(
            "w-4 rounded-full md:w-5",
            index === 3 ? FILL[project.accent] : "bg-foreground/10"
          )}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function ProjectCover({
  project,
  index,
  isPlaceholder,
}: {
  project: Project;
  index: number;
  isPlaceholder: boolean;
}) {
  const cover = project.cover ? withBase(project.cover) : undefined;
  const hasCover = Boolean(cover);

  return (
    <div
      aria-hidden="true"
      className="relative aspect-[4/3] overflow-hidden rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_28px_70px_-56px_rgb(0_0_0/0.35)]"
    >
      {hasCover ? (
        <>
          <img
            src={cover}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/0 to-black/65" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 opacity-70" style={GRID_STYLE} />
          <div
            className={cn(
              "absolute -left-20 -top-24 h-64 w-64 rounded-full opacity-70 blur-[90px]",
              WASH[project.accent]
            )}
          />
          <div
            className={cn(
              "absolute -bottom-28 -right-16 h-72 w-72 rounded-full opacity-45 blur-[100px]",
              WASH[project.accent]
            )}
          />

          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-[1.035]">
            <CoverArt project={project} />
          </div>
        </>
      )}

      <div
        className={cn(
          "absolute inset-x-5 top-4 flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.2em] md:inset-x-6 md:top-5",
          hasCover ? "text-white/80 drop-shadow-[0_1px_2px_rgb(0_0_0/0.35)]" : "text-foreground/50"
        )}
      >
        <span>N° {String(index + 1).padStart(2, "0")}</span>
        <span>{project.year}</span>
      </div>

      <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-4 md:inset-x-6 md:bottom-5">
        <span
          className={cn(
            "font-display text-[2.4rem] italic leading-none drop-shadow-sm",
            hasCover ? "text-white/90" : "text-foreground/80"
          )}
        >
          {project.mark}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/75 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-foreground/75 backdrop-blur-sm transition-colors duration-300",
            !isPlaceholder && "group-hover:bg-white/95 group-hover:text-foreground"
          )}
        >
          {isPlaceholder ? "Case study soon" : "View project"}
          {!isPlaceholder && (
            <ArrowUpRight
              className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          )}
        </span>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  stickyClass,
}: {
  project: Project;
  index: number;
  stickyClass: string;
}) {
  const reveal = useReveal({
    delay: Math.min(index * 0.06, 0.24),
    distance: 28,
    amount: 0.18,
  });

  const isPlaceholder = !project.href || project.href === "#";

  const cardContent = (
    <>
      <ProjectCover project={project} index={index} isPlaceholder={isPlaceholder} />

      <div className="mt-5 border-t border-[var(--color-border)] pt-4">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {project.category}
              <span aria-hidden="true" className="mx-2 text-muted-foreground/40">
                /
              </span>
              {project.year}
            </p>
            <h3 className="mt-2 font-display text-[1.9rem] leading-[0.95] tracking-[-0.01em] md:text-[2.15rem]">
              {project.title}
            </h3>
          </div>
          {isPlaceholder ? (
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-foreground/35"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </span>
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-foreground/60 transition-colors duration-300 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          )}
        </div>

        <p className="mt-3 max-w-[44ch] text-[13px] leading-relaxed text-muted-foreground md:text-sm">
          {project.summary}
        </p>

        <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground/80">
          {project.tags.map((tag, tagIndex) => (
            <li key={`${tag}-${tagIndex}`} className="flex items-center gap-3">
              {tagIndex > 0 && (
                <span
                  aria-hidden="true"
                  className="h-[3px] w-[3px] rounded-full bg-foreground/25"
                />
              )}
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  if (isPlaceholder) {
    return (
      <motion.div {...reveal} className={cn("block bg-background", stickyClass)}>
        {cardContent}
      </motion.div>
    );
  }

  return (
    <motion.a
      {...reveal}
      href={withBase(project.href)}
      className={cn(
        "group block bg-background focus-visible:z-10",
        stickyClass
      )}
    >
      {cardContent}
    </motion.a>
  );
}

export function Work() {
  const { work } = useSiteContent();
  const leftProjects = work.projects
    .map((project, index) => ({ project, index }))
    .filter(({ index }) => index % 2 === 0);
  const rightProjects = work.projects
    .map((project, index) => ({ project, index }))
    .filter(({ index }) => index % 2 === 1);
  const projectCount = `${String(work.projects.length).padStart(2, "0")} projects`;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative border-t border-[var(--color-border)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-[16%] -top-40 h-[620px] w-[620px] rounded-full bg-[var(--color-blob-3)] opacity-35 blur-[160px]" />
        <SectionPattern edge="right" variant="grid" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 pt-20 pb-0 md:px-10 md:pt-28 md:pb-0 lg:px-16 lg:pt-32">
        <header className="grid gap-8 border-b border-[var(--color-border)] pb-10 md:grid-cols-[minmax(0,1fr)_340px] md:items-end md:gap-12 md:pb-14 lg:gap-20">
          <div>
            <Reveal distance={10} amount={0.6}>
              <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground" />
                {work.eyebrow}
              </p>
            </Reveal>
            <h2
              id="work-heading"
              className="mt-5 font-display text-[clamp(3.2rem,7vw,6.2rem)] font-normal leading-[0.87] tracking-[-0.03em]"
            >
              <RevealLine>{work.heading[0]}</RevealLine>
              <RevealLine delay={0.08}>
                <em className="italic">{work.heading[1]}</em>
              </RevealLine>
            </h2>
          </div>

          <Reveal
            className="flex flex-col gap-5 md:items-end md:pb-2 md:text-right"
            delay={0.14}
            distance={18}
            amount={0.35}
          >
            <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
              {work.intro}
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {projectCount} · {work.period}
            </p>
          </Reveal>
        </header>

        {/* Mobile: one card at a time, each new card rising over the last. */}
        <div className="mt-12 flex flex-col gap-14 md:hidden">
          {work.projects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${index}`}
              project={project}
              index={index}
              stickyClass="sticky top-4 motion-reduce:static"
            />
          ))}
          {/* Keeps the final card pinned while the page scrolls out. */}
          <div aria-hidden="true" className="h-[56svh] shrink-0 motion-reduce:hidden" />
        </div>

        {/* Desktop: two staggered sticky columns. New cards ride over the old ones. */}
        <div className="mt-16 hidden md:grid md:grid-cols-2 md:gap-x-8 lg:mt-20 lg:gap-x-14">
          <div className="flex flex-col gap-20 lg:gap-24">
            {leftProjects.map(({ project, index }) => (
              <ProjectCard
                key={`${project.title}-${index}`}
                project={project}
                index={index}
                stickyClass="sticky top-16 lg:top-20 motion-reduce:static"
              />
            ))}
            <div aria-hidden="true" className="h-[56svh] shrink-0 motion-reduce:hidden" />
          </div>

          <div className="flex flex-col gap-20 md:mt-20 lg:mt-28 lg:gap-24">
            {rightProjects.map(({ project, index }) => (
              <ProjectCard
                key={`${project.title}-${index}`}
                project={project}
                index={index}
                stickyClass="sticky top-24 lg:top-28 motion-reduce:static"
              />
            ))}
            <div aria-hidden="true" className="h-[56svh] shrink-0 motion-reduce:hidden" />
          </div>
        </div>

        {/* With reduced motion the stack is disabled, so close the section with breathing room. */}
        <div aria-hidden="true" className="hidden h-20 motion-reduce:block" />
      </div>
    </section>
  );
}
