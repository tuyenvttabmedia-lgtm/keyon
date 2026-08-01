import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, className, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
    ...rest,
  };
}

export function IconKey(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="14" r="3.5" />
      <path d="M11 12.5 20 3.5" />
      <path d="M16.5 7 19 9.5" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export function IconBolt(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

export function IconReceipt(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 3.5h12v17l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2V3.5Z" />
      <path d="M9 8h6M9 12h6M9 16h3.5" />
    </svg>
  );
}

export function IconShuffle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M16 4h4v4" />
      <path d="M20 4 13 11" />
      <path d="M4 9h5.5" />
      <path d="M4 15h5.5L20 20" />
      <path d="M16 20h4v-4" />
    </svg>
  );
}

export function IconFolder(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 8.5V18a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-6.2L10 5.5H5.5a2 2 0 0 0-2 2v1Z" />
    </svg>
  );
}

export function IconCart(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
      <path d="M3.5 4.5h2l2.2 10.2h9.6l1.8-7.2H7.2" />
    </svg>
  );
}

export function IconCard(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 14.5h4" />
    </svg>
  );
}

export function IconPackage(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" />
      <path d="M12 12v9" />
      <path d="M20 7.5 12 12 4 7.5" />
    </svg>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20.5h16" />
      <path d="M6 20.5V6.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
      <path d="M9 9.5h2M13 9.5h2M9 13h2M13 13h2M9 16.5h2M13 16.5h2" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="2.75" />
      <circle cx="16.5" cy="9" r="2.25" />
      <path d="M3.5 18.5a5.5 5.5 0 0 1 11 0" />
      <path d="M14 18.5a4.5 4.5 0 0 1 6.5 0" />
    </svg>
  );
}

export function IconShieldCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 2" />
    </svg>
  );
}

export function IconHeadset(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2" />
      <path d="M4.5 13.5a2 2 0 0 0 2 2H8v-5H6.5a2 2 0 0 0-2 2v1Z" />
      <path d="M19.5 13.5a2 2 0 0 1-2 2H16v-5h1.5a2 2 0 0 1 2 2v1Z" />
    </svg>
  );
}

export function IconQr(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 4h6v6H4V4Z" />
      <path d="M14 4h6v6h-6V4Z" />
      <path d="M4 14h6v6H4v-6Z" />
      <path d="M14 14h2v2h-2v-2Z" />
      <path d="M18 14h2v2h-2v-2Z" />
      <path d="M14 18h2v2h-2v-2Z" />
      <path d="M18 18h2v2h-2v-2Z" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconTruck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 7.5h11v9H3v-9Z" />
      <path d="M14 10.5h4.5L21 14v2.5h-7v-6Z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

export function IconBadgeCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 14.2 5.5 17.5 5l.8 3.3L21 10l-1.5 3 1.5 3-2.7 1.7L17.5 21 14.2 20.5 12 23l-2.2-2.5L6.5 21l-.8-3.3L3 16l1.5-3L3 10l2.7-1.7L6.5 5l3.3.5L12 3Z" />
      <path d="m9.5 12 1.8 1.8 3.5-3.5" />
    </svg>
  );
}

/** Teal soft tile behind icons — shared storefront language */
export function IconTile({
  children,
  className = "",
  tone = "accent",
}: {
  children: ReactNode;
  className?: string;
  tone?: "accent" | "navy" | "soft";
}) {
  const tones = {
    accent: "bg-accent-soft text-accent",
    navy: "bg-navy-soft text-navy",
    soft: "bg-white/80 text-accent shadow-sm ring-1 ring-border/70",
  };
  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
