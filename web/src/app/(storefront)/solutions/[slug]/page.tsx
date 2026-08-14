import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { LicenseManagementSolutionLanding } from "@/storefront/components/solutions/LicenseManagementSolutionLanding";
import { SoftwareLicensingLanding } from "@/storefront/components/solutions/SoftwareLicensingLanding";
import { SOLUTION_PAGES } from "@/storefront/nav/ia-pages";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import { inferCategory } from "@/storefront/components/shop/shop-utils";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { defaultCmsProductivity, readJsonFile } from "@/server/cms/store";
import { resolveMediaUrl } from "@/lib/media-url";
import { resolveStorage } from "@/server/storage/config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(SOLUTION_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = SOLUTION_PAGES[slug];
  if (!page) return buildMainPageMetadata("/business");
  if (slug === "software-licensing") {
    return {
      ...(await buildMainPageMetadata("/solutions/software-licensing")),
      title: "Bản quyền phần mềm | KEYON",
      description:
        "License chính hãng đúng nhu cầu: perpetual, subscription hoặc volume — nhận hàng rõ ràng, hỗ trợ tiếng Việt.",
    };
  }
  if (slug === "cloud") {
    return {
      ...(await buildMainPageMetadata("/solutions/cloud")),
      title: "Cloud linh hoạt cho doanh nghiệp | KEYON",
      description:
        "Giải pháp cloud KEYON: hạ tầng, storage, backup và tư vấn triển khai cho doanh nghiệp hiện đại.",
    };
  }
  if (slug === "productivity") {
    return {
      ...(await buildMainPageMetadata("/solutions/productivity")),
      title: "Năng suất & Cộng tác | KEYON",
      description:
        "Microsoft 365, Office, Teams và công cụ cộng tác chính hãng trên KEYON — kích hoạt nhanh, hỗ trợ tiếng Việt.",
    };
  }
  if (slug === "security") {
    return {
      ...(await buildMainPageMetadata("/solutions/security")),
      title: "Bảo mật | KEYON",
      description:
        "Giải pháp bảo mật KEYON: endpoint, antivirus và bảo vệ thiết bị — license chính hãng, hỗ trợ tiếng Việt.",
    };
  }
  if (slug === "backup") {
    return {
      ...(await buildMainPageMetadata("/solutions/backup")),
      title: "Backup & Khôi phục | KEYON",
      description:
        "Sao lưu và khôi phục dữ liệu trên KEYON — endpoint, server, cloud và SaaS, license chính hãng.",
    };
  }
  if (slug === "license-management") {
    return {
      ...(await buildMainPageMetadata("/solutions/license-management")),
      title: "Quản lý bản quyền | KEYON",
      description:
        "Theo dõi, cảnh báo gia hạn và tối ưu chi phí license trên một nền tảng KEYON — minh bạch và chủ động.",
    };
  }
  return {
    ...(await buildMainPageMetadata(`/solutions/${slug}`)),
    title: `${page.title} | KEYON`,
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
      icon: "server",
    });
    if (cloudish.length >= 5) break;
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
        features: [p.brand.name, "License chính hãng", "Hỗ trợ tiếng Việt"],
        brand: inferSecurityBrand(p.name, p.brand.name),
      },
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const featured = scored.slice(0, 5).map((s) => s.item);
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
    take: 80,
  });

  const scored: { score: number; item: BackupFeaturedProduct }[] = [];
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

    let score = 0;
    if (nameL.includes("acronis")) score += 50;
    else if (nameL.includes("veeam")) score += 48;
    else if (nameL.includes("aomei")) score += 45;
    else if (nameL.includes("365") && nameL.includes("backup")) score += 42;
    else if (nameL.includes("backup")) score += 30;
    if (cat === "backup") score += 10;

    scored.push({
      score,
      item: {
        id: p.id,
        title: p.name,
        href: `/products/${p.slug}`,
        brandLabel: p.brand.name,
        meta: "License · theo gói",
        priceLabel: `Từ ${variant.priceVnd.toLocaleString("vi-VN")}đ`,
        features: [p.brand.name, "License chính hãng", "Hỗ trợ tiếng Việt"],
        brand: inferBackupBrand(p.name, p.brand.name),
        tabs: inferBackupTabs(p.name),
      },
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const featured = scored.slice(0, 8).map((s) => s.item);
  if (featured.length > 0) {
    return { featured, usingFallback: false };
  }
  return { featured: [], usingFallback: false };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const page = SOLUTION_PAGES[slug];
  if (!page) notFound();

  if (slug === "software-licensing") {
    return <SoftwareLicensingLanding />;
  }

  if (slug === "cloud") {
    const { featured } = await loadCloudFeatured();
    return <CloudSolutionLanding featured={featured} />;
  }

  if (slug === "security") {
    const { featured } = await loadSecurityFeatured();
    return <SecuritySolutionLanding featured={featured} />;
  }

  if (slug === "backup") {
    const { featured } = await loadBackupFeatured();
    return <BackupSolutionLanding featured={featured} />;
  }

  if (slug === "license-management") {
    return <LicenseManagementSolutionLanding />;
  }

  if (slug === "productivity") {
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
