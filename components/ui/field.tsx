import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FieldBaseProps = {
  label: string;
  error?: string;
};

export function InputField({
  label,
  error,
  className,
  id,
  ...props
}: FieldBaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const inputId = id ?? props.name ?? label;

  return (
    <label className="group relative block">
      <input
        id={inputId}
        placeholder=" "
        className={cn(
          "peer h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pt-4 text-sm text-foreground outline-none transition focus:border-primary focus:bg-white/10 light:border-slate-200 light:bg-white light:focus:bg-white",
          error && "border-red-400 focus:border-red-400",
          className,
        )}
        {...props}
      />
      <span className="pointer-events-none absolute left-4 top-4 text-sm text-muted-foreground transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
        {label}
      </span>
      {error ? <span className="mt-2 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

export function TextareaField({
  label,
  error,
  className,
  id,
  ...props
}: FieldBaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = id ?? props.name ?? label;

  return (
    <label className="group relative block">
      <textarea
        id={inputId}
        placeholder=" "
        className={cn(
          "peer min-h-36 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 pt-6 text-sm text-foreground outline-none transition focus:border-primary focus:bg-white/10 light:border-slate-200 light:bg-white light:focus:bg-white",
          error && "border-red-400 focus:border-red-400",
          className,
        )}
        {...props}
      />
      <span className="pointer-events-none absolute left-4 top-4 text-sm text-muted-foreground transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
        {label}
      </span>
      {error ? <span className="mt-2 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}
