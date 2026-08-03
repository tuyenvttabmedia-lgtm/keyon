"use client";

import { useEffect, useRef } from "react";

/** Auto-submit SePay PG hosted checkout (sandbox). */
export function SepayPgCheckoutRedirect({
  checkoutUrl,
  checkoutFormFields,
}: {
  checkoutUrl: string;
  checkoutFormFields: Record<string, string>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.submit();
  }, [checkoutUrl, checkoutFormFields]);

  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-10 text-center">
      <p className="text-sm font-medium text-navy">Đang chuyển tới Cổng thanh toán SePay…</p>
      <p className="mt-2 text-xs text-muted">Nếu không tự chuyển, bấm nút bên dưới.</p>
      <form ref={formRef} action={checkoutUrl} method="POST" className="mt-4">
        {Object.entries(checkoutFormFields).map(([field, value]) => (
          <input key={field} type="hidden" name={field} value={value} />
        ))}
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Tiếp tục thanh toán SePay
        </button>
      </form>
    </div>
  );
}
