import type { FeaturedProduct, HomeContent } from "@/storefront/content/types";
import { ProductCard } from "../ProductCard";
import { HomeSectionHeading } from "../HomeSectionHeading";
import { Reveal } from "./Reveal";

type Featured = HomeContent["featured"];

export function FeaturedSection({ data }: { data: Featured }) {
  if (!data.visible) return null;

  const items = data.items.slice(0, 5);
  const desktopCols =
    items.length >= 5
      ? "lg:grid-cols-5"
      : items.length === 4
        ? "lg:grid-cols-4"
        : items.length === 3
          ? "lg:grid-cols-3"
          : "lg:grid-cols-2";

  return (
    <section className="bg-white py-5 md:py-4 lg:py-6">
      <div className="home-container">
        <HomeSectionHeading
          title={data.title}
          viewAllHref={data.viewAllHref}
          viewAllLabel={data.viewAllLabel}
        />

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

        <Reveal stagger className={`hidden lg:grid lg:gap-3.5 ${desktopCols}`}>
          {items.map((item: FeaturedProduct) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
