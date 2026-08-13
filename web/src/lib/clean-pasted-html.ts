/**
 * Clean Word / Google Docs / LibreOffice HTML before TipTap parses it.
 * Keeps structure (headings, lists, tables, links, images) and drops MSO junk.
 */
export function cleanPastedHtml(html: string): string {
  if (!html?.trim()) return "";

  const out = html
    .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(?:o|w|v|m):[^>]*>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<xml[\s\S]*?<\/xml>/gi, "");

  if (typeof DOMParser !== "undefined") {
    try {
      return cleanWithDom(out);
    } catch {
      /* fall through */
    }
  }

  return cleanWithRegex(out);
}

function cleanWithDom(html: string): string {
  const doc = new DOMParser().parseFromString(
    `<div id="__paste_root">${html}</div>`,
    "text/html",
  );
  const root = doc.getElementById("__paste_root");
  if (!root) return cleanWithRegex(html);

  root.querySelectorAll('b[id^="docs-internal-guid"]').forEach((el) => {
    unwrap(el as HTMLElement);
  });

  const walk = (node: Node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (
      [
        "script",
        "style",
        "meta",
        "link",
        "xml",
        "iframe",
        "object",
        "embed",
        "form",
        "input",
        "button",
        "svg",
      ].includes(tag)
    ) {
      el.remove();
      return;
    }

    if (tag === "h1") renameTag(el, "h2");
    else if (tag === "h5" || tag === "h6") renameTag(el, "h4");
    if (tag === "font") renameTag(el, "span");

    const keepAttrs = new Set(
      tag === "a"
        ? ["href", "target", "rel", "title"]
        : tag === "img"
          ? ["src", "alt", "title", "width", "height"]
          : tag === "td" || tag === "th"
            ? ["colspan", "rowspan"]
            : ([] as string[]),
    );

    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (keepAttrs.has(name)) {
        if (name === "href" || name === "src") {
          const v = attr.value.trim();
          if (/^javascript:/i.test(v) || /^data:text\/html/i.test(v)) {
            el.removeAttribute(attr.name);
          }
        }
        return;
      }
      el.removeAttribute(attr.name);
    });

    if (tag === "p") {
      const raw = el.textContent || "";
      if (/^[\s\u00a0]*[•●○▪▫■□◦‣⁃\uF0B7]/.test(raw)) {
        el.textContent = raw.replace(
          /^[\s\u00a0]*[•●○▪▫■□◦‣⁃\uF0B7]\s*/,
          "",
        );
      }
    }

    [...el.childNodes].forEach(walk);
  };

  [...root.childNodes].forEach(walk);

  root.querySelectorAll("span, div").forEach((el) => {
    if (!(el as HTMLElement).attributes.length) unwrap(el as HTMLElement);
  });

  root.querySelectorAll("p").forEach((p) => {
    const t = (p.textContent || "").replace(/\u00a0/g, " ").trim();
    if (!t && !p.querySelector("img, br, table")) p.remove();
  });

  return root.innerHTML;
}

function unwrap(el: HTMLElement) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

function renameTag(el: HTMLElement, newTag: string) {
  const neu = el.ownerDocument.createElement(newTag);
  while (el.firstChild) neu.appendChild(el.firstChild);
  [...el.attributes].forEach((a) => neu.setAttribute(a.name, a.value));
  el.parentNode?.replaceChild(neu, el);
}

function cleanWithRegex(html: string): string {
  return html
    .replace(/<\/?h1\b[^>]*>/gi, (m) =>
      m.startsWith("</") ? "</h2>" : "<h2>",
    )
    .replace(/<\/?h[56]\b[^>]*>/gi, (m) =>
      m.startsWith("</") ? "</h4>" : "<h4>",
    )
    .replace(
      /\s(?:style|class|lang|id|align|face|color|size|dir|valign|bgcolor)=("[^"]*"|'[^']*'|[^\s>]+)/gi,
      "",
    )
    .replace(/<\/?font\b[^>]*>/gi, "")
    .replace(/<\/?span\b[^>]*>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/(<p>\s*<\/p>\s*){2,}/gi, "<p></p>")
    .trim();
}
