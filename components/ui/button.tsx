import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-glow hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:ring-primary",
  secondary:
    "bg-white/10 text-white ring-1 ring-white/20 hover:-translate-y-0.5 hover:bg-white/20 light:bg-slate-900 light:text-white focus-visible:ring-secondary",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-white/10 hover:text-foreground light:hover:bg-slate-900/5 focus-visible:ring-accent",
  outline:
    "bg-transparent text-foreground ring-1 ring-border hover:-translate-y-0.5 hover:bg-white/10 light:hover:bg-slate-900/5 focus-visible:ring-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: BaseProps = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button(props: ButtonProps | LinkButtonProps) {
  if ("href" in props && props.href) {
    const { variant, size, className, children, href, ...anchorProps } = props;
    const isExternal = href.startsWith("http");

    if (isExternal) {
      return (
        <a href={href} className={buttonClasses({ variant, size, className })} target="_blank" rel="noreferrer" {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={buttonClasses({ variant, size, className })} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { variant, size, className, children, ...buttonProps } = props as ButtonProps;

  return (
    <button className={buttonClasses({ variant, size, className })} {...buttonProps}>
      {children}
    </button>
  );
}
