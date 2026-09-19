import type { ReactNode } from "react";

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

const BULLET_RE = /^\s*[-*•]\s+(.*)$/;
const NUMBER_RE = /^\s*\d+[.)]\s+(.*)$/;

/**
 * FAQ answer renderer — textarea stays plain text; storefront gets real lists.
 * - Explicit: `- item` / `* item` / `1. item`
 * - Implicit: line ending with `:` (+ optional blank) then consecutive lines → bullets
 */
export function parseFaqAnswerBlocks(raw: string): Block[] {
  const text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const lines = text.split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let bullets: string[] = [];
  let numbers: string[] = [];
  /** After a ":" intro (and optional blank lines), plain lines become bullets. */
  let expectImplicitList = false;

  function flushPara() {
    if (!para.length) return;
    const joined = para.join("\n").trim();
    if (joined) blocks.push({ type: "p", text: joined });
    para = [];
  }
  function flushBullets() {
    if (!bullets.length) return;
    blocks.push({ type: "ul", items: [...bullets] });
    bullets = [];
  }
  function flushNumbers() {
    if (!numbers.length) return;
    blocks.push({ type: "ol", items: [...numbers] });
    numbers = [];
  }
  function flushLists() {
    flushBullets();
    flushNumbers();
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (para.length > 0) {
        const last = para[para.length - 1]?.trim() ?? "";
        if (/[:：]\s*$/.test(last)) {
          flushPara();
          expectImplicitList = true;
          continue;
        }
        flushPara();
      }
      if (bullets.length || numbers.length) {
        flushLists();
        expectImplicitList = false;
      }
      continue;
    }

    const bullet = trimmed.match(BULLET_RE);
    if (bullet) {
      flushNumbers();
      flushPara();
      expectImplicitList = false;
      bullets.push(bullet[1]!.trim());
      continue;
    }

    const numbered = trimmed.match(NUMBER_RE);
    if (numbered) {
      flushBullets();
      flushPara();
      expectImplicitList = false;
      numbers.push(numbered[1]!.trim());
      continue;
    }

    if (expectImplicitList || bullets.length > 0) {
      // Continue / start implicit bullet list (plain lines after ":")
      if (numbers.length) flushNumbers();
      flushPara();
      expectImplicitList = true;
      bullets.push(trimmed);
      continue;
    }

    const prevInPara = para[para.length - 1]?.trim() ?? "";
    if (para.length > 0 && /[:：]\s*$/.test(prevInPara)) {
      flushPara();
      expectImplicitList = true;
      bullets.push(trimmed);
      continue;
    }

    flushLists();
    expectImplicitList = false;
    para.push(line);
  }

  flushLists();
  flushPara();
  return blocks;
}

export function FaqAnswer({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}): ReactNode {
  const blocks = parseFaqAnswerBlocks(text);
  if (!blocks.length) return null;

  return (
    <div className={`space-y-2.5 text-sm leading-relaxed ${className}`}>
      {blocks.map((b, i) => {
        if (b.type === "p") {
          return (
            <p key={i} className="whitespace-pre-line">
              {b.text}
            </p>
          );
        }
        if (b.type === "ul") {
          return (
            <ul
              key={i}
              className="list-disc space-y-1.5 pl-5 marker:text-accent"
            >
              {b.items.map((item, j) => (
                <li key={j} className="pl-0.5">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <ol
            key={i}
            className="list-decimal space-y-1.5 pl-5 marker:text-accent"
          >
            {b.items.map((item, j) => (
              <li key={j} className="pl-0.5">
                {item}
              </li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}
