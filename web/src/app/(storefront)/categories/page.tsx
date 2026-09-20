import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/storefront/components/shop/shop-utils";
import type { ShopCategoryId } from "@/storefront/components/shop/types";
import {
  categoryHref,
  loadShopCatalog,
} from "@/storefront/lib/shop-catalog";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import {
  BODY_MUTED_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  CARD_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_HAIRLINE, HOVER_LIFT_CARD, TRANSITION_UI } from "@/storefront/effects";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/categories");
}

export default async function CategoriesIndexPage() {
  const { categories } = await loadShopCatalog();
  const byId = new Map(categories.map((c) => [c.id, c.count]));
  const list = PRODUCT_CATEGORY_KEYS.filter((id) => id !== "other").map(
    (id) => ({
      id: id as ShopCategoryId,
      title: CATEGORY_LABELS[id as ShopCategoryId],
      count: byId.get(id as ShopCategoryId) ?? 0,
    }),
  );

  return (
    <div className="home-container py-10 md:py-14">
      <h1 className={PAGE_TITLE_CLASS}>Danh mục sản phẩm</h1>
      <p className={`mt-3 max-w-2xl ${SECTION_LEAD_CLASS}`}>
        Chọn nhóm phần mềm bản quyền chính hãng trên KEYON — xem giá và nhận
        license trong Tài khoản.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <li key={c.id}>
            <Link
              href={categoryHref(c.id)}
              className={`block rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${HOVER_LIFT_CARD} ${TRANSITION_UI}`}
            >
              <span className={CARD_TITLE_CLASS}>{c.title}</span>
              <span className={`mt-1 block ${BODY_MUTED_CLASS}`}>
                {c.count > 0 ? `${c.count} sản phẩm` : "Đang cập nhật"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className={`mt-8 ${BODY_MUTED_CLASS}`}>
        <Link href="/products" className="text-accent hover:underline">
          Xem toàn bộ catalog →
        </Link>
      </p>
    </div>
  );
}
