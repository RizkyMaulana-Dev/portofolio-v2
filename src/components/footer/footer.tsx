'use client';

import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { withBase } from '@/lib/paths';
import { useSiteContent } from '@/lib/site-content';
import { Reveal, RevealLine } from '@/components/motion/reveal';
import { SectionPattern } from '@/components/ui/section-pattern';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Footer() {
  const { site } = useSiteContent();
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      aria-labelledby="footer-heading"
      className="bg-surface relative scroll-mt-20 overflow-hidden border-t border-[var(--color-border)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-52 -left-[12%] h-[620px] w-[620px] rounded-full bg-[var(--color-blob-2)] opacity-25 blur-[160px]" />
        <div className="absolute -right-[10%] bottom-0 h-[420px] w-[420px] rounded-full bg-[var(--color-blob-1)] opacity-20 blur-[150px]" />
        <SectionPattern edge="right" variant="grid" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16">
        <div className="grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-24">
          <div>
            <Reveal distance={8} amount={0.6}>
              <p className="text-foreground/60 flex items-center gap-2.5 text-[10px] font-medium tracking-[0.26em] uppercase">
                <span aria-hidden="true" className="bg-foreground h-1 w-1 rounded-full" />
                Contact / {year}
              </p>
            </Reveal>

            <h2
              id="footer-heading"
              className="font-display mt-5 text-[clamp(3.4rem,8.2vw,7.6rem)] leading-[0.86] tracking-[-0.04em]"
            >
              <RevealLine>{site.footerHeading[0]}</RevealLine>
              <RevealLine delay={0.08}>
                <em className="italic">{site.footerHeading[1]}</em>
              </RevealLine>
            </h2>

            <Reveal className="mt-8" delay={0.16} distance={14} amount={0.5}>
              <a
                href={`mailto:${site.email}`}
                className="group border-foreground/20 text-foreground hover:border-foreground focus-visible:ring-ring inline-flex max-w-full items-center gap-3 border-b pb-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span className="truncate">{site.email}</span>
                <span className="border-foreground/15 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300">
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
              </a>
            </Reveal>
          </div>

          <Reveal
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1 lg:pt-2"
            delay={0.12}
            distance={18}
            amount={0.3}
          >
            <div>
              <p className="text-foreground/60 text-[10px] font-medium tracking-[0.26em] uppercase">
                Elsewhere
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
                {site.socials.map((social, index) => (
                  <li key={`${social.label}-${index}`}>
                    <a
                      href={withBase(social.href)}
                      className="group text-foreground/60 hover:text-foreground focus-visible:text-foreground inline-flex min-h-8 items-center gap-1.5 text-sm transition-colors focus-visible:underline focus-visible:outline-none"
                    >
                      {social.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-foreground/60 text-[10px] font-medium tracking-[0.26em] uppercase">
                Availability
              </p>
              <p className="text-foreground/60 mt-4 max-w-[28ch] text-sm leading-relaxed">
                {site.availability}
              </p>
              <p className="text-foreground/60 mt-4 text-[10px] tracking-[0.18em] uppercase">
                {site.location}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="text-foreground/60 flex flex-col gap-4 border-t border-[var(--color-border)] py-6 text-[10px] font-medium tracking-[0.16em] uppercase md:flex-row md:items-center md:justify-between"
          delay={0.2}
          distance={10}
          amount={0.4}
        >
          <p>
            © {year} {site.name}
          </p>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {site.footerNav.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  <a
                    href={withBase(item.href)}
                    className="hover:text-foreground focus-visible:text-foreground inline-flex min-h-8 items-center transition-colors focus-visible:underline focus-visible:outline-none"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="#top"
              className="hover:text-foreground focus-visible:text-foreground inline-flex min-h-8 items-center gap-2 transition-colors focus-visible:underline focus-visible:outline-none"
            >
              Back to top
              <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
