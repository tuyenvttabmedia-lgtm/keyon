import {
  estimateReadingMinutes,
  slugifyTitle,
  uniqueBlogSlug,
} from "../src/server/cms/blog-utils";
import { sanitizeBlogHtml } from "../src/lib/sanitize-blog-html";
import type { BlogPost } from "../src/server/cms/types";

const slug = slugifyTitle(
  "Windows 11 Pro vs Home: Doanh nghiệp nên chọn bản nào?",
);
console.assert(
  slug === "windows-11-pro-vs-home-doanh-nghiep-nen-chon-ban-nao",
  `slug mismatch: ${slug}`,
);

const posts = [{ id: "1", slug: "windows-11" } as BlogPost];
const uniq = uniqueBlogSlug("windows-11", posts, "2");
console.assert(uniq === "windows-11-2", `unique mismatch: ${uniq}`);

const dirty =
  '<p>Hi</p><script>alert(1)</script><img src="https://x.com/a.png" onerror="alert(1)" /><a href="https://a.com">x</a>';
const clean = sanitizeBlogHtml(dirty);
console.assert(!clean.includes("script"), "script not stripped");
console.assert(!clean.includes("onerror"), "onerror not stripped");
console.assert(clean.includes("<p>Hi</p>"), "safe p kept");

const mins = estimateReadingMinutes(`<p>${"word ".repeat(450)}</p>`);
console.assert(mins === 2, `reading mins: ${mins}`);

console.log("blog-cms-smoke OK");
