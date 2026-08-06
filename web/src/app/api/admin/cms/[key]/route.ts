import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { AppError, toErrorResponse } from "@/lib/errors";
import { assertStaffCapability } from "@/lib/staff-access";
import { MAIN_SEO_PATHS } from "@/lib/seo-main-pages";
import { resolveMediaUrl } from "@/lib/media-url";
import { normalizeSiteSettings } from "@/server/seo/settings";
import { resolveStorage } from "@/server/storage/config";
import {
  defaultBlog,
  defaultCmsBanner,
  defaultCmsProductivity,
  defaultCmsFaq,
  defaultCmsFooter,
  defaultCmsHome,
  defaultCmsNav,
  defaultCmsPartners,
  defaultCmsCategories,
  defaultCmsCheckout,
  defaultCmsAccount,
  defaultCmsContact,
  defaultCmsPolicy,
  defaultStaticPages,
  defaultSettings,
  defaultCmsProductRatings,
  readJsonFile,
  writeJsonFile,
  type BlogPost,
  type CmsBanner,
  type CmsProductivity,
  type CmsCheckout,
  type CmsAccount,
  type CmsContact,
  type CmsPolicy,
  type CmsStaticPage,
  type CmsCategories,
  type CmsFaqItem,
  type CmsFooter,
  type CmsHome,
  type CmsNav,
  type CmsPartners,
  type CmsProductRatings,
  type SiteSettings,
} from "@/server/cms/store";

async function requireAdmin() {
  const session = await readSession();
  if (!session || !isStaff(session.role)) return null;
  return session;
}

function requireSettingsAdmin(
  session: NonNullable<Awaited<ReturnType<typeof requireAdmin>>>,
) {
  assertStaffCapability(
    session.role,
    "settings",
    "Không có quyền cấu hình SEO / cài đặt hệ thống",
  );
}

const pageSeoOverrideSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  ogImageUrl: z
    .string()
    .max(2000)
    .optional()
    .refine(
      (v) =>
        !v ||
        v.startsWith("/") ||
        /^https?:\/\//i.test(v),
      "Ảnh chia sẻ phải là path hoặc URL hợp lệ",
    ),
});

const settingsSchema = z.object({
  siteName: z.string().min(1).max(120),
  supportEmail: z.string().email().max(200),
  seoTitle: z.string().min(1).max(200),
  seoDescription: z.string().min(1).max(500),
  ogImageUrl: z
    .string()
    .max(2000)
    .optional()
    .refine(
      (v) =>
        !v ||
        v.startsWith("/") ||
        /^https?:\/\//i.test(v),
      "Ảnh chia sẻ phải là path hoặc URL hợp lệ",
    ),
  pageSeo: z
    .record(z.string(), pageSeoOverrideSchema)
    .optional()
    .refine(
      (map) =>
        !map ||
        Object.keys(map).every((k) =>
          (MAIN_SEO_PATHS as string[]).includes(k),
        ),
      "pageSeo chứa path không được phép",
    ),
});

const FILES: Record<string, { file: string; fallback: unknown }> = {
  settings: { file: "settings.json", fallback: defaultSettings },
  home: { file: "home.json", fallback: defaultCmsHome },
  blog: { file: "blog.json", fallback: defaultBlog },
  banner: { file: "banner.json", fallback: defaultCmsBanner },
  productivity: { file: "productivity.json", fallback: defaultCmsProductivity },
  faq: { file: "faq.json", fallback: defaultCmsFaq },
  footer: { file: "footer.json", fallback: defaultCmsFooter },
  nav: { file: "nav.json", fallback: defaultCmsNav },
  partners: { file: "partners.json", fallback: defaultCmsPartners },
  categories: { file: "categories.json", fallback: defaultCmsCategories },
  checkout: { file: "checkout.json", fallback: defaultCmsCheckout },
  account: { file: "account.json", fallback: defaultCmsAccount },
  contact: { file: "contact-page.json", fallback: defaultCmsContact },
  policy: { file: "policy-page.json", fallback: defaultCmsPolicy },
  pages: { file: "static-pages.json", fallback: defaultStaticPages },
  "product-ratings": {
    file: "product-ratings.json",
    fallback: defaultCmsProductRatings,
  },
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string }> },
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { key } = await ctx.params;
    if (key === "settings") {
      requireSettingsAdmin(session);
    } else {
      assertStaffCapability(
        session.role,
        "cms_mutate",
        "Không có quyền xem CMS",
      );
    }
    const entry = FILES[key];
    if (!entry) return NextResponse.json({ error: "Unknown key" }, { status: 404 });
    if (key === "settings") {
      const raw = await readJsonFile("settings.json", defaultSettings);
      return NextResponse.json(normalizeSiteSettings(raw));
    }
    return NextResponse.json(await readJsonFile(entry.file, entry.fallback));
  } catch (e) {
    return toErrorResponse(e, "cms.get");
  }
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ key: string }> },
) {
  try {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { key } = await ctx.params;
  const body = await req.json();

  if (key === "settings") {
    requireSettingsAdmin(session);
  } else {
    assertStaffCapability(
      session.role,
      "cms_mutate",
      "Không có quyền sửa CMS",
    );
  }

  if (key === "settings") {
    const cleanedBody = {
      ...body,
      ogImageUrl:
        typeof body?.ogImageUrl === "string" && !body.ogImageUrl.trim()
          ? undefined
          : body?.ogImageUrl,
    };
    const parsed = settingsSchema.parse(cleanedBody);
    const data = normalizeSiteSettings(parsed) satisfies SiteSettings;
    if (!data.seoTitle.trim() || !data.seoDescription.trim()) {
      throw new AppError("Thiếu tiêu đề hoặc mô tả SEO mặc định", 400);
    }
    await writeJsonFile("settings.json", data);
    return NextResponse.json({ ok: true, data });
  }
  if (key === "home") {
    const data = z
      .object({
        heroTitle: z.string(),
        heroTitleAccent: z.string().optional(),
        heroSubtitle: z.string(),
        heroCta: z.string(),
        heroCtaHref: z.string(),
        whyTitle: z.string().optional(),
        whySubtitle: z.string().optional(),
        howTitle: z.string().optional(),
        howSubtitle: z.string().optional(),
        solutionsTitle: z.string().optional(),
        solutionsSubtitle: z.string().optional(),
        ctaTitle: z.string().optional(),
        ctaSubtitle: z.string().optional(),
        ctaLabel: z.string().optional(),
        ctaHref: z.string().optional(),
        published: z.boolean(),
      })
      .parse(body) satisfies CmsHome;
    await writeJsonFile("home.json", data);
    return NextResponse.json({ ok: true, data });
  }
  if (key === "blog") {
    const data = z.array(z.any()).parse(body) as BlogPost[];
    await writeJsonFile("blog.json", data);
    return NextResponse.json({ ok: true, count: data.length });
  }
  if (key === "banner") {
    const data = z
      .object({
        title: z.string(),
        ctaLabel: z.string(),
        ctaHref: z.string(),
        imageUrl: z.string(),
        visible: z.boolean(),
      })
      .parse(body) satisfies CmsBanner;
    await writeJsonFile("banner.json", data);
    return NextResponse.json({ ok: true, data });
  }
  if (key === "productivity") {
    const storage = await resolveStorage();
    const mediaBase =
      storage.driver === "wasabi"
        ? storage.wasabi.publicBaseUrl ||
          `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
        : "";
    const data = z
      .object({
        heroImageUrl: z.string(),
        consultImageUrl: z.string(),
        workSceneImageUrl: z.string(),
      })
      .parse({
        ...body,
        heroImageUrl: resolveMediaUrl(String(body?.heroImageUrl ?? ""), mediaBase) || String(body?.heroImageUrl ?? ""),
        consultImageUrl:
          resolveMediaUrl(String(body?.consultImageUrl ?? ""), mediaBase) ||
          String(body?.consultImageUrl ?? ""),
        workSceneImageUrl:
          resolveMediaUrl(String(body?.workSceneImageUrl ?? ""), mediaBase) ||
          String(body?.workSceneImageUrl ?? ""),
      }) satisfies CmsProductivity;
    await writeJsonFile("productivity.json", data);
    return NextResponse.json({ ok: true, data });
  }
  if (key === "faq") {
    const data = z
      .array(
        z.object({
          id: z.string(),
          question: z.string(),
          answer: z.string(),
          category: z
            .enum(["payment", "delivery", "account", "general"])
            .default("general"),
          showOnHome: z.boolean(),
          showOnFaqPage: z.boolean(),
        }),
      )
      .parse(body) as CmsFaqItem[];
    await writeJsonFile("faq.json", data);
    return NextResponse.json({ ok: true, data });
  }
  if (key === "footer") {
    const storage = await resolveStorage();
    const mediaBase =
      storage.driver === "wasabi"
        ? storage.wasabi.publicBaseUrl ||
          `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
        : "";
    const link = z.object({ label: z.string(), href: z.string() });
    const data = z
      .object({
        logoUrl: z.string().optional(),
        brandName: z.string().min(1).max(48),
        blurb: z.string(),
        columns: z.array(
          z.object({ title: z.string(), links: z.array(link) }),
        ),
        copyright: z.string(),
        legalLinks: z.array(link),
      })
      .parse({
        ...body,
        brandName:
          typeof body?.brandName === "string" && body.brandName.trim()
            ? body.brandName.trim()
            : defaultCmsFooter.brandName,
        logoUrl:
          typeof body?.logoUrl === "string" && body.logoUrl.trim()
            ? resolveMediaUrl(body.logoUrl.trim(), mediaBase) ||
              body.logoUrl.trim()
            : undefined,
      }) satisfies CmsFooter;
    await writeJsonFile("footer.json", data);
    return NextResponse.json({ ok: true, data });
  }
  if (key === "nav") {
    const storage = await resolveStorage();
    const mediaBase =
      storage.driver === "wasabi"
        ? storage.wasabi.publicBaseUrl ||
          `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
        : "";
    const data = z
      .object({
        logoUrl: z.string().optional(),
        brandName: z.string().min(1).max(48),
        tagline: z.string().max(80),
        items: z.array(z.object({ label: z.string(), href: z.string() })),
      })
      .parse({
        ...body,
        brandName:
          typeof body?.brandName === "string" && body.brandName.trim()
            ? body.brandName.trim()
            : defaultCmsNav.brandName,
        tagline:
          typeof body?.tagline === "string" ? body.tagline.trim() : defaultCmsNav.tagline,
        logoUrl:
          typeof body?.logoUrl === "string" && body.logoUrl.trim()
            ? resolveMediaUrl(body.logoUrl.trim(), mediaBase) ||
              body.logoUrl.trim()
            : undefined,
      }) satisfies CmsNav;
    await writeJsonFile("nav.json", data);
    return NextResponse.json({ ok: true, data });
  }
  if (key === "partners") {
    const data = z
      .object({
        title: z.string(),
        badges: z.array(z.string()),
        items: z.array(
          z.object({
            id: z.string(),
            brandId: z.string().min(1).optional(),
            href: z.string().optional(),
            visible: z.boolean(),
            /** Legacy fields — optional for older partners.json / migration */
            name: z.string().optional(),
            logoUrl: z.string().optional(),
            brandColor: z.string().optional(),
          }),
        ),
      })
      .parse(body) satisfies CmsPartners;
    // Drop rows that are neither linked to Catalog nor legacy-named
    const cleaned: CmsPartners = {
      ...data,
      items: data.items.filter((item) => Boolean(item.brandId || item.name)),
    };
    await writeJsonFile("partners.json", cleaned);
    return NextResponse.json({ ok: true, data: cleaned });
  }
  if (key === "categories") {
    const iconKey = z.enum([
      "windows",
      "office",
      "adobe",
      "cloud",
      "security",
      "autodesk",
      "backup",
      "other",
    ]);
    const data = z
      .object({
        title: z.string(),
        viewAllHref: z.string().min(1),
        viewAllLabel: z.string().min(1),
        items: z
          .array(
            z.object({
              id: z.string(),
              title: z.string().min(1).max(24),
              countLabel: z.string(),
              href: z.string().min(1),
              iconUrl: z.string().optional(),
              accentColor: z.string().optional(),
              iconKey: iconKey.optional(),
              visible: z.boolean(),
              sortOrder: z.number().int(),
            }),
          )
          .max(8),
      })
      .parse(body) satisfies CmsCategories;
    await writeJsonFile("categories.json", data);
    return NextResponse.json({ ok: true, data });
  }
  if (key === "checkout") {
    const trust = z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    });
    const bar = z.object({ id: z.string(), label: z.string(), sub: z.string() });
    const data = z
      .object({
        securityLine: z.string(),
        warrantyBadge: z.string(),
        emailHelp: z.string(),
        paidNote: z.string(),
        continueCtaLabel: z.string().optional(),
        continueCtaHint: z.string().optional(),
        confirmTitle: z.string().optional(),
        confirmLead: z.string().optional(),
        orderInfoTitle: z.string().optional(),
        vatIncludedNote: z.string().optional(),
        paymentMethodCardTitle: z.string().optional(),
        selectedMethodBadge: z.string().optional(),
        payAmountLabel: z.string().optional(),
        timerLabel: z.string().optional(),
        expireHint: z.string().optional(),
        nextStepsTitle: z.string().optional(),
        nextSteps: z
          .array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
            }),
          )
          .optional(),
        qrCardTitle: z.string().optional(),
        qrNetworkLabel: z.string().optional(),
        amountFieldLabel: z.string().optional(),
        contentFieldLabel: z.string().optional(),
        reloadQrLabel: z.string().optional(),
        backToMethodLabel: z.string().optional(),
        payCtaLabel: z.string(),
        payCtaHint: z.string(),
        comingSoonNote: z.string(),
        whyTitle: z.string(),
        whyItems: z.array(trust),
        supportTitle: z.string(),
        supportLiveChatLabel: z.string(),
        supportLiveChatHref: z.string(),
        supportEmailLabel: z.string(),
        supportPhone: z.string(),
        trustBar: z.array(bar),
        confirmTrustBar: z.array(bar).optional(),
        paymentMethods: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            subtitle: z.string(),
            badge: z.string().optional(),
            provider: z.enum(["sepay_qr", "coming_soon"]),
            enabled: z.boolean(),
          }),
        ),
        vatLabel: z.string(),
        feeLabel: z.string(),
        feeValue: z.string(),
        successTitle: z.string().optional(),
        successLead: z.string().optional(),
        successOrderCodeLabel: z.string().optional(),
        successTimeLabel: z.string().optional(),
        successMethodLabel: z.string().optional(),
        successViewOrderCta: z.string().optional(),
        successHomeCta: z.string().optional(),
        licenseSectionTitle: z.string().optional(),
        licenseReadyBadge: z.string().optional(),
        licenseKeyLabel: z.string().optional(),
        licenseShowLabel: z.string().optional(),
        licenseHideLabel: z.string().optional(),
        licenseCopyLabel: z.string().optional(),
        licensePendingNote: z.string().optional(),
        activationStepsTitle: z.string().optional(),
        activationSteps: z
          .array(z.object({ id: z.string(), text: z.string() }))
          .optional(),
        activationGuideCta: z.string().optional(),
        activationGuideHref: z.string().optional(),
        summaryPaidBanner: z.string().optional(),
        successSupportTitle: z.string().optional(),
        successSupportLinks: z
          .array(z.object({ id: z.string(), title: z.string(), href: z.string() }))
          .optional(),
        accountUpsellTitle: z.string().optional(),
        accountUpsellBody: z.string().optional(),
        accountUpsellCta: z.string().optional(),
        accountUpsellHref: z.string().optional(),
        recommendedTitle: z.string().optional(),
        recommendedViewAllLabel: z.string().optional(),
      })
      .parse(body);
    const normalized: CmsCheckout = {
      ...defaultCmsCheckout,
      ...data,
      continueCtaLabel: data.continueCtaLabel ?? defaultCmsCheckout.continueCtaLabel,
      continueCtaHint: data.continueCtaHint ?? defaultCmsCheckout.continueCtaHint,
      confirmTitle: data.confirmTitle ?? defaultCmsCheckout.confirmTitle,
      confirmLead: data.confirmLead ?? defaultCmsCheckout.confirmLead,
      orderInfoTitle: data.orderInfoTitle ?? defaultCmsCheckout.orderInfoTitle,
      vatIncludedNote: data.vatIncludedNote ?? defaultCmsCheckout.vatIncludedNote,
      paymentMethodCardTitle:
        data.paymentMethodCardTitle ?? defaultCmsCheckout.paymentMethodCardTitle,
      selectedMethodBadge:
        data.selectedMethodBadge ?? defaultCmsCheckout.selectedMethodBadge,
      payAmountLabel: data.payAmountLabel ?? defaultCmsCheckout.payAmountLabel,
      timerLabel: data.timerLabel ?? defaultCmsCheckout.timerLabel,
      expireHint: data.expireHint ?? defaultCmsCheckout.expireHint,
      nextStepsTitle: data.nextStepsTitle ?? defaultCmsCheckout.nextStepsTitle,
      nextSteps: data.nextSteps?.length
        ? data.nextSteps
        : defaultCmsCheckout.nextSteps,
      qrCardTitle: data.qrCardTitle ?? defaultCmsCheckout.qrCardTitle,
      qrNetworkLabel: data.qrNetworkLabel ?? defaultCmsCheckout.qrNetworkLabel,
      amountFieldLabel: data.amountFieldLabel ?? defaultCmsCheckout.amountFieldLabel,
      contentFieldLabel:
        data.contentFieldLabel ?? defaultCmsCheckout.contentFieldLabel,
      reloadQrLabel: data.reloadQrLabel ?? defaultCmsCheckout.reloadQrLabel,
      backToMethodLabel:
        data.backToMethodLabel ?? defaultCmsCheckout.backToMethodLabel,
      confirmTrustBar: data.confirmTrustBar?.length
        ? data.confirmTrustBar
        : defaultCmsCheckout.confirmTrustBar,
      activationSteps: data.activationSteps?.length
        ? data.activationSteps
        : defaultCmsCheckout.activationSteps,
      successSupportLinks: data.successSupportLinks?.length
        ? data.successSupportLinks
        : defaultCmsCheckout.successSupportLinks,
      successTitle: data.successTitle ?? defaultCmsCheckout.successTitle,
      successLead: data.successLead ?? defaultCmsCheckout.successLead,
      successOrderCodeLabel:
        data.successOrderCodeLabel ?? defaultCmsCheckout.successOrderCodeLabel,
      successTimeLabel: data.successTimeLabel ?? defaultCmsCheckout.successTimeLabel,
      successMethodLabel:
        data.successMethodLabel ?? defaultCmsCheckout.successMethodLabel,
      successViewOrderCta:
        data.successViewOrderCta ?? defaultCmsCheckout.successViewOrderCta,
      successHomeCta: data.successHomeCta ?? defaultCmsCheckout.successHomeCta,
      licenseSectionTitle:
        data.licenseSectionTitle ?? defaultCmsCheckout.licenseSectionTitle,
      licenseReadyBadge:
        data.licenseReadyBadge ?? defaultCmsCheckout.licenseReadyBadge,
      licenseKeyLabel: data.licenseKeyLabel ?? defaultCmsCheckout.licenseKeyLabel,
      licenseShowLabel: data.licenseShowLabel ?? defaultCmsCheckout.licenseShowLabel,
      licenseHideLabel: data.licenseHideLabel ?? defaultCmsCheckout.licenseHideLabel,
      licenseCopyLabel: data.licenseCopyLabel ?? defaultCmsCheckout.licenseCopyLabel,
      licensePendingNote:
        data.licensePendingNote ?? defaultCmsCheckout.licensePendingNote,
      activationStepsTitle:
        data.activationStepsTitle ?? defaultCmsCheckout.activationStepsTitle,
      activationGuideCta:
        data.activationGuideCta ?? defaultCmsCheckout.activationGuideCta,
      activationGuideHref:
        data.activationGuideHref ?? defaultCmsCheckout.activationGuideHref,
      summaryPaidBanner:
        data.summaryPaidBanner ?? defaultCmsCheckout.summaryPaidBanner,
      successSupportTitle:
        data.successSupportTitle ?? defaultCmsCheckout.successSupportTitle,
      accountUpsellTitle:
        data.accountUpsellTitle ?? defaultCmsCheckout.accountUpsellTitle,
      accountUpsellBody:
        data.accountUpsellBody ?? defaultCmsCheckout.accountUpsellBody,
      accountUpsellCta: data.accountUpsellCta ?? defaultCmsCheckout.accountUpsellCta,
      accountUpsellHref:
        data.accountUpsellHref ?? defaultCmsCheckout.accountUpsellHref,
      recommendedTitle: data.recommendedTitle ?? defaultCmsCheckout.recommendedTitle,
      recommendedViewAllLabel:
        data.recommendedViewAllLabel ?? defaultCmsCheckout.recommendedViewAllLabel,
    };
    await writeJsonFile("checkout.json", normalized);
    return NextResponse.json({ ok: true, data: normalized });
  }

  if (key === "account") {
    const data = z
      .object({
        contactPhone: z.string(),
        contactEmail: z.string(),
        contactBarLead: z.string(),
        warrantyBadge: z.string(),
        supportCardTitle: z.string(),
        supportCardBody: z.string(),
        supportCardCta: z.string(),
        promoTitle: z.string(),
        promoBody: z.string(),
        promoCta: z.string(),
        promoHref: z.string(),
        activationGuideCta: z.string(),
        activationGuideHref: z.string(),
        licenseSecurityNote: z.string(),
        feeValue: z.string(),
        overviewWelcomeHi: z.string(),
        overviewWelcomeBody: z.string(),
        licensesBannerTitle: z.string(),
        licensesBannerBody: z.string(),
        licensesTrust1Title: z.string(),
        licensesTrust1Body: z.string(),
        licensesTrust2Title: z.string(),
        licensesTrust2Body: z.string(),
        licensesTrust3Title: z.string(),
        licensesTrust3Body: z.string(),
        licensesTrust4Title: z.string(),
        licensesTrust4Body: z.string(),
        securityLead: z.string(),
        notificationsLead: z.string(),
        ticketsLead: z.string(),
      })
      .parse(body) satisfies CmsAccount;
    const normalized: CmsAccount = { ...defaultCmsAccount, ...data };
    await writeJsonFile("account.json", normalized);
    return NextResponse.json({ ok: true, data: normalized });
  }
  if (key === "contact") {
    const topic = z.object({ id: z.string(), label: z.string() });
    const data = z
      .object({
        heroTitle: z.string(),
        heroTitleAccent: z.string(),
        heroLead: z.string(),
        mapCompany: z.string(),
        mapAddress: z.string(),
        mapMapsUrl: z.string(),
        mapMapsCta: z.string(),
        mapEmbedUrl: z.string(),
        infoTitle: z.string(),
        infoLead: z.string(),
        hotlineLabel: z.string().optional(),
        hotlineValue: z.string(),
        hotlineHint: z.string(),
        emailLabel: z.string().optional(),
        emailValue: z.string(),
        emailHint: z.string(),
        chatLabel: z.string().optional(),
        chatValue: z.string(),
        chatHint: z.string(),
        chatHref: z.string().optional(),
        hoursLabel: z.string().optional(),
        hoursValue: z.string(),
        hoursHint: z.string(),
        formTitle: z.string(),
        formLead: z.string(),
        formNameLabel: z.string().optional(),
        formNamePlaceholder: z.string().optional(),
        formEmailLabel: z.string().optional(),
        formEmailPlaceholder: z.string().optional(),
        formPhoneLabel: z.string().optional(),
        formPhonePlaceholder: z.string().optional(),
        formTopicLabel: z.string().optional(),
        formTopicPlaceholder: z.string().optional(),
        formTopics: z.array(topic),
        formMessageLabel: z.string().optional(),
        formMessagePlaceholder: z.string().optional(),
        formPrivacyLabel: z.string().optional(),
        formPrivacyHref: z.string(),
        formSubmit: z.string(),
        formSuccess: z.string().optional(),
        instantTitle: z.string(),
        instantBody: z.string(),
        instantCta: z.string(),
        instantCtaHref: z.string(),
        instantPerks: z.array(z.string()),
      })
      .parse(body);
    const normalized: CmsContact = { ...defaultCmsContact, ...data };
    await writeJsonFile("contact-page.json", normalized);
    return NextResponse.json({ ok: true, data: normalized });
  }
  if (key === "policy") {
    const item = z.object({
      id: z.string(),
      slug: z.string().min(1),
      title: z.string().min(1),
      description: z.string(),
      iconKey: z.enum([
        "terms",
        "delivery",
        "refund",
        "warranty",
        "privacy",
        "payment",
        "support",
        "complaint",
      ]),
      body: z.string(),
      updatedAt: z.string().optional(),
      pdfUrl: z.string().optional(),
    });
    const data = z
      .object({
        heroTitle: z.string(),
        heroTitleAccent: z.string(),
        heroLead: z.string(),
        cardCta: z.string(),
        supportTitle: z.string(),
        supportBody: z.string(),
        supportCta: z.string(),
        supportCtaHref: z.string(),
        supportPhone: z.string(),
        supportPhoneHint: z.string(),
        supportEmail: z.string(),
        supportEmailHint: z.string(),
        sidebarTitle: z.string(),
        detailSupportTitle: z.string(),
        detailSupportBody: z.string(),
        detailUpdatedLabel: z.string(),
        detailPdfLabel: z.string(),
        openSectionCount: z.number().int().min(0).max(20),
        /** Legacy fallback only — live policy bodies live in static-pages.json */
        items: z.array(item).optional(),
      })
      .parse(body);
    const existing = await readJsonFile("policy-page.json", defaultCmsPolicy);
    const normalized: CmsPolicy = {
      ...defaultCmsPolicy,
      ...existing,
      ...data,
      items:
        data.items && data.items.length > 0
          ? data.items
          : existing.items?.length
            ? existing.items
            : defaultCmsPolicy.items,
    };
    await writeJsonFile("policy-page.json", normalized);
    return NextResponse.json({ ok: true, data: normalized });
  }
  if (key === "pages") {
    const pageSchema = z.object({
      id: z.string().min(1),
      slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm a-z, 0-9, gạch ngang"),
      title: z.string().min(1),
      description: z.string(),
      body: z.string(),
      status: z.enum(["draft", "published"]),
      collection: z.enum(["policy", "legal", "general"]),
      template: z.enum(["policy", "simple"]),
      iconKey: z
        .enum([
          "terms",
          "delivery",
          "refund",
          "warranty",
          "privacy",
          "payment",
          "support",
          "complaint",
        ])
        .optional(),
      sortOrder: z.number().int(),
      pdfUrl: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      createdAt: z.string(),
      updatedAt: z.string(),
      publishedAt: z.string().optional(),
    });
    const data = z.array(pageSchema).parse(body) as CmsStaticPage[];
    const slugs = data.map((p) => p.slug);
    if (new Set(slugs).size !== slugs.length) {
      return NextResponse.json(
        { error: "Slug bị trùng — mỗi trang cần slug duy nhất" },
        { status: 400 },
      );
    }
    await writeJsonFile("static-pages.json", data);
    return NextResponse.json({ ok: true, count: data.length });
  }
  if (key === "product-ratings") {
    const data = z
      .object({
        items: z.array(
          z.object({
            productKey: z.string().min(1),
            ratingAvg: z.number().min(0).max(5),
            reviewCount: z.number().int().min(0),
          }),
        ),
      })
      .parse(body) satisfies CmsProductRatings;
    await writeJsonFile("product-ratings.json", data);
    return NextResponse.json({ ok: true, data });
  }

  return NextResponse.json({ error: "Unknown key" }, { status: 404 });
  } catch (e) {
    return toErrorResponse(e, "cms.put");
  }
}
