'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomSheet = DialogPrimitive.Root;
const BottomSheetTrigger = DialogPrimitive.Trigger;
const BottomSheetClose = DialogPrimitive.Close;

const BottomSheetPortal = DialogPrimitive.Portal;

const BottomSheetOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'bg-foreground/30 fixed inset-0 z-50 backdrop-blur-[2px]',
      'data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out',
      className
    )}
    {...props}
  />
));
BottomSheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

type BottomSheetContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  /** Hide the built-in close button when the content provides its own. */
  showClose?: boolean;
};

const BottomSheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  BottomSheetContentProps
>(({ className, children, showClose = true, ...props }, ref) => (
  <BottomSheetPortal>
    <BottomSheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 flex max-h-[88svh] flex-col overflow-hidden',
        'text-foreground rounded-t-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]',
        'shadow-[0_-32px_100px_-48px_rgb(0_0_0/0.45)]',
        'data-[state=open]:animate-sheet-up data-[state=closed]:animate-sheet-down',
        'sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:max-w-[680px] sm:rounded-[28px]',
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="bg-foreground/15 mx-auto mt-3 h-1 w-10 shrink-0 rounded-full sm:hidden"
      />
      {children}
      {showClose && (
        <BottomSheetClose className="bg-background/85 text-foreground/70 hover:text-foreground focus-visible:ring-foreground/35 absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
          <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
          <span className="sr-only">Close</span>
        </BottomSheetClose>
      )}
    </DialogPrimitive.Content>
  </BottomSheetPortal>
));
BottomSheetContent.displayName = DialogPrimitive.Content.displayName;

const BottomSheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-2 text-left', className)} {...props} />
);
BottomSheetHeader.displayName = 'BottomSheetHeader';

const BottomSheetTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'font-display text-foreground text-[clamp(2rem,4.6vw,2.8rem)] leading-[0.95] font-normal tracking-[-0.02em]',
      className
    )}
    {...props}
  />
));
BottomSheetTitle.displayName = DialogPrimitive.Title.displayName;

const BottomSheetDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm leading-relaxed', className)}
    {...props}
  />
));
BottomSheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
  BottomSheet,
  BottomSheetPortal,
  BottomSheetOverlay,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
};
