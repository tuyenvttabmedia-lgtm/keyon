import type { ReactNode } from "react";

type Variant = "white" | "muted" | "soft" | "accent";

type Props = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  contained?: boolean;
  id?: string;
};

/** Clean section shells — solid surfaces only (no mesh/orb noise). */
export function SectionSurface({
  children,
  variant = "white",
  className = "",
  contained = true,
  id,
}: Props) {
  const bg =
    variant === "white"
      ? "bg-white"
      : variant === "muted"
        ? "bg-navy-soft"
        : variant === "soft"
          ? "bg-[#f8fafc]"
          : "bg-accent-soft";

  return (
    <section id={id} className={`relative ${bg} ${className}`}>
      {contained ? (
        <div className="home-container">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
