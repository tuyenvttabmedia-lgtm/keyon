import { StorageService } from "@/server/storage";
import {
  listBrandMedia,
  listLibraryMedia,
} from "@/server/media/service";
import { MediaLibrary } from "./media-library";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const [driver, library, brand] = await Promise.all([
    StorageService.driverName(),
    listLibraryMedia({ sort: "newest" }),
    listBrandMedia(),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>Thư viện Media</h1>
        <p className="text-sm text-muted">
          Quản lý hình ảnh sử dụng trên website KEYON
        </p>
      </div>
      <MediaLibrary initial={[...library, ...brand]} driver={driver} />
    </div>
  );
}
