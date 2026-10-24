/// <reference types="astro/client" />

declare module "motion/react" {
  export * from "motion/react-dom";
}

declare module "*.svg" {
  import type { ComponentProps } from "react";
  const content: (props: ComponentProps<"svg">) => React.ReactElement;
  export default content;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}