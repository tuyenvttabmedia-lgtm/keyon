"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthSubmitButton } from "@/storefront/components/auth/AuthCard";
import {
  AuthField,
  AuthTextarea,
  IconCalendar,
  IconEye,
  IconLock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUser,
} from "@/storefront/components/auth/AuthField";
import {
  BODY_MUTED_CLASS,
  FORM_ERROR_CLASS,
  LINK_ACCENT_CLASS,
} from "@/storefront/typography";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agree) {
      setError("Vui lòng đồng ý Điều khoản và Chính sách bảo mật");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          dateOfBirth: dateOfBirth || undefined,
          address: address.trim() || undefined,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Đăng ký thất bại");
      router.push("/account/profile");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <AuthField
        label="Họ và tên"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nguyễn Văn A"
        required
        autoComplete="name"
        leftIcon={<IconUser />}
      />
      <AuthField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ban@email.com"
        required
        autoComplete="email"
        leftIcon={<IconMail />}
      />
      <AuthField
        label="Số điện thoại"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="0901 234 567"
        required
        autoComplete="tel"
        leftIcon={<IconPhone />}
      />
      <AuthField
        label="Ngày sinh (tuỳ chọn)"
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        autoComplete="bday"
        leftIcon={<IconCalendar />}
      />
      <AuthTextarea
        label="Địa chỉ (tuỳ chọn)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
        autoComplete="street-address"
        rows={2}
        leftIcon={<IconMapPin />}
      />
      <AuthField
        label="Mật khẩu"
        type={showPw ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Tối thiểu 8 ký tự"
        required
        minLength={8}
        autoComplete="new-password"
        leftIcon={<IconLock />}
        rightSlot={
          <button
            type="button"
            className="rounded p-1 text-muted hover:text-navy"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <IconEye off={showPw} />
          </button>
        }
      />
      <AuthField
        label="Xác nhận mật khẩu"
        type={showConfirm ? "text" : "password"}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Nhập lại mật khẩu"
        required
        minLength={8}
        autoComplete="new-password"
        leftIcon={<IconLock />}
        rightSlot={
          <button
            type="button"
            className="rounded p-1 text-muted hover:text-navy"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <IconEye off={showConfirm} />
          </button>
        }
      />
      <label className={`flex cursor-pointer items-start gap-2.5 pt-1 ${BODY_MUTED_CLASS}`}>
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-accent"
        />
        <span>
          Tôi đồng ý với{" "}
          <Link href="/terms" className={LINK_ACCENT_CLASS}>
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link href="/policy" className={LINK_ACCENT_CLASS}>
            Chính sách bảo mật
          </Link>
        </span>
      </label>
      {error ? (
        <p id="register-form-error" role="alert" className={FORM_ERROR_CLASS}>
          {error}
        </p>
      ) : null}
      <AuthSubmitButton loading={loading} loadingLabel="Đang tạo…">
        Đăng ký
      </AuthSubmitButton>
    </form>
  );
}
