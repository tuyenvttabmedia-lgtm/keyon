import Link from "next/link";
import { AboutHeroVisual } from "@/storefront/components/about/AboutHeroVisual";
import {
  IconBuilding,
  IconCard,
  IconCart,
  IconFolder,
  IconKey,
  IconPackage,
  IconReceipt,
  IconShuffle,
  IconTile,
  IconUser,
  IconUsers,
} from "@/storefront/components/icons/StoreIcons";
import { StoreButton } from "@/storefront/components/StoreButton";
import { SectionSurface } from "@/storefront/components/ui/SectionSurface";
import { CARD_TITLE_CLASS, PAGE_TITLE_CLASS, SECTION_TITLE_CLASS, SUBSECTION_TITLE_CLASS } from "@/storefront/typography";

/**
 * About — aligned to about-locked.png
 * Fewer sections, flat surfaces, no decorative noise.
 */
export default function AboutPage() {
  return (
    <div className="bg-white">
      <SectionSurface variant="white" className="border-b border-border py-10 md:py-14">
        <nav className="text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent">
            Trang chủ
          </Link>
          <span className="mx-2 text-border">›</span>
          <span className="text-navy">Về KEYON</span>
        </nav>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h1 className={PAGE_TITLE_CLASS}>
              Về KEYON
            </h1>
            <p className="mt-3 text-lg font-medium leading-snug text-navy">
              Digital License Platform — mua, nhận đúng loại, quản lý giấy phép phần mềm trong
              một nơi.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              KEYON giúp bạn mua đúng gói bản quyền số (key / tài khoản / kích hoạt) và giữ mọi
              giấy phép trong Tài khoản — thanh toán và giao hàng luôn tách biệt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <StoreButton href="/products">Khám phá sản phẩm</StoreButton>
              <StoreButton href="/faq" variant="secondary">
                Câu hỏi thường gặp
              </StoreButton>
            </div>
          </div>
          <AboutHeroVisual />
        </div>
      </SectionSurface>

      <SectionSurface variant="soft" className="border-b border-border py-12 md:py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Minh bạch thanh toán & giao hàng",
              body: "Giá rõ. Thanh toán thành công ≠ đã giao — theo dõi tách biệt trên đơn hàng.",
              Icon: IconReceipt,
            },
            {
              title: "Đúng loại nhận",
              body: "Mỗi gói ghi rõ nhận key, tài khoản hay kích hoạt trước khi bạn mua.",
              Icon: IconKey,
            },
            {
              title: "Tài sản nằm trong Tài khoản",
              body: "Giấy phép lưu sau khi giao — mở lại mọi lúc, gửi lại trong hạn mức.",
              Icon: IconFolder,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <IconTile>
                <item.Icon size={20} />
              </IconTile>
              <h2 className={`mt-4 ${CARD_TITLE_CLASS}`}>
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionSurface>

      <SectionSurface variant="white" className="border-b border-border py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className={SECTION_TITLE_CLASS}>
              Chúng tôi làm gì
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              Kết nối nguồn cung giấy phép với người mua, chuẩn hóa thông tin gói và giao đúng vào
              Tài khoản — không gộp “đã trả tiền” với “đã nhận hàng”.
            </p>
            <ol className="mt-8 grid grid-cols-4 gap-3">
              {[
                { label: "Mua", Icon: IconCart },
                { label: "Thanh toán", Icon: IconCard },
                { label: "Giao", Icon: IconPackage },
                { label: "Tài sản", Icon: IconFolder },
              ].map((step, i) => (
                <li key={step.label} className="text-center">
                  <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <step.Icon size={20} />
                  </span>
                  <p className="mt-2 text-xs font-semibold text-navy sm:text-sm">
                    {i + 1}. {step.label}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className={SECTION_TITLE_CLASS}>
              Dành cho ai
            </h2>
            <ul className="mt-5 space-y-3">
              {[
                {
                  title: "Cá nhân",
                  body: "Mua Office, Windows, bảo mật… giữ giấy phép trong một tài khoản.",
                  Icon: IconUser,
                },
                {
                  title: "Doanh nghiệp nhỏ",
                  body: "Theo dõi đơn, trạng thái giao và tài sản theo từng gói.",
                  Icon: IconBuilding,
                },
                {
                  title: "Đội vận hành",
                  body: "Thanh toán / giao hàng tách bạch — dễ hỗ trợ khách.",
                  Icon: IconUsers,
                },
              ].map((a) => (
                <li
                  key={a.title}
                  className="flex gap-3 rounded-xl border border-border bg-[#f8fafc] px-4 py-3.5"
                >
                  <IconTile tone="navy" className="h-10 w-10">
                    <a.Icon size={18} />
                  </IconTile>
                  <div>
                    <p className="text-sm font-semibold text-navy">{a.title}</p>
                    <p className="mt-1 text-sm text-muted">{a.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionSurface>

      <SectionSurface variant="accent" contained={false}>
        <div className="home-container flex flex-col items-start justify-between gap-4 py-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <IconTile tone="soft">
              <IconShuffle size={18} />
            </IconTile>
            <p className={SUBSECTION_TITLE_CLASS}>
              Sẵn sàng tìm giấy phép phù hợp?
            </p>
          </div>
          <StoreButton href="/products">Khám phá sản phẩm →</StoreButton>
        </div>
      </SectionSurface>
    </div>
  );
}
