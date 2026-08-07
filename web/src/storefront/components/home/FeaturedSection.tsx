import Link from "next/link";
import type { FeaturedProduct, HomeContent } from "@/storefront/content/types";
import { ProductCard } from "../ProductCard";
import { HomeSectionHeading } from "../HomeSectionHeading";
import { Reveal } from "./Reveal";
import { BODY_MUTED_CLASS, LINK_ACCENT_CLASS } from "@/storefront/typography";

type Featured = HomeContent["featured"];

/** Always 5-col desktop track so cards stay compact (never stretch to half-width). */
export function FeaturedSection({ data }: { data: Featured }) {
  if (!data.visible) return null;

  const items = data.items.slice(0, 5);

  return (
    <section className="bg-white py-5 md:py-4 lg:py-6">
      <div className="home-container">
        <HomeSectionHeading
          title={data.title}
          viewAllHref={data.viewAllHref}
          viewAllLabel={data.viewAllLabel}
        />

        {items.length === 0 ? (
          <p className={`mt-4 ${BODY_MUTED_CLASS}`}>
            Đang cập nhật sản phẩm.{" "}
            <Link href="/products" className={LINK_ACCENT_CLASS}>
              Xem catalog →
            </Link>
          </p>
        ) : (
          <>
            <div className="-mx-4 px-4 lg:hidden">
              <div className="home-snap-x gap-2.5 pb-1">
                {items.map((item: FeaturedProduct) => (
                  <div
                    key={item.id}
                    className="w-[calc(50vw-1.35rem)] max-w-[200px] md:w-[calc(38vw-1rem)] md:max-w-[210px]"
                  >
                    <ProductCard item={item} compact />
                  </div>
                ))}
              </div>
            </div>

            <Reveal stagger className="hidden lg:grid lg:grid-cols-5 lg:gap-3.5">
              {items.map((item: FeaturedProduct) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
