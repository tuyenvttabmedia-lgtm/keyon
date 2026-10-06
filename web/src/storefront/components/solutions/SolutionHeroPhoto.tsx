import Image from "next/image";

/** Desktop hero photo, right 54% of the 1200px container. Mobile stays hidden. */
export function SolutionHeroPhoto({ src }: { src?: string }) {
  const url = src?.trim();
  if (!url) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] overflow-hidden lg:block"
    >
      <Image
        src={url}
        alt=""
        fill
        priority
        sizes="(min-width: 1200px) 680px, 54vw"
        className="object-cover object-center"
      />
    </div>
  );
}
