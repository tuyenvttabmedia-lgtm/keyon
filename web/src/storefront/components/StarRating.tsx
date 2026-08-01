/** Star rating display — amber stars + optional review count. */
export function StarRating({
  rating,
  reviewCount,
  size = "md",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}) {
  const filled = Math.round(Math.min(5, Math.max(0, rating)));
  const starClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const textClass = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <div className="flex items-center gap-1.5" aria-label={`Đánh giá ${filled} trên 5`}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={starClass}
            viewBox="0 0 20 20"
            fill={i < filled ? "#F59E0B" : "#E2E8F0"}
          >
            <path d="M10 1.5 12.7 7l6 .9-4.3 4.2 1 5.9L10 15.2 4.6 18l1-5.9L1.3 7.9l6-.9L10 1.5Z" />
          </svg>
        ))}
      </div>
      {typeof reviewCount === "number" ? (
        <span className={`tabular-nums text-muted-soft ${textClass}`}>
          ({reviewCount.toLocaleString("vi-VN")})
        </span>
      ) : null}
    </div>
  );
}
