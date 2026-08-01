import Image from "next/image";
import Link from "next/link";
import type { CategoryIconKey, CategoryItem, HomeContent } from "@/storefront/content/types";
import { CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  MOTION_NORMAL,
  TRANSITION_PANEL,
} from "@/storefront/effects";
import { HomeSectionHeading } from "../HomeSectionHeading";
import { Reveal } from "./Reveal";

type Categories = HomeContent["categories"];

type Theme = {
  glow: string;
  icon: string;
  arrowBg: string;
  arrowFg: string;
};

const THEME: Record<CategoryIconKey, Theme> = {
  windows: {
    glow: "rgba(37,99,235,0.14)",
    icon: "#2563EB",
    arrowBg: "rgba(37,99,235,0.12)",
    arrowFg: "#2563EB",
  },
  office: {
    glow: "rgba(234,88,12,0.14)",
    icon: "#EA580C",
    arrowBg: "rgba(234,88,12,0.12)",
    arrowFg: "#EA580C",
  },
  adobe: {
    glow: "rgba(225,29,72,0.14)",
    icon: "#E11D48",
    arrowBg: "rgba(225,29,72,0.12)",
    arrowFg: "#E11D48",
  },
  cloud: {
    glow: "rgba(2,132,199,0.14)",
    icon: "#0284C7",
    arrowBg: "rgba(2,132,199,0.12)",
    arrowFg: "#0284C7",
  },
  security: {
    glow: "rgba(14,165,164,0.16)",
    icon: "#0EA5A4",
    arrowBg: "rgba(14,165,164,0.14)",
    arrowFg: "#0EA5A4",
  },
  autodesk: {
    glow: "rgba(6,150,215,0.14)",
    icon: "#0696D7",
    arrowBg: "rgba(6,150,215,0.12)",
    arrowFg: "#0696D7",
  },
  backup: {
    glow: "rgba(26,115,232,0.14)",
    icon: "#1A73E8",
    arrowBg: "rgba(26,115,232,0.12)",
    arrowFg: "#1A73E8",
  },
  other: {
    glow: "rgba(71,85,105,0.12)",
    icon: "#475569",
    arrowBg: "rgba(15,23,42,0.08)",
    arrowFg: "#0F172A",
  },
};

function themeFor(item: CategoryItem): Theme {
  const base = THEME[item.icon] ?? THEME.other;
  if (!item.accentColor) return base;
  const c = item.accentColor;
  return {
    glow: hexToRgba(c, 0.14),
    icon: c,
    arrowBg: hexToRgba(c, 0.12),
    arrowFg: c,
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace("#", "").trim();
  if (raw.length !== 3 && raw.length !== 6) {
    return `rgba(14,165,164,${alpha})`;
  }
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : raw;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return `rgba(14,165,164,${alpha})`;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function CategoriesSection({ data }: { data: Categories }) {
  if (!data.visible) return null;

  // Mobile/tablet: 2×3 (6). Desktop: đủ 7 danh mục.
  const mobileItems = data.items.slice(0, 6);
  const desktopItems = data.items.slice(0, 7);

  return (
    <section className="bg-white py-5 md:py-4 lg:py-6">
      <div className="home-container">
        <HomeSectionHeading
          title={data.title}
          viewAllHref={data.viewAllHref}
          viewAllLabel={data.viewAllLabel}
        />

        <Reveal stagger className="grid grid-cols-3 gap-2 sm:gap-2.5 lg:hidden">
          {mobileItems.map((item) => (
            <CategoryCard key={item.id} item={item} size="mobile" />
          ))}
        </Reveal>

        <Reveal stagger className="hidden lg:grid lg:grid-cols-7 lg:gap-2.5">
          {desktopItems.map((item) => (
            <CategoryCard key={item.id} item={item} size="desktop" />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function CategoryCard({
  item,
  size,
}: {
  item: CategoryItem;
  size: "mobile" | "desktop";
}) {
  const theme = themeFor(item);
  const isDesktop = size === "desktop";
  const iconBox = isDesktop ? "h-14 w-14" : "h-12 w-12";

  const cardShell = `group relative flex flex-col items-center overflow-hidden rounded-xl border border-border/80 bg-white text-center ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER}`;

  return (
    <Link
      href={item.href}
      className={
        isDesktop
          ? `${cardShell} px-2.5 py-3.5`
          : `${cardShell} px-1.5 py-3`
      }
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 28%, ${theme.glow}, transparent 68%)`,
        }}
        aria-hidden
      />
      <div className="relative z-[1] flex w-full flex-col items-center">
        <span
          className={`inline-flex ${iconBox} items-center justify-center ${MOTION_NORMAL} transition-transform group-hover:scale-105`}
          style={item.iconUrl ? undefined : { color: theme.icon }}
        >
          {item.iconUrl ? (
            <Image
              src={item.iconUrl}
              alt=""
              width={isDesktop ? 48 : 40}
              height={isDesktop ? 48 : 40}
              className={
                isDesktop
                  ? "h-12 w-12 object-contain"
                  : "h-10 w-10 object-contain"
              }
              unoptimized
            />
          ) : (
            <CategoryIcon icon={item.icon} size={isDesktop ? "lg" : "md"} />
          )}
        </span>
        <h3
          className={`line-clamp-2 w-full ${CARD_TITLE_CLASS} ${
            isDesktop ? "mt-2.5" : "mt-2"
          }`}
        >
          {item.title}
        </h3>
        <p className={`mt-0.5 w-full truncate ${CARD_META_CLASS}`}>
          {item.countLabel}
        </p>
      </div>
    </Link>
  );
}

function CategoryIcon({
  icon,
  size = "sm",
}: {
  icon: CategoryIconKey;
  size?: "sm" | "md" | "lg";
}) {
  const props = {
    className:
      size === "lg" ? "h-12 w-12" : size === "md" ? "h-10 w-10" : "h-8 w-8",
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };
  switch (icon) {
    case "windows":
      return (
        <svg {...props} fill="currentColor">
          <path d="M3 5.5 10.5 4.4v6.7H3V5.5Zm0 7.4h7.5v6.7L3 18.5v-5.6Zm8.7-8.3L21 3v8.1h-9.3V4.6Zm0 9.5H21V21l-9.3-1.3v-5.6Z" />
        </svg>
      );
    case "office":
      return (
        <svg {...props} fill="currentColor">
          <path d="M4 3.5h11.5A1.5 1.5 0 0 1 17 5v14a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 19V5A1.5 1.5 0 0 1 4 3.5Zm2.2 3.2v10.6h2.2V14h2.6c2.2 0 3.5-1.2 3.5-3.1S13.2 7.7 11 7.7H6.2Zm2.2 1.9h2.3c1.1 0 1.7.5 1.7 1.3s-.6 1.3-1.7 1.3H8.4V9.6Z" />
          <path
            d="M17 6.2h3.2A1.3 1.3 0 0 1 21.5 7.5v9a1.3 1.3 0 0 1-1.3 1.3H17"
            opacity="0.35"
          />
        </svg>
      );
    case "adobe":
      return (
        <svg {...props} fill="currentColor">
          <path d="M12 3 4 21h4.2l1.5-3.8h4.6L16 21h4L12 3Zm.1 6.4 1.7 4.4h-3.4l1.7-4.4Z" />
        </svg>
      );
    case "cloud":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7.2 18h9.2a3.8 3.8 0 0 0 .2-7.6 5.2 5.2 0 0 0-10 1.6A3.3 3.3 0 0 0 7.2 18Z" />
        </svg>
      );
    case "security":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3 4.8 6.2v5.2c0 4.3 3.1 7.5 7.2 8.6 4.1-1.1 7.2-4.3 7.2-8.6V6.2L12 3Z" />
          <path
            d="M12 8.2 10.2 13h2.1l-1.1 3.6L15 10.8h-2.2L12 8.2Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "autodesk":
      return (
        <svg {...props} fill="currentColor">
          <path d="M12 3 3.5 21h3.8l1.5-3.6h6.4L16.7 21H20.5L12 3Zm.05 5.2 2.35 5.6h-4.7l2.35-5.6Z" />
        </svg>
      );
    case "backup":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4a7 7 0 0 1 7 7h2.2L17 15.2 12.8 11H15a5 5 0 1 0-4.9 5.9" />
          <path d="M12 8v5l3 2" />
        </svg>
      );
    case "other":
      return (
        <svg {...props} fill="currentColor">
          <circle cx="6" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="18" cy="12" r="1.8" />
        </svg>
      );
  }
}
