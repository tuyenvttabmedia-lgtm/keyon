"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { ELEVATION_DROPDOWN, Z_TOAST } from "@/storefront/effects";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Anchor button/element — menu is positioned relative to this */
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  /** Menu width in px (default 192 = w-48) */
  width?: number;
  /** Extra class on the fixed menu panel */
  className?: string;
  role?: string;
};

/**
 * Fixed + portaled dropdown — escapes overflow:hidden table/card shells.
 * Flips upward when near the bottom of the viewport.
 */
export function PortalMenu({
  open,
  onClose,
  anchorRef,
  children,
  width = 192,
  className = "",
  role = "menu",
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setPos(null);
      return;
    }
    const GAP = 4;
    const EDGE = 8;

    function place() {
      const btn = anchorRef.current;
      const menu = menuRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const menuH = Math.max(menu?.offsetHeight ?? 0, 1);
      const spaceBelow = window.innerHeight - r.bottom - GAP - EDGE;
      const spaceAbove = r.top - GAP - EDGE;
      // Prefer flip-up when menu would overflow viewport bottom
      const openUp =
        spaceBelow < menuH && spaceAbove >= Math.min(menuH, spaceBelow + 1);
      let top = openUp ? r.top - menuH - GAP : r.bottom + GAP;
      top = Math.min(
        Math.max(EDGE, top),
        Math.max(EDGE, window.innerHeight - menuH - EDGE),
      );
      const left = Math.min(
        Math.max(EDGE, r.right - width),
        window.innerWidth - width - EDGE,
      );
      setPos({ top, left });
    }

    place();
    const raf1 = requestAnimationFrame(() => {
      place();
      requestAnimationFrame(place);
    });
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(raf1);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, anchorRef, width, children]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (anchorRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={menuRef}
      role={role}
      className={`fixed overflow-hidden rounded-xl border border-border bg-card py-0 ${ELEVATION_DROPDOWN} ${Z_TOAST} ${className}`}
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        width,
        visibility: pos ? "visible" : "hidden",
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

/** Shared row-action item class for admin menus */
export const PORTAL_MENU_ITEM_CLASS =
  "block w-full px-3 py-2 text-left text-sm text-navy hover:bg-[#f8fafc] disabled:opacity-40" as const;
