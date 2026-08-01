import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/** HOME.spec.md — Font family: Inter (home-v5) */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KEYON — Phần mềm bản quyền",
  description:
    "Mua phần mềm bản quyền — thanh toán rõ, nhận hàng rõ, quản lý trong Tài khoản.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${inter.className} flex min-h-screen flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
