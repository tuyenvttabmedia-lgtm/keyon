"use client";

import { useMemo } from "react";
import { isHtmlBody, legacyBodyToHtml } from "@/server/cms/blog-utils";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";

/** Client-side sanitize — isomorphic-dompurify/jsdom is not safe on Node 20 SSR. */
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
