"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ToggleActiveButton({
  variantId,
  active,
}: {
  variantId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch("/api/admin/catalog/variant", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, active: !active }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={toggle}
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        active ? "bg-accent-soft text-accent" : "bg-border text-muted"
      }`}
    >
      {active ? "ON" : "OFF"}
    </button>
  );
}
