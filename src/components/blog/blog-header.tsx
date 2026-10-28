import { cn } from '@/lib/utils';
import { withBase } from '@/lib/paths';
import { hero } from '@/content/hero';

export type SiteHeaderSection = 'work' | 'about' | 'blog' | 'contact';

const NAV: Array<{ id: SiteHeaderSection; label: string; href: string }> = [
  { id: 'work', label: 'Work', href: '/#work' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'blog', label: 'Blog', href: '/blog' },
  { id: 'contact', label: 'Contact', href: '/#contact' },
];

export function BlogHeader({ active }: { active?: SiteHeaderSection }) {
  return (
    <header className="bg-background/85 sticky top-0 z-40 border-b border-[var(--color-border)] backdrop-blur-xl">
      <div
        data-reveal-static=""
        className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-4 px-6 md:h-[76px] md:px-10 lg:px-16"
      >
        <a
          href={withBase('/')}
          aria-label="Rizky Maulana, back to portfolio"
          className="text-foreground focus-visible:ring-ring inline-flex min-h-10 items-center rounded-sm text-lg font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {hero.brand}
        </a>

        <nav aria-label="Site navigation">
          <ul className="flex items-center gap-2.5 text-[11px] font-medium sm:gap-6 sm:text-xs">
            {NAV.map(item => {
              const isActive = item.id === active;

              return (
                <li key={item.id}>
                  <a
                    href={withBase(item.href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'focus-visible:ring-ring inline-flex min-h-10 items-center rounded-sm px-1 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      isActive
                        ? 'text-foreground underline decoration-1 underline-offset-4'
                        : 'text-foreground/60 hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
