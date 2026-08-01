import { redirect } from "next/navigation";

/** Alias mockup «Sản phẩm» → catalog hiện có */
export default function AdminProductsRedirect() {
  redirect("/admin/catalog");
}
