import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Check,
  Headphones,
  KeyRound,
  LayoutGrid,
  Package,
  ShieldCheck,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  PAGE_LEAD_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  ELEVATION_NONE,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { SolutionFinalCta } from "./SolutionFinalCta";

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };

const HERO_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Một nơi sau mua",
    body: "License đã thanh toán nằm trong Tài khoản → Tài sản.",
    Icon: LayoutGrid,
  },
  {
    title: "Hạn dùng rõ",
    body: "Xem trạng thái và ngày hết hạn từng bản quyền đã nhận.",
    Icon: BarChart3,
  },
  {
    title: "Chủ động gia hạn",
    body: "Mua lại trên catalog hoặc gửi báo giá khi cần số lượng lớn.",
    Icon: Bell,
  },
  {
    title: "Key có kiểm soát",
    body: "Xem key sau khi xác minh email — không lộ trên email thông báo.",
    Icon: KeyRound,
  },
];

const FEATURES: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Danh sách trong Tài sản",
    body: "Lọc đang dùng / chờ / hết hạn — đối chiếu nhanh sau đăng nhập.",
    Icon: LayoutGrid,
  },
  {
    title: "Trạng thái & hạn dùng",
    body: "Mỗi license gắn ngày hết hạn khi có — không phải SAM phòng ban đầy đủ.",
    Icon: BarChart3,
  },
  {
    title: "Gia hạn qua mua lại / báo giá",
    body: "Không tự trừ tiền renew. Tiếp tục trên shop hoặc form báo giá doanh nghiệp.",
    Icon: Package,
  },
  {
    title: "Bảo vệ khi xem key",
    body: "Cần xác minh email trước khi hiện payload — giảm rủi ro lộ license.",
    Icon: ShieldCheck,
  },
];

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Mua & nhận license",
    body: "Sau thanh toán, deliverable vào Tài khoản (Đơn hàng / Tài sản).",
  },
  {
    n: "02",
    title: "Theo dõi trong Tài sản",
    body: "Xem sản phẩm, trạng thái và hạn dùng đã ghi nhận.",
  },
  {
    n: "03",
    title: "Chủ động trước hạn",
    body: "Dựa vào hạn dùng trên Tài khoản để quyết định gia hạn kịp thời.",
  },
  {
    n: "04",
    title: "Gia hạn hoặc báo giá",
    body: "Mua lại đúng SKU trên catalog, hoặc gửi yêu cầu khi cần số lượng lớn.",
  },
];

type BrandId = "m365" | "windows" | "adobe" | "acronis" | "autodesk";

const BRANDS: {
  id: BrandId;
  name: string;
  body: string;
  href: string;
}[] = [
  {
    id: "m365",
    name: "Microsoft 365",
    body: "Mua gói trên catalog — theo dõi hạn trong Tài sản.",
    href: "/products?q=microsoft+365",
  },
  {
    id: "windows",
    name: "Windows",
    body: "License OS theo biến thể — nhận sau thanh toán.",
    href: "/products?q=windows",
  },
  {
    id: "adobe",
    name: "Adobe",
    body: "Creative Cloud và ứng dụng — gia hạn bằng mua lại / báo giá.",
    href: "/products?q=adobe",
  },
  {
    id: "acronis",
    name: "Acronis",
    body: "License backup / protect — kích hoạt trên hạ tầng của bạn.",
    href: "/products?q=acronis",
  },
  {
    id: "autodesk",
    name: "Autodesk",
    body: "Subscription thiết kế — theo dõi hạn trên Tài khoản.",
    href: "/products?q=autodesk",
  },
];

export type HeroAssetPreview = {
  id: string;
  name: string;
  meta: string;
  status: "active" | "pending" | "expiring" | "expired";
};

export function LicenseManagementSolutionLanding({
  loggedIn = false,
  assets = [],
}: {
  loggedIn?: boolean;
  /** Session-scoped deliveries only — never admin stock / other accounts. */
  assets?: HeroAssetPreview[];
}) {
  return (
    <div className="bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(14,165,164,0.07),transparent_55%)]"
          aria-hidden
        />
        <div className="home-container relative py-8 md:py-10 lg:py-11">
          <nav
            className={`mb-6 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}
          >
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <Link href="/solutions" className={HOVER_LINK_ACCENT}>
              Giải pháp
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Quản lý bản quyền</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
            <div className="min-w-0">
              <h1 className={`max-w-[20ch] ${HERO_TITLE_CLASS}`}>
                License đã mua — xem rõ trong Tài khoản KEYON
              </h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                Sau thanh toán, bản quyền nằm ở Tài sản: trạng thái, hạn dùng và key
                (sau xác minh email). Không phải SAM phòng ban hay gia hạn tự động trừ tiền.
              </p>

              <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
                {HERO_POINTS.map((p) => (
                  <li key={p.title} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <p.Icon {...ICON_SM} />
                    </span>
                    <div className="min-w-0">
                      <p className={CARD_TITLE_CLASS}>{p.title}</p>
                      <p className={`mt-0.5 ${BODY_MUTED_CLASS}`}>{p.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/account/assets"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  {loggedIn ? "Xem Tài sản của tôi →" : "Mở Tài sản KEYON →"}
                </Link>
                <Link
                  href="/contact/quote"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-accent/40 bg-white px-6 ${CTA_LABEL_CLASS} text-accent ${TRANSITION_UI} hover:border-accent hover:bg-accent-soft`}
                >
                  <Headphones {...ICON_SM} />
                  Gửi yêu cầu tư vấn
                </Link>
              </div>
            </div>

            <AssetsHeroArt loggedIn={loggedIn} assets={assets} />
          </div>
        </div>
      </section>

      <section className="py-9 md:py-11">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Bạn quản lý được gì trên KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Đúng phạm vi Tài khoản — không hứa công cụ quản trị license nội bộ đầy đủ.
            </p>
          </header>

          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <f.Icon size={20} strokeWidth={1.8} />
                  </span>
                  <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{f.title}</h3>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{f.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-border bg-[#F7FAFC] py-9 md:py-11">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình trong 4 bước</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Từ mua hàng đến theo dõi và gia hạn — khớp checkout và Tài khoản đang chạy.
            </p>
          </header>

          <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_NONE}`}
              >
                <p className={`${BADGE_CLASS} text-accent`}>{s.n}</p>
                <h3 className={`mt-2 ${CARD_TITLE_CLASS}`}>{s.title}</h3>
                <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-9 md:py-11">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Bản quyền phổ biến trên catalog</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Mua trên KEYON rồi theo dõi trong Tài sản — không phải phân bổ seat nội bộ.
            </p>
          </header>

          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {BRANDS.map((b) => (
              <li key={b.id}>
                <Link
                  href={b.href}
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <BrandMark brand={b.id} size={40} />
                  <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{b.name}</h3>
                  <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{b.body}</p>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/products"
                className={`flex h-full flex-col items-start justify-between rounded-2xl border border-dashed border-accent/40 bg-accent-soft/40 p-4 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-accent"
                  aria-hidden
                >
                  <LayoutGrid size={20} strokeWidth={1.8} />
                </span>
                <div className="mt-3">
                  <p className={`${CARD_TITLE_CLASS} text-accent`}>Xem tất cả</p>
                  <p className={`mt-1 ${CARD_META_CLASS}`}>
                    Toàn bộ catalog bản quyền
                  </p>
                </div>
                <span className={`mt-3 ${LINK_ACCENT_CLASS}`}>Duyệt sản phẩm →</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <SolutionFinalCta
        title="Sẵn sàng theo dõi license đã mua?"
        subtitle="Mở Tài sản trong Tài khoản KEYON, hoặc gửi báo giá khi cần mua số lượng lớn."
        primaryHref="/account/assets"
        primaryLabel={loggedIn ? "Xem Tài sản của tôi →" : "Mở Tài sản KEYON →"}
        secondaryHref="/contact/quote"
        secondaryLabel="Gửi yêu cầu tư vấn →"
      />
    </div>
  );
}

const STATUS_UI = {
  active: { label: "Đang dùng", tone: "bg-accent-soft text-accent" },
  pending: { label: "Chờ xử lý", tone: "bg-slate-100 text-slate-700" },
  expiring: { label: "Sắp hết hạn", tone: "bg-amber-100 text-amber-800" },
  expired: { label: "Hết hạn", tone: "bg-rose-100 text-rose-700" },
} as const;

/** Guest = CTA panel. Signed-in = that session's deliveries only. */
function AssetsHeroArt({
  loggedIn,
  assets,
}: {
  loggedIn: boolean;
  assets: HeroAssetPreview[];
}) {
  if (loggedIn) {
    if (assets.length === 0) {
      return (
        <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
          <div
            className={`relative rounded-2xl border border-border bg-white p-5 sm:p-6 ${ELEVATION_HAIRLINE}`}
          >
            <p
              className={`${BADGE_CLASS} inline-flex rounded-md bg-accent-soft px-2 py-1 font-semibold text-accent`}
            >
              Tài sản
            </p>
            <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>
              Chưa có license trong tài khoản
            </h3>
            <p className={`mt-2 ${BODY_MUTED_CLASS}`}>
              Sau thanh toán, bản quyền đã giao sẽ hiện tại đây — kèm trạng thái và
              hạn dùng.
            </p>
            <Link
              href="/products"
              className={`mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Duyệt sản phẩm →
            </Link>
            <p className={`mt-3 ${CARD_META_CLASS}`}>
              Hoặc mở{" "}
              <Link href="/account/assets" className={HOVER_LINK_ACCENT}>
                Tài sản
              </Link>{" "}
              để xem toàn bộ sau khi mua.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
        <div
          className={`relative rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_HAIRLINE}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className={CARD_TITLE_CLASS}>Tài sản</p>
              <p className={CARD_META_CLASS}>License đã giao trên tài khoản này</p>
            </div>
            <span
              className={`${BADGE_CLASS} rounded-md bg-accent-soft px-2 py-1 font-semibold text-accent`}
            >
              Đã đăng nhập
            </span>
          </div>

          <ul className="mt-4 space-y-2">
            {assets.map((r) => {
              const ui = STATUS_UI[r.status];
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[#F7FAFC] px-3 py-2.5"
                >
                  <span className="min-w-0">
                    <span className={`block truncate ${CARD_TITLE_CLASS}`}>
                      {r.name}
                    </span>
                    <span className={`block ${CARD_META_CLASS}`}>{r.meta}</span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 ${BADGE_CLASS} font-semibold ${ui.tone}`}
                  >
                    {ui.label}
                  </span>
                </li>
              );
            })}
          </ul>

          <Link
            href="/account/assets"
            className={`mt-4 inline-flex w-full items-center justify-center ${LINK_ACCENT_CLASS}`}
          >
            Xem tất cả trong Tài sản →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
      <div
        className={`relative rounded-2xl border border-border bg-white p-5 sm:p-6 ${ELEVATION_HAIRLINE}`}
      >
        <p
          className={`${BADGE_CLASS} inline-flex rounded-md bg-accent-soft px-2 py-1 font-semibold text-accent`}
        >
          Tài sản KEYON
        </p>
        <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>
          Theo dõi license sau khi mua
        </h3>
        <p className={`mt-2 ${BODY_MUTED_CLASS}`}>
          Đăng nhập để xem bản quyền đã giao: trạng thái, hạn dùng và key (sau xác
          minh email).
        </p>

        <ul className="mt-4 space-y-2.5">
          {[
            "Danh sách license gắn với tài khoản của bạn",
            "Trạng thái đang dùng / sắp hết hạn / hết hạn",
            "Mở key an toàn sau khi xác minh email",
          ].map((line) => (
            <li key={line} className={`flex items-start gap-2 ${BODY_MUTED_CLASS}`}>
              <Check
                size={14}
                className="mt-0.5 shrink-0 text-accent"
                strokeWidth={2.4}
                aria-hidden
              />
              {line}
            </li>
          ))}
        </ul>

        <Link
          href="/login"
          className={`mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
        >
          Đăng nhập để xem Tài sản →
        </Link>
        <p className={`mt-3 text-center ${CARD_META_CLASS}`}>
          Chưa có tài khoản?{" "}
          <Link href="/register" className={HOVER_LINK_ACCENT}>
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

function BrandMark({ brand, size = 40 }: { brand: BrandId; size?: number }) {
  if (brand === "windows") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#0078D4"
          d="M3 5.5 11 4.3v7.2H3V5.5Zm9-.9 9-1.3v9.4h-9V4.6ZM3 13.5h8V21l-8-1.2v-6.3Zm9 0h9v8.7l-9-1.3v-7.4Z"
        />
      </svg>
    );
  }
  if (brand === "m365") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path fill="#D83B01" d="M3 4.5 14 2v20L3 19.5V4.5Z" />
        <path fill="#A4262C" d="M14 2h7v20h-7V2Z" opacity="0.85" />
        <path
          fill="#fff"
          d="M6.2 8.2h5.2v1.4H8.1v1.6h3v1.3H8.1v1.8h3.4v1.4H6.2V8.2Z"
        />
      </svg>
    );
  }
  if (brand === "adobe") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="5" fill="#EB1000" />
        <path
          fill="#fff"
          d="M8.2 17.5 12 6.5l3.8 11H14l-.7-2.1H10.7l-.7 2.1H8.2Zm3-7.8-.95 2.9h1.9L11.2 9.7Z"
        />
      </svg>
    );
  }
  if (brand === "acronis") {
    return (
      <span
        className="inline-flex items-center justify-center rounded-lg bg-[#1A73E8] font-display text-xs font-bold text-white"
        style={{ width: size, height: size }}
        aria-hidden
      >
        AC
      </span>
    );
  }
  if (brand === "autodesk") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="5" fill="#0696D7" />
        <path
          fill="#fff"
          d="M5 17.5 10.2 6.5h3.2L18.6 17.5h-3.1l-.9-2.2H9l-.9 2.2H5Zm4.8-4.4h3.8l-1.9-4.6-1.9 4.6Z"
        />
      </svg>
    );
  }
  return null;
}
