import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[#b94725] via-[#e8753e] to-[#f4c16d] text-primary-foreground hover:bg-primary",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        tertiary:
          "text-[#000] hover:bg-gradient-to-br from-[#b94725] via-[#e8753e] to-[#f4c16d] hover:text-primary-foreground transition-all duration-200",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

import Link from "next/link";

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  iconName?: string | React.ReactNode;
  asChild?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  React.ComponentProps<"button"> & {
    as?: "button";
  };

type ButtonAsLink = ButtonBaseProps &
  React.ComponentProps<typeof Link> & {
    as: "link";
  };

type ButtonAsExternal = ButtonBaseProps &
  React.ComponentProps<"a"> & {
    as: "a";
  };

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsExternal;

function Button({
  className,
  variant,
  size,
  iconName,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const LucideIcon =
    typeof iconName === "string"
      ? (
          LucideIcons as unknown as Record<
            string,
            React.ComponentType<LucideProps>
          >
        )[iconName] ?? null
      : null;

  const content = (
    <>
      {/* icon on the left */}
      {(LucideIcon || (iconName && typeof iconName !== "string")) && (
        <span aria-hidden="true" className="inline-flex items-center">
          {LucideIcon ? <LucideIcon /> : iconName}
        </span>
      )}

      {/* button label */}
      {children}
    </>
  );

  const commonClasses = cn(
    buttonVariants({ variant, size }),
    className,
    "cursor-pointer"
  );

  if (props.as === "link") {
    const { as, ...linkProps } = props as ButtonAsLink;
    return (
      <Link className={commonClasses} {...linkProps}>
        {content}
      </Link>
    );
  }

  if (props.as === "a") {
    const { as, ...anchorProps } = props as ButtonAsExternal;
    return (
      <a className={commonClasses} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { as, ...buttonProps } = props as ButtonAsButton;
  return (
    <Comp data-slot="button" className={commonClasses} {...buttonProps}>
      {content}
    </Comp>
  );
}

export { Button, buttonVariants };
