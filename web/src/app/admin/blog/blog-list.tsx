"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/server/cms/store";
import type { BlogCategoryId } from "@/server/cms/types";
import { CATEGORY_LABEL } from "@/storefront/lib/blog";
import { uniqueBlogSlug } from "@/server/cms/blog-utils";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

type StatusFilter = "all" | "draft" | "published";
type DateFilter = "all" | "today" | "7d" | "30d" | "custom";

const CATEGORIES = Object.entries(CATEGORY_LABEL) as [BlogCategoryId, string][];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function inDateRange(
  iso: string,
  filter: DateFilter,
  from: string,
  to: string,
): boolean {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  const now = new Date();
  if (filter === "all") return true;
  if (filter === "today") return t >= startOfDay(now).getTime();
  if (filter === "7d") return t >= now.getTime() - 7 * 86400000;
  if (filter === "30d") return t >= now.getTime() - 30 * 86400000;
  if (filter === "custom") {
    if (from) {
      const f = startOfDay(new Date(from)).getTime();
      if (t < f) return false;
    }
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      if (t > end.getTime()) return false;
    }
    return true;
  }
  return true;
}

export function BlogList({ posts: initial }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<"" | BlogCategoryId>("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return posts
      .filter((p) => {
        if (status !== "all" && p.status !== status) return false;
        if (category && p.category !== category) return false;
        if (!inDateRange(p.updatedAt, dateFilter, from, to)) return false;
        if (!needle) return true;
        return (
          p.title.toLowerCase().includes(needle) ||
          p.slug.toLowerCase().includes(needle)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [posts, q, status, category, dateFilter, from, to]);

  const page = useClientPagination(
    filtered,
    "keyon.admin.blog.pageSize",
    filtered.length,
  );

  async function persist(next: BlogPost[]) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/cms/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi lưu");
      setPosts(next);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
      setMenuId(null);
    }
  }

  async function duplicate(p: BlogPost) {
    const slug = uniqueBlogSlug(`${p.slug}-copy`, posts);
    const copy: BlogPost = {
      ...p,
      id: `post_${Date.now()}`,
      slug,
      title: `${p.title} (bản sao)`,
      status: "draft",
      publishedAt: undefined,
      updatedAt: new Date().toISOString(),
      featured: false,
    };
    await persist([...posts, copy]);
    setMsg("Đã nhân bản bài viết");
  }

  async function unpublish(p: BlogPost) {
    if (!confirm(`Chuyển "${p.title}" về bản nháp?`)) return;
    const next = posts.map((x) =>
      x.id === p.id
        ? { ...x, status: "draft" as const, updatedAt: new Date().toISOString() }
        : x,
    );
    await persist(next);
    setMsg("Đã chuyển về bản nháp");
  }

  async function remove(p: BlogPost) {
    if (!confirm(`Xóa bài "${p.title}"? Hành động không hoàn tác.`)) return;
    await persist(posts.filter((x) => x.id !== p.id));
    setMsg("Đã xóa bài viết");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
        <label className="min-w-[200px] flex-1 text-xs text-muted">
          Tìm kiếm
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-navy"
            placeholder="Tìm bài viết..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="text-xs text-muted">
          Trạng thái
          <select
            className="mt-1 block w-40 rounded-lg border border-border px-2 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="draft">Bản nháp</option>
            <option value="published">Đã xuất bản</option>
          </select>
        </label>
        <label className="text-xs text-muted">
          Chuyên mục
          <select
            className="mt-1 block w-44 rounded-lg border border-border px-2 py-2 text-sm"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as "" | BlogCategoryId)
            }
          >
            <option value="">Tất cả</option>
            {CATEGORIES.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Thời gian
          <select
            className="mt-1 block w-40 rounded-lg border border-border px-2 py-2 text-sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="today">Hôm nay</option>
            <option value="7d">7 ngày</option>
            <option value="30d">30 ngày</option>
            <option value="custom">Tùy chọn</option>
          </select>
        </label>
        {dateFilter === "custom" ? (
          <>
            <label className="text-xs text-muted">
              From
              <input
                type="date"
                className="mt-1 block rounded-lg border border-border px-2 py-2 text-sm"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <label className="text-xs text-muted">
              To
              <input
                type="date"
                className="mt-1 block rounded-lg border border-border px-2 py-2 text-sm"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </>
        ) : null}
        <div className="ml-auto">
          <PageSizeSelect
            value={page.pageSize}
            onChange={page.setPageSize}
            unit="bài"
          />
        </div>
      </div>

      {msg ? <p className="text-xs text-muted">{msg}</p> : null}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="font-medium text-navy">Không có bài phù hợp</p>
          <p className="mt-1 text-sm text-muted">
            Đổi bộ lọc hoặc tạo bài mới.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="border-b border-border bg-[#f8fafc] text-xs uppercase text-muted">
                  <tr>
                    <th className="px-4 py-3">Bài viết</th>
                    <th className="px-4 py-3">Chuyên mục</th>
                    <th className="px-4 py-3">Tác giả</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Cập nhật</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {page.pageItems.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f8fafc]/60">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                            {p.coverUrl ? (
                              <Image
                                src={p.coverUrl}
                                alt=""
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                                N/A
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/blog/${p.id}`}
                              className="font-medium text-navy hover:text-accent"
                            >
                              {p.title || "(Chưa có tiêu đề)"}
                            </Link>
                            <p className="text-xs text-muted">/{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {p.category ? CATEGORY_LABEL[p.category] : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {p.author?.trim() || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            p.status === "published"
                              ? "rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700"
                              : "rounded-full bg-amber-50 px-2.5 py-0.5 text-xs text-amber-800"
                          }
                        >
                          {p.status === "published"
                            ? "Đã xuất bản"
                            : "Bản nháp"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {new Date(p.updatedAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="relative px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {p.status === "published" ? (
                            <a
                              href={`/blog/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-medium text-accent hover:underline"
                            >
                              Xem
                            </a>
                          ) : (
                            <Link
                              href={`/admin/blog/${p.id}/preview`}
                              className="text-sm font-medium text-accent hover:underline"
                            >
                              Xem
                            </Link>
                          )}
                          <Link
                            href={`/admin/blog/${p.id}`}
                            className="text-sm font-medium text-navy hover:underline"
                          >
                            Sửa
                          </Link>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              setMenuId(menuId === p.id ? null : p.id)
                            }
                            className="rounded-lg border border-border px-2 py-0.5 text-sm text-muted hover:bg-surface"
                            aria-label="Thêm hành động"
                          >
                            …
                          </button>
                        </div>
                        {menuId === p.id ? (
                          <div className="absolute right-4 z-20 mt-1 w-48 rounded-xl border border-border bg-white py-1 text-left shadow-lg">
                            {p.status === "published" ? (
                              <a
                                href={`/blog/${p.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block px-3 py-2 text-sm hover:bg-surface"
                              >
                                Xem bài
                              </a>
                            ) : (
                              <Link
                                href={`/admin/blog/${p.id}/preview`}
                                className="block px-3 py-2 text-sm hover:bg-surface"
                              >
                                Xem bài
                              </Link>
                            )}
                            <Link
                              href={`/admin/blog/${p.id}`}
                              className="block px-3 py-2 text-sm hover:bg-surface"
                            >
                              Sửa
                            </Link>
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-surface"
                              onClick={() => void duplicate(p)}
                            >
                              Nhân bản
                            </button>
                            {p.status === "published" ? (
                              <button
                                type="button"
                                className="block w-full px-3 py-2 text-left text-sm hover:bg-surface"
                                onClick={() => void unpublish(p)}
                              >
                                Chuyển về bản nháp
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-red-50"
                              onClick={() => void remove(p)}
                            >
                              Xóa
                            </button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ListPaginationBar
            page={page.page}
            pageCount={page.pageCount}
            from={page.from}
            to={page.to}
            total={page.total}
            unit="bài"
            onPrev={() => page.setPage(page.page - 1)}
            onNext={() => page.setPage(page.page + 1)}
          />
        </>
      )}
    </div>
  );
}
