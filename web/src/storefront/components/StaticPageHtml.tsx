"use client";

import { useMemo } from "react";
import { isHtmlBody, legacyBodyToHtml } from "@/server/cms/blog-utils";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";

/** Sanitize TipTap HTML for static / policy pages (Node-safe). */
export function StaticPageHtml({
  body,
  className,
}: {
  body: string;
  className?: string;
}) {
  const html = useMemo(
    () =>
      sanitizeBlogHtml(isHtmlBody(body) ? body : legacyBodyToHtml(body)),
    [body],
  );

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
