import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { IaLandingPage } from "@/storefront/components/marketing/IaLanding";
import {
  CloudSolutionLanding,
  type CloudFeaturedProduct,
} from "@/storefront/components/solutions/CloudSolutionLanding";
import {
  ProductivitySolutionLanding,
  type ProductivityFeaturedProduct,
} from "@/storefront/components/solutions/ProductivitySolutionLanding";
import {
  SecuritySolutionLanding,
  type SecurityFeaturedProduct,
} from "@/storefront/components/solutions/SecuritySolutionLanding";
import {
  BackupSolutionLanding,
  type BackupFeaturedProduct,
} from "@/storefront/components/solutions/BackupSolutionLanding";
import {
  LicenseManagementSolutionLanding,
  type HeroAssetPreview,
} from "@/storefront/components/solutions/LicenseManagementSolutionLanding";
import { ByNeedSolutionLanding } from "@/storefront/components/solutions/ByNeedSolutionLanding";
import { SOLUTION_PAGES } from "@/storefront/nav/ia-pages";
import { parseStringList, PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import { inferCategory } from "@/storefront/components/shop/shop-utils";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { absoluteTitle } from "@/server/seo/title";
import {
  defaultCmsBackupSolution,
  defaultCmsCloudSolution,
  defaultCmsProductivity,
  defaultCmsSecuritySolution,
  readJsonFile,
} from "@/server/cms/store";
import { resolveMediaUrl } from "@/lib/media-url";
import { resolveStorage } from "@/server/storage/config";
import { customerOrderWhere } from "@/server/org/customer-order-access";
import type { DeliverableType } from "@prisma/client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(SOLUTION_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = SOLUTION_PAGES[slug];
  if (!page) return buildMainPageMetadata("/business");
  if (slug === "by-need") {
    return {
      ...(await buildMainPageMetadata("/solutions/by-need")),
      title: absoluteTitle("Giải pháp theo nhu cầu | KEYON"),
      description:
        "Kết hợp nhiều sản phẩm theo nhu cầu thực tế. KEYON hỗ trợ chọn giải pháp theo số người dùng, nhu cầu và ngân sách.",
    };
  }
  if (slug === "cloud") {
    return {
      ...(await buildMainPageMetadata("/solutions/cloud")),
      title: absoluteTitle("Cloud & Hạ tầng cho doanh nghiệp | KEYON"),
      description:
        "VPS Linux, VPS Windows và Dedicated Server trên KEYON. Khách tự quản trị. Cấu hình và thời hạn rõ trước khi đăng ký.",
    };
  }
  if (slug === "microsoft-365-office") {
    return {
      ...(await buildMainPageMetadata("/solutions/microsoft-365-office")),
      title: absoluteTitle("Microsoft 365 & Office | KEYON"),
      description:
        "Khám phá Microsoft 365 và Office bản quyền cho cá nhân, doanh nghiệp với Word, Excel, PowerPoint, Teams, OneDrive và nhiều công cụ khác.",
    };
  }
  if (slug === "security") {
    return {
      ...(await buildMainPageMetadata("/solutions/security")),
      title: absoluteTitle("Giải pháp bảo mật & phần mềm bảo mật | KEYON"),
      description:
        "Khám phá phần mềm và license bảo mật cho thiết bị, email, dữ liệu, danh tính và mạng. KEYON hỗ trợ lựa chọn, bàn giao và kích hoạt.",
    };
  }
  if (slug === "backup") {
    return {
      ...(await buildMainPageMetadata("/solutions/backup")),
      title: absoluteTitle("Phần mềm Backup & Khôi phục dữ liệu | KEYON"),
      description:
        "Khám phá phần mềm và license backup cho PC, server, Microsoft 365 và Cloud. KEYON hỗ trợ lựa chọn, bàn giao và hướng dẫn kích hoạt.",
    };
  }
  if (slug === "license-management") {
    return {
      ...(await buildMainPageMetadata("/solutions/license-management")),
      title: absoluteTitle("Quản lý bản quyền | KEYON"),
      description:
        "Theo dõi, cảnh báo gia hạn và tối ưu chi phí license trên một nền tảng KEYON — minh bạch và chủ động.",
    };
  }
  return {
    ...(await buildMainPageMetadata(`/solutions/${slug}`)),
    title: absoluteTitle(`${page.title} | KEYON`),
    description: page.subtitle,
  };
}

async function loadCloudFeatured(): Promise<{
  featured: CloudFeaturedProduct[];
  usingFallback: boolean;
}> {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: true,
      variants: { where: { active: true }, orderBy: { priceVnd: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
    take: 40,
  });

  const cloudish: CloudFeaturedProduct[] = [];
  for (const p of products) {
    const variant = p.variants[0];
    if (!variant) continue;
    const cat =
      p.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
        ? p.categoryKey
        : inferCategory(p.brand.name, p.name);
    const nameL = p.name.toLowerCase();
    const isCloud =
      cat === "cloud" ||
      nameL.includes("cloud") ||
      nameL.includes("azure") ||
      nameL.includes("backup");
    if (!isCloud) continue;
    cloudish.push({
      id: p.id,
      title: p.name,
      href: `/products/${p.slug}`,
      specs: [
        p.brand.name,
        variant.sku ? `SKU ${variant.sku}` : "License / dịch vụ số",
      ].filter(Boolean),
      priceLabel: `Từ ${variant.priceVnd.toLocaleString("vi-VN")}đ`,
      imageUrl: parseStringList(p.galleryUrls)[0],
      icon: "server",
    });
    if (cloudish.length >= 4) break;
  }

  if (cloudish.length > 0) {
    return { featured: cloudish, usingFallback: false };
  }
  return { featured: [], usingFallback: false };
}

function inferProductivityBrand(
  name: string,
): ProductivityFeaturedProduct["brand"] {
  const n = name.toLowerCase();
  if (n.includes("team")) return "teams";
  if (n.includes("outlook")) return "outlook";
  if (n.includes("onedrive") || n.includes("one drive")) return "onedrive";
  if (n.includes("365") || n.includes("microsoft 365") || n.includes("m365")) return "m365";
  if (n.includes("office")) return "office";
  return "generic";
}

async function loadProductivityFeatured(): Promise<{
  featured: ProductivityFeaturedProduct[];
  usingFallback: boolean;
}> {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: true,
      variants: { where: { active: true }, orderBy: { priceVnd: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
    take: 60,
  });

  const scored: { score: number; item: ProductivityFeaturedProduct }[] = [];
  for (const p of products) {
    const variant = p.variants[0];
    if (!variant) continue;
    const cat =
      p.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
        ? p.categoryKey
        : inferCategory(p.brand.name, p.name);
    const nameL = p.name.toLowerCase();
    const brandL = p.brand.name.toLowerCase();
    const isOffice =
      cat === "office" ||
      nameL.includes("office") ||
      nameL.includes("365") ||
      nameL.includes("teams") ||
      nameL.includes("outlook") ||
      nameL.includes("onedrive") ||
      brandL.includes("microsoft");
    if (!isOffice) continue;

    let score = 0;
    if (nameL.includes("365") || nameL.includes("microsoft 365")) score += 50;
    else if (nameL.includes("teams")) score += 40;
    else if (nameL.includes("office 2024") || nameL.includes("office 2021")) score += 35;
    else if (nameL.includes("outlook")) score += 30;
    else if (nameL.includes("onedrive")) score += 25;
    else if (nameL.includes("office")) score += 20;
    if (cat === "office") score += 10;

    scored.push({
      score,
      item: {
        id: p.id,
        title: p.name,
        href: `/products/${p.slug}`,
        description: `${p.brand.name} · License / gói số trên KEYON`,
        priceLabel: `Từ ${variant.priceVnd.toLocaleString("vi-VN")}đ`,
        imageUrl: parseStringList(p.galleryUrls)[0],
        brand: inferProductivityBrand(p.name),
      },
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const featured = scored.slice(0, 4).map((s) => s.item);
  if (featured.length > 0) {
    return { featured, usingFallback: false };
  }
  return { featured: [], usingFallback: false };
}

function inferSecurityBrand(name: string, brandName: string): SecurityFeaturedProduct["brand"] {
  const n = `${name} ${brandName}`.toLowerCase();
  if (n.includes("bitdefender")) return "bitdefender";
  if (n.includes("kaspersky")) return "kaspersky";
  if (n.includes("eset") || n.includes("nod32")) return "eset";
  if (n.includes("norton") || n.includes("symantec")) return "symantec";
  if (n.includes("acronis")) return "acronis";
  return "generic";
}

async function loadSecurityFeatured(): Promise<{
  featured: SecurityFeaturedProduct[];
  usingFallback: boolean;
}> {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: true,
      variants: { where: { active: true }, orderBy: { priceVnd: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
    take: 80,
  });

  const scored: { score: number; item: SecurityFeaturedProduct }[] = [];
  for (const p of products) {
    const variant = p.variants[0];
    if (!variant) continue;
    const cat =
      p.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
        ? p.categoryKey
        : inferCategory(p.brand.name, p.name);
    const nameL = p.name.toLowerCase();
    const brandL = p.brand.name.toLowerCase();

    const isSecurity =
      cat === "security" ||
      nameL.includes("antivirus") ||
      nameL.includes("security") ||
      nameL.includes("bitdefender") ||
      nameL.includes("kaspersky") ||
      nameL.includes("eset") ||
      nameL.includes("norton") ||
      nameL.includes("symantec") ||
      nameL.includes("acronis") ||
      brandL.includes("bitdefender") ||
      brandL.includes("kaspersky") ||
      brandL.includes("eset") ||
      brandL.includes("norton") ||
      brandL.includes("symantec") ||
      brandL.includes("acronis");
    if (!isSecurity) continue;

    let score = 0;
    if (nameL.includes("bitdefender")) score += 50;
    else if (nameL.includes("kaspersky")) score += 48;
    else if (nameL.includes("eset") || nameL.includes("nod32")) score += 45;
    else if (nameL.includes("norton") || nameL.includes("symantec")) score += 42;
    else if (nameL.includes("acronis")) score += 40;
    else if (nameL.includes("antivirus") || nameL.includes("security")) score += 30;
    if (cat === "security") score += 10;

    scored.push({
      score,
      item: {
        id: p.id,
        title: p.name,
        href: `/products/${p.slug}`,
        brandLabel: p.brand.name,
        meta: "License · theo gói",
        priceLabel: `Từ ${variant.priceVnd.toLocaleString("vi-VN")}đ`,
        imageUrl: parseStringList(p.galleryUrls)[0],
        features: [p.brand.name, "License chính hãng", "Hỗ trợ tiếng Việt"],
        brand: inferSecurityBrand(p.name, p.brand.name),
      },
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const featured = scored.slice(0, 4).map((s) => s.item);
  if (featured.length > 0) {
    return { featured, usingFallback: false };
  }
  return { featured: [], usingFallback: false };
}

function inferBackupBrand(name: string, brandName: string): BackupFeaturedProduct["brand"] {
  const n = `${name} ${brandName}`.toLowerCase();
  if (n.includes("acronis")) return "acronis";
  if (n.includes("aomei")) return "aomei";
  if (n.includes("veeam")) return "veeam";
  if (n.includes("microsoft") || n.includes("365")) return "microsoft";
  return "generic";
}

function inferBackupTabs(name: string): BackupFeaturedProduct["tabs"] {
  const n = name.toLowerCase();
  const tabs: BackupFeaturedProduct["tabs"] = [];
  if (n.includes("server") || n.includes("veeam") || n.includes("replication")) {
    tabs.push("server");
  }
  if (n.includes("365") || n.includes("saas") || n.includes("exchange") || n.includes("sharepoint")) {
    tabs.push("saas");
  }
  if (n.includes("cloud") || n.includes("azure") || n.includes("aws")) {
    tabs.push("cloud");
  }
  if (n.includes("disaster") || n.includes("recover") || n.includes("cyber protect")) {
    tabs.push("dr");
  }
  if (
    n.includes("endpoint") ||
    n.includes("home") ||
    n.includes("aomei") ||
    n.includes("backupper") ||
    tabs.length === 0
  ) {
    tabs.push("endpoint");
  }
  return Array.from(new Set(tabs));
}

/** Same 3-hour Asia/Ho_Chi_Minh slot as the home featured row. */
function backupRotationSlot(now = Date.now()): number {
  return Math.floor((now + 7 * 60 * 60 * 1000) / (3 * 60 * 60 * 1000));
}

function backupMix(slot: number, id: string): number {
  let h = 2166136261 ^ slot;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

async function loadBackupFeatured(): Promise<{
  featured: BackupFeaturedProduct[];
  usingFallback: boolean;
}> {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: true,
      variants: { where: { active: true }, orderBy: { priceVnd: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
  });

  const scored: BackupFeaturedProduct[] = [];
  for (const p of products) {
    const variant = p.variants[0];
    if (!variant) continue;
    const cat =
      p.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
        ? p.categoryKey
        : inferCategory(p.brand.name, p.name);
    const nameL = p.name.toLowerCase();
    const brandL = p.brand.name.toLowerCase();

    const isBackup =
      cat === "backup" ||
      nameL.includes("backup") ||
      nameL.includes("acronis") ||
      nameL.includes("veeam") ||
      nameL.includes("aomei") ||
      nameL.includes("backupper") ||
      nameL.includes("recover") ||
      brandL.includes("acronis") ||
      brandL.includes("veeam") ||
      brandL.includes("aomei");
    if (!isBackup) continue;

    scored.push({
      id: p.id,
      title: p.name,
      href: `/products/${p.slug}`,
      brandLabel: p.brand.name,
      meta: "License · theo gói",
      priceLabel: `Từ ${variant.priceVnd.toLocaleString("vi-VN")}đ`,
      imageUrl: parseStringList(p.galleryUrls)[0],
      features: [p.brand.name, "Hỗ trợ tiếng Việt"],
      brand: inferBackupBrand(p.name, p.brand.name),
      tabs: inferBackupTabs(p.name),
    });
  }

  const slot = backupRotationSlot();
  scored.sort(
    (a, b) => backupMix(slot, a.id) - backupMix(slot, b.id) || a.id.localeCompare(b.id),
  );
  const featured = scored;
  if (featured.length > 0) {
    return { featured, usingFallback: false };
  }
  return { featured: [], usingFallback: false };
}

const EXPIRING_SOON_MS = 30 * 24 * 60 * 60 * 1000;

function heroAssetStatus(
  type: DeliverableType,
  expiresAt: Date | null,
  disabledAt: Date | null | undefined,
): HeroAssetPreview["status"] {
  if (disabledAt) return "expired";
  if (expiresAt) {
    const t = expiresAt.getTime();
    if (t < Date.now()) return "expired";
    if (t - Date.now() <= EXPIRING_SOON_MS) return "expiring";
  }
  if (type === "EXTERNAL_PORTAL" || type === "SUBSCRIPTION") return "pending";
  return "active";
}

async function readSolutionHero(file: string, fallback: { heroImageUrl: string }) {
  const [cmsRaw, storage] = await Promise.all([readJsonFile(file, fallback), resolveStorage()]);
  const mediaBase =
    storage.driver === "wasabi"
      ? storage.wasabi.publicBaseUrl ||
        `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
      : "";
  const cms = { ...fallback, ...cmsRaw };
  return resolveMediaUrl(cms.heroImageUrl, mediaBase) || cms.heroImageUrl || undefined;
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const page = SOLUTION_PAGES[slug];
  if (!page) notFound();

  if (slug === "by-need") {
    return <ByNeedSolutionLanding />;
  }

  if (slug === "cloud") {
    const [{ featured }, cmsRaw, storage] = await Promise.all([
      loadCloudFeatured(),
      readJsonFile("cloud-solution.json", defaultCmsCloudSolution),
      resolveStorage(),
    ]);
    const mediaBase =
      storage.driver === "wasabi"
        ? storage.wasabi.publicBaseUrl ||
          `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
        : "";
    const cms = { ...defaultCmsCloudSolution, ...cmsRaw };
    const heroImageUrl =
      resolveMediaUrl(cms.heroImageUrl, mediaBase) || cms.heroImageUrl || undefined;
    return <CloudSolutionLanding featured={featured} heroImageUrl={heroImageUrl} />;
  }

  if (slug === "security") {
    const [{ featured }, heroImageUrl] = await Promise.all([
      loadSecurityFeatured(),
      readSolutionHero("security-solution.json", defaultCmsSecuritySolution),
    ]);
    return <SecuritySolutionLanding featured={featured} heroImageUrl={heroImageUrl} />;
  }

  if (slug === "backup") {
    const [{ featured }, heroImageUrl] = await Promise.all([
      loadBackupFeatured(),
      readSolutionHero("backup-solution.json", defaultCmsBackupSolution),
    ]);
    return <BackupSolutionLanding featured={featured} heroImageUrl={heroImageUrl} />;
  }

  if (slug === "license-management") {
    const session = await readSession();
    let assets: HeroAssetPreview[] = [];
    if (session) {
      const orderWhere = await customerOrderWhere({
        id: session.id,
        email: session.email,
      });
      const deliveries = await prisma.delivery.findMany({
        where: {
          orderItem: { order: orderWhere },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: {
          orderItem: {
            include: {
              consumedLicenses: {
                orderBy: { consumedAt: "desc" },
                take: 1,
                select: { expiresAt: true, disabledAt: true },
              },
            },
          },
        },
      });
      assets = deliveries.map((d) => {
        const meta = d.orderItem.consumedLicenses[0];
        const expiresAt = meta?.expiresAt ?? null;
        return {
          id: d.id,
          name: d.orderItem.title,
          meta: expiresAt
            ? `Hết hạn ${expiresAt.toLocaleDateString("vi-VN")}`
            : "Đã giao",
          status: heroAssetStatus(d.deliverableType, expiresAt, meta?.disabledAt),
        };
      });
    }
    return (
      <LicenseManagementSolutionLanding
        loggedIn={Boolean(session)}
        assets={assets}
      />
    );
  }

  if (slug === "microsoft-365-office") {
    const [{ featured }, cmsRaw, storage] = await Promise.all([
      loadProductivityFeatured(),
      readJsonFile("productivity.json", defaultCmsProductivity),
      resolveStorage(),
    ]);
    const mediaBase =
      storage.driver === "wasabi"
        ? storage.wasabi.publicBaseUrl ||
          `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
        : "";
    const cms = { ...defaultCmsProductivity, ...cmsRaw };
    return (
      <ProductivitySolutionLanding
        featured={featured}
        heroImageUrl={resolveMediaUrl(cms.heroImageUrl, mediaBase) || cms.heroImageUrl || undefined}
        consultImageUrl={
          resolveMediaUrl(cms.consultImageUrl, mediaBase) || cms.consultImageUrl || undefined
        }
        workSceneImageUrl={
          resolveMediaUrl(cms.workSceneImageUrl, mediaBase) || cms.workSceneImageUrl || undefined
        }
      />
    );
  }

  return <IaLandingPage page={page} hubLabel="Giải pháp" hubHref="/solutions" />;
}
