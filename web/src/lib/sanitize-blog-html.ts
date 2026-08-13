import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "blockquote",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "span",
  "div",
  "pre",
  "code",
  "iframe",
];

/** Sanitize TipTap HTML before persist / storefront render (Node + browser safe). */
export function sanitizeBlogHtml(html: string): string {
  if (!html?.trim()) return "";
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "class", "title"],
      img: ["src", "alt", "title", "width", "height", "class"],
      th: ["colspan", "rowspan", "class", "style"],
      td: ["colspan", "rowspan", "class", "style"],
      p: ["class", "style"],
      h2: ["class", "style", "id"],
      h3: ["class", "style", "id"],
      h4: ["class", "style", "id"],
      div: ["class", "data-youtube-video", "style"],
      iframe: [
        "src",
        "width",
        "height",
        "allow",
        "allowfullscreen",
        "frameborder",
        "class",
        "title",
      ],
      "*": ["class"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "www.youtube-nocookie.com",
      "youtube-nocookie.com",
    ],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
      strike: sanitizeHtml.simpleTransform("s"),
    },
  });
}
