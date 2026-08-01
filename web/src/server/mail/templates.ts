/** HTML email templates — Mailpit / SMTP */

function wrap(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"/><title>${title}</title></head>
<body style="margin:0;background:#0f1419;font-family:Manrope,Segoe UI,sans-serif;color:#e8eef4">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td align="center">
      <table width="560" style="background:#1a222c;border-radius:16px;border:1px solid #2a3540;padding:28px">
        <tr><td>
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;color:#3d9a6a;text-transform:uppercase">KEYON</p>
          <h1 style="margin:0 0 16px;font-size:22px;color:#fff">${title}</h1>
          ${body}
          <p style="margin:24px 0 0;font-size:12px;color:#8b9aab">Đây là email tự động · Không trả lời trực tiếp</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function emailPaymentSucceeded(input: { orderCode: string; amountVnd: number }) {
  const subject = `[KEYON] Thanh toán thành công ${input.orderCode}`;
  const text = `Đơn ${input.orderCode} đã thanh toán ${input.amountVnd.toLocaleString("vi-VN")}đ. Chúng tôi đang xử lý giao hàng.`;
  const html = wrap(
    "Thanh toán thành công",
    `<p style="line-height:1.6;color:#c5d0db">Đơn <strong style="color:#fff">${input.orderCode}</strong> đã nhận thanh toán <strong style="color:#3d9a6a">${input.amountVnd.toLocaleString("vi-VN")}đ</strong>.</p>
     <p style="line-height:1.6;color:#c5d0db">Hệ thống đang fulfill. Đăng nhập tài khoản để theo dõi trạng thái giao hàng.</p>`,
  );
  return { subject, text, html };
}

export function emailDeliveryReady(input: {
  orderCode: string;
  productTitle: string;
  accountUrl?: string;
}) {
  const url = input.accountUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const subject = `[KEYON] Đã giao hàng — ${input.orderCode}`;
  const text = `Đơn ${input.orderCode} (${input.productTitle}) đã được giao. Xem tại ${url}/account/orders`;
  const html = wrap(
    "Đã giao hàng",
    `<p style="line-height:1.6;color:#c5d0db">Sản phẩm <strong style="color:#fff">${input.productTitle}</strong> thuộc đơn <strong style="color:#fff">${input.orderCode}</strong> đã sẵn sàng.</p>
     <p style="margin:20px 0"><a href="${url}/account/orders" style="display:inline-block;background:#3d9a6a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600">Xem đơn hàng</a></p>`,
  );
  return { subject, text, html };
}

export function emailDeliveryResend(input: { orderCode: string; resendCount: number }) {
  const subject = `[KEYON] Resend deliverable — ${input.orderCode}`;
  const text = `Yêu cầu gửi lại thông tin giao hàng cho đơn ${input.orderCode} (lần ${input.resendCount}). Đăng nhập để xem lại.`;
  const html = wrap(
    "Gửi lại thông tin giao hàng",
    `<p style="line-height:1.6;color:#c5d0db">Đơn <strong style="color:#fff">${input.orderCode}</strong> — resend lần <strong>${input.resendCount}</strong>.</p>
     <p style="line-height:1.6;color:#c5d0db">Đăng nhập tài khoản KEYON để xem lại license / tài khoản đã giao.</p>`,
  );
  return { subject, text, html };
}

export function emailDeliveryReplaced(input: { orderCode: string; productTitle: string }) {
  const subject = `[KEYON] Replace deliverable — ${input.orderCode}`;
  const text = `Deliverable của ${input.productTitle} (đơn ${input.orderCode}) đã được thay thế. Đăng nhập để xem bản mới.`;
  const html = wrap(
    "Đã thay thế deliverable",
    `<p style="line-height:1.6;color:#c5d0db">Sản phẩm <strong style="color:#fff">${input.productTitle}</strong> thuộc đơn <strong style="color:#fff">${input.orderCode}</strong> đã được staff thay thế (replace).</p>
     <p style="line-height:1.6;color:#c5d0db">Bản cũ vẫn lưu audit; hãy dùng bản mới trên trang đơn hàng.</p>`,
  );
  return { subject, text, html };
}

export function emailPasswordReset(input: { resetUrl: string }) {
  const subject = "[KEYON] Đặt lại mật khẩu";
  const text = `Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu KEYON. Mở liên kết trong 1 giờ: ${input.resetUrl}`;
  const html = wrap(
    "Đặt lại mật khẩu",
    `<p style="line-height:1.6;color:#c5d0db">Bạn đã yêu cầu đặt lại mật khẩu tài khoản KEYON.</p>
     <p style="margin:20px 0"><a href="${input.resetUrl}" style="display:inline-block;background:#3d9a6a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600">Đặt lại mật khẩu</a></p>
     <p style="line-height:1.6;color:#c5d0db;font-size:13px">Liên kết hết hạn sau 1 giờ. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>`,
  );
  return { subject, text, html };
}

export function emailVerifyAddress(input: { verifyUrl: string; email: string }) {
  const subject = "[KEYON] Xác thực email";
  const text = `Xác thực email ${input.email} cho tài khoản KEYON: ${input.verifyUrl}`;
  const html = wrap(
    "Xác thực email",
    `<p style="line-height:1.6;color:#c5d0db">Xác nhận <strong style="color:#fff">${input.email}</strong> là email của bạn để xem license đã mua trên KEYON.</p>
     <p style="margin:20px 0"><a href="${input.verifyUrl}" style="display:inline-block;background:#3d9a6a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600">Xác thực email</a></p>
     <p style="line-height:1.6;color:#c5d0db;font-size:13px">Liên kết hết hạn sau 24 giờ.</p>`,
  );
  return { subject, text, html };
}
