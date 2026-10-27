import { cn } from '@/lib/utils';
import { hero } from '@/content/hero';

const NAV = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
];

export function BlogHeader() {
  return (
    <header className="bg-background/85 sticky top-0 z-40 border-b border-[var(--color-border)] backdrop-blur-xl">
      <div
        data-reveal-static=""
        className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-4 px-6 md:h-[76px] md:px-10 lg:px-16"
      >
        <a
          href="/"
          aria-label="Rizky Maulana, back to portfolio"
          className="text-foreground focus-visible:ring-ring inline-flex min-h-10 items-center rounded-sm text-lg font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {hero.brand}
        </a>

        <nav aria-label="Blog navigation">
          <ul className="flex items-center gap-2.5 text-[11px] font-medium sm:gap-6 sm:text-xs">
            {NAV.map(item => {
              const active = item.href === '/blog';

              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'focus-visible:ring-ring inline-flex min-h-10 items-center rounded-sm px-1 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      active
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
