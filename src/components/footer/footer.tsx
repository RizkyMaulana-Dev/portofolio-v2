import { ArrowUp, ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      aria-labelledby="footer-heading"
      className="relative scroll-mt-20 overflow-hidden border-t border-[var(--color-border)] bg-surface"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[12%] -top-52 h-[620px] w-[620px] rounded-full bg-[var(--color-blob-2)] opacity-25 blur-[160px]" />
        <div className="absolute -right-[10%] bottom-0 h-[420px] w-[420px] rounded-full bg-[var(--color-blob-1)] opacity-20 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16">
        <div className="grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-24">
          <div>
            <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.26em] text-foreground/60">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground" />
              Contact / {year}
            </p>

            <h2
              id="footer-heading"
              className="mt-5 font-display text-[clamp(3.4rem,8.2vw,7.6rem)] leading-[0.86] tracking-[-0.04em]"
            >
              Let's make
              <br />
              <em className="italic">it clear.</em>
            </h2>

            <a
              href={`mailto:${site.email}`}
              className="group mt-8 inline-flex max-w-full items-center gap-3 border-b border-foreground/20 pb-2 text-sm font-medium text-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="truncate">{site.email}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/15 transition-colors duration-300 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1 lg:pt-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-foreground/60">
                Elsewhere
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      className="group inline-flex min-h-8 items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
                    >
                      {social.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-foreground/60">
                Availability
              </p>
              <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-foreground/60">
                {site.availability}
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-foreground/60">
                {site.location}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--color-border)] py-6 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}
          </p>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {site.footerNav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-8 items-center transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="#top"
            className="inline-flex min-h-8 items-center gap-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
          >
            Back to top
            <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
