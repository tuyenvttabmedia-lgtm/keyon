"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  FORM_SUCCESS_CLASS,
  INPUT_TEXT_CLASS,
  PAGE_LEAD_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  OPACITY_DISABLED_BUSY,
  TRANSITION_UI,
} from "@/storefront/effects";

const VOLUMES = ["5", "10", "50", "100", "100+"] as const;

const INPUT =
  `mt-1.5 h-11 w-full rounded-xl border border-border bg-white px-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;
const TEXTAREA =
  `mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;

export function SalesQuoteForm({
  initialUsers,
}: {
  initialUsers?: string;
}) {
  const prefilled = useMemo(() => {
    if (initialUsers && (VOLUMES as readonly string[]).includes(initialUsers)) {
      return initialUsers;
    }
    return "10";
  }, [initialUsers]);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [users, setUsers] = useState(prefilled);
  const [products, setProducts] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);
    try {
      const message = [
        `Yêu cầu báo giá — Volume licensing`,
        `Công ty: ${company.trim()}`,
        `Quy mô người dùng: ${users}`,
        `Sản phẩm quan tâm: ${products.trim() || "—"}`,
        note.trim() ? `Ghi chú:\n${note.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          topic: "Báo giá volume licensing",
          message,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Gửi thất bại");
      setOk("Đã gửi yêu cầu báo giá. KEYON sẽ liên hệ lại sớm.");
      setName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setProducts("");
      setNote("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white">
      <section className="border-b border-border bg-[#F7FAFC]">
        <div className="home-container py-10 md:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Doanh nghiệp
          </p>
          <h1 className={`mt-3 ${PAGE_TITLE_CLASS}`}>Yêu cầu báo giá</h1>
          <p className={`mt-3 max-w-2xl ${PAGE_LEAD_CLASS}`}>
            Gửi thông tin nhu cầu volume licensing — không cần tạo tài khoản. KEYON sẽ liên hệ
            tư vấn và báo giá phù hợp.
          </p>
        </div>
      </section>

      <section className="home-container py-9 md:py-11">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12">
          <form
            onSubmit={onSubmit}
            className={`rounded-2xl border border-border bg-white p-5 sm:p-6 md:p-7 ${ELEVATION_HAIRLINE}`}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-1">
                <span className={FORM_LABEL_CLASS}>Họ tên</span>
                <input
                  required
                  className={INPUT}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </label>
              <label className="block sm:col-span-1">
                <span className={FORM_LABEL_CLASS}>Công ty</span>
                <input
                  required
                  className={INPUT}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  autoComplete="organization"
                />
              </label>
              <label className="block sm:col-span-1">
                <span className={FORM_LABEL_CLASS}>Email doanh nghiệp</span>
                <input
                  required
                  type="email"
                  className={INPUT}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>
              <label className="block sm:col-span-1">
                <span className={FORM_LABEL_CLASS}>Điện thoại</span>
                <input
                  className={INPUT}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className={FORM_LABEL_CLASS}>Quy mô người dùng</span>
                <select
                  className={INPUT}
                  value={users}
                  onChange={(e) => setUsers(e.target.value)}
                >
                  {VOLUMES.map((v) => (
                    <option key={v} value={v}>
                      {v} người dùng
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className={FORM_LABEL_CLASS}>Sản phẩm quan tâm</span>
                <input
                  className={INPUT}
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  placeholder="VD: Microsoft 365, Windows, Adobe…"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className={FORM_LABEL_CLASS}>Ghi chú</span>
                <textarea
                  rows={4}
                  className={TEXTAREA}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Mô tả thêm nhu cầu, thời hạn triển khai…"
                />
              </label>
            </div>

            {err ? <p className={`mt-4 ${FORM_ERROR_CLASS}`}>{err}</p> : null}
            {ok ? <p className={`mt-4 ${FORM_SUCCESS_CLASS}`}>{ok}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm sm:w-auto ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER} ${OPACITY_DISABLED_BUSY}`}
            >
              {loading ? "Đang gửi…" : "Gửi yêu cầu báo giá"}
            </button>
          </form>

          <aside className="min-w-0">
            <h2 className={CARD_TITLE_CLASS}>Sau khi gửi yêu cầu</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              KEYON tiếp nhận nhu cầu, tư vấn hình thức cấp phép và gửi báo giá theo sản phẩm /
              số lượng. Chưa cần tạo tài khoản để gửi yêu cầu.
            </p>
            <ul className={`mt-5 space-y-2.5 ${BODY_MUTED_CLASS}`}>
              <li>• Không đưa vào giỏ hàng — đây là luồng báo giá doanh nghiệp.</li>
              <li>• Sau khi chấp thuận báo giá mới đi vào thanh toán / đơn hàng.</li>
              <li>
                • Sản phẩm có giá mua lẻ: dùng{" "}
                <Link href="/products" className="font-semibold text-accent hover:underline">
                  Mua ngay
                </Link>{" "}
                trên trang sản phẩm.
              </li>
            </ul>
            <p className={`mt-6 ${BODY_MUTED_CLASS}`}>
              Quay lại{" "}
              <Link
                href="/business/volume-licensing"
                className="font-semibold text-accent hover:underline"
              >
                Mua bản quyền số lượng lớn
              </Link>
              .
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
