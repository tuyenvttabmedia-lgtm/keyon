import Link from "next/link";
import { ShopCatalog } from "./ShopCatalog";
import type { ShopCatalogProps } from "./types";
import {
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  STAT_VALUE_CLASS,
} from "@/storefront/typography";

const TRUST = [
  { title: "Giao license", desc: "Theo SLA từng gói", icon: "bolt" as const },
  { title: "Chính hãng", desc: "Nguồn cung rõ", icon: "check" as const },
  { title: "Thanh toán an toàn", desc: "QR / chuyển khoản", icon: "lock" as const },
  { title: "Hỗ trợ kích hoạt", desc: "Ticket trong Tài khoản", icon: "support" as const },
];

const STATS = [
  { value: "Instant", label: "Giao key tự động khi còn tồn", icon: "grid" as const },
  { value: "Manual", label: "Ops xử lý khi cần kiểm tra", icon: "shield" as const },
  { value: "Portal", label: "License lưu trong Tài khoản", icon: "clock" as const },
  { value: "Ticket", label: "Hỗ trợ kích hoạt có lịch sử", icon: "headset" as const },
];

export function ShopView(props: ShopCatalogProps) {
  return (
    <div>
      <section className="border-b border-border bg-white">
        <div className="home-container py-6 md:py-8">
          <nav className={BREADCRUMB_CLASS} aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition hover:text-accent">
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li className={BREADCRUMB_CURRENT_CLASS}>Sản phẩm</li>
            </ol>
          </nav>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className={PAGE_TITLE_CLASS}>Cửa hàng</h1>
              <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
                Bản quyền chính hãng — Giao license tức thì — Giá tốt nhất
              </p>
            </div>
            {/* Mockup shop-desktop: khung xám · grid-cols-2 · gạch dọc/ngang giữa các ô */}
            <div className="w-full overflow-hidden rounded-2xl bg-surface lg:max-w-xl">
              <ul className="grid grid-cols-2 sm:grid-cols-4">
                {TRUST.map((t, i) => (
                  <li
                    key={t.title}
                    className={`flex items-start gap-2 px-3 py-3 sm:px-3.5 sm:py-3.5 ${trustCellBorder(i)}`}
                  >
                    <span className="mt-0.5 inline-flex shrink-0 text-accent">
                      <TrustIcon name={t.icon} />
                    </span>
                    <span className="min-w-0">
                      <span className={`block leading-snug ${CARD_TITLE_CLASS}`}>{t.title}</span>
                      <span className={`mt-0.5 block leading-snug ${CARD_META_CLASS}`}>
                        {t.desc}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ShopCatalog {...props} />

      {/* Standalone stats band — same shell as Home CtaBanner (rounded navy card, not footer) */}
      <section className="bg-white pb-7 pt-4 md:pb-6 md:pt-3 lg:pb-10 lg:pt-4">
        <div className="home-container">
          <div className="rounded-2xl bg-footer px-4 py-6 text-white sm:px-5 md:px-6 md:py-7">
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-0 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-start gap-3 sm:px-4 sm:py-1 lg:px-6 first:lg:pl-2 last:lg:pr-2"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent">
                    <StatIcon name={s.icon} />
                  </span>
                  <div>
                    <p className={`${STAT_VALUE_CLASS} !text-white`}>{s.value}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-300">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function trustCellBorder(index: number): string {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return [
    // mobile 2×2
    col === 0 ? "border-r border-border" : "",
    row === 0 ? "border-b border-border sm:border-b-0" : "",
    // sm+ row of 4
    index < TRUST.length - 1 ? "sm:border-r" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function TrustIcon({ name }: { name: "bolt" | "check" | "lock" | "support" }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    "aria-hidden": true as const,
  };
  if (name === "bolt") return <svg {...props}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>;
  if (name === "check") return <svg {...props}><path d="M20 6 9 17l-5-5" /></svg>;
  if (name === "lock") return <svg {...props}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
  return (
    <svg {...props}>
      <path d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2" />
      <path d="M4.5 13.5a2 2 0 0 0 2 2H8v-5H6.5a2 2 0 0 0-2 2v1Z" />
      <path d="M19.5 13.5a2 2 0 0 1-2 2H16v-5h1.5a2 2 0 0 1 2 2v1Z" />
    </svg>
  );
}

function StatIcon({ name }: { name: "grid" | "shield" | "clock" | "headset" }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    "aria-hidden": true as const,
  };
  if (name === "grid") {
    return (
      <svg {...props} fill="currentColor" stroke="none">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </svg>
    );
  }
  if (name === "shield") return <svg {...props}><path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" /><path d="m9 12 2 2 4-4" /></svg>;
  if (name === "clock") return <svg {...props}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2.5" /></svg>;
  return (
    <svg {...props}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2v1Z" />
      <path d="M20 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1Z" />
    </svg>
  );
}
