import { Suspense } from "react";
import { VerifyEmailClient } from "./verify-email-client";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="home-container py-12 text-sm text-muted">
          Đang tải…
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
