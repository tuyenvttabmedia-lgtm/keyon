export type BlogCategoryId =
  | "ban-quyen"
  | "windows"
  | "m365"
  | "doanh-nghiep"
  | "huong-dan"
  | "bao-mat"
  | "tin-keyon";

export type BlogCoverTone =
  | "navy"
  | "teal"
  | "sky"
  | "violet"
  | "orange"
  | "emerald";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** HTML (TipTap) or legacy markdown-ish text */
  body: string;
  status: "draft" | "published";
  metaTitle: string;
  metaDescription: string;
  coverUrl?: string;
  coverAlt?: string;
  coverCaption?: string;
  /** Optional category for index filters */
  category?: BlogCategoryId;
  /**
   * IA Resource section (NAV-03). When omitted, inferred from category
   * (huong-dan→guides, tin-keyon→news, topical→insights, else news).
   */
  section?: "insights" | "guides" | "news";
  author?: string;
  /** Cached estimate; UI auto-computes from body when missing */
  readMinutes?: number;
  featured?: boolean;
  coverTone?: BlogCoverTone;
  tags?: string[];
  focusKeyword?: string;
  canonicalUrl?: string;
  /** Default true when omitted */
  robotsIndex?: boolean;
  /** Default true when omitted */
  robotsFollow?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  updatedAt: string;
  publishedAt?: string;
};

/** Blog index page chrome (listing, not post body). */
export type CmsBlog = {
  pageTitle: string;
  pageLead: string;
  searchPlaceholder: string;
  sortNewest: string;
  sortOldest: string;
  featuredBadge: string;
  latestTitle: string;
  loadMoreCta: string;
  trendingTitle: string;
  topicsTitle: string;
  exploreTitle: string;
  exploreBody: string;
  exploreCta: string;
  exploreHref: string;
  newsletterTitle: string;
  newsletterBody: string;
  newsletterCta: string;
  newsletterEmailPlaceholder: string;
  newsletterPerk1: string;
  newsletterPerk2: string;
  newsletterPerk3: string;
  emptyTitle: string;
  emptyBody: string;
  /** Detail page */
  detailTocTitle: string;
  detailContinueCta: string;
  detailPrevLabel: string;
  detailNextLabel: string;
  detailHelpfulTitle: string;
  detailHelpfulYes: string;
  detailHelpfulNo: string;
  detailShareTitle: string;
  detailSearchTitle: string;
  detailCategoriesTitle: string;
  detailFeaturedTitle: string;
  detailTagsTitle: string;
  detailVerifiedLabel: string;
};

/** Contact page (`/contact`). */
export type CmsContact = {
  heroTitle: string;
  heroTitleAccent: string;
  heroLead: string;
  mapCompany: string;
  mapAddress: string;
  mapMapsUrl: string;
  mapMapsCta: string;
  /** OSM embed URL (optional decorative map). */
  mapEmbedUrl: string;
  infoTitle: string;
  infoLead: string;
  hotlineLabel: string;
  hotlineValue: string;
  hotlineHint: string;
  emailLabel: string;
  emailValue: string;
  emailHint: string;
  chatLabel: string;
  chatValue: string;
  chatHint: string;
  /** Optional link for Live Chat row (Zalo / Messenger / mailto / internal). Falls back to instantCtaHref. */
  chatHref?: string;
  hoursLabel: string;
  hoursValue: string;
  hoursHint: string;
  formTitle: string;
  formLead: string;
  formNameLabel: string;
  formNamePlaceholder: string;
  formEmailLabel: string;
  formEmailPlaceholder: string;
  formPhoneLabel: string;
  formPhonePlaceholder: string;
  formTopicLabel: string;
  formTopicPlaceholder: string;
  formTopics: { id: string; label: string }[];
  formMessageLabel: string;
  formMessagePlaceholder: string;
  formPrivacyLabel: string;
  formPrivacyHref: string;
  formSubmit: string;
  formSuccess: string;
  instantTitle: string;
  instantBody: string;
  instantCta: string;
  instantCtaHref: string;
  instantPerks: string[];
};

/** Per-path SEO override for main static listing pages (not product/post detail). */
export type PageSeoOverride = {
  title?: string;
  description?: string;
  ogImageUrl?: string;
};

export type SiteSettings = {
  siteName: string;
  supportEmail: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl?: string;
  /** Keyed by path, e.g. "/", "/products", "/blog". */
  pageSeo?: Record<string, PageSeoOverride>;
};

/** Object storage (Media). Secret is AES-GCM encrypted at rest. */
export type StorageSettings = {
  driver: "local" | "wasabi";
  wasabi: {
    endpoint: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKeyEnc: string;
    publicBaseUrl: string;
    pathPrefix: string;
  };
};

export type CmsHome = {
  heroTitle: string;
  /** Optional teal accent word(s) after title. Empty = no accent. */
  heroTitleAccent?: string;
  heroSubtitle: string;
  heroCta: string;
  heroCtaHref: string;
  /** Section titles — optional overlays on home fixture */
  whyTitle?: string;
  whySubtitle?: string;
  howTitle?: string;
  howSubtitle?: string;
  solutionsTitle?: string;
  solutionsSubtitle?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  published: boolean;
};

export type CmsBanner = {
  title: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  visible: boolean;
};

/** Landing `/solutions/productivity` — ảnh hero blob + tư vấn + scene work-mode. */
export type CmsProductivity = {
  /** Hero cột phải — banner trong organic blob (khuyến nghị ~960×720). */
  heroImageUrl: string;
  /** Ảnh người hỗ trợ trong card tư vấn (ecosystem cột phải). */
  consultImageUrl: string;
  /** Ảnh cột trái panel “Giải pháp theo cách bạn làm việc” (tuỳ chọn). */
  workSceneImageUrl: string;
};

export type CmsFaqCategory = "payment" | "delivery" | "account" | "general";

export type CmsFaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Group for FAQ page sidebar — scales when hundreds of questions exist */
  category: CmsFaqCategory;
  showOnHome: boolean;
  showOnFaqPage: boolean;
};

export type CmsFooter = {
  /** Footer logo (Media). Empty → fall back to header/nav logo, then letter mark. */
  logoUrl?: string;
  brandName: string;
  blurb: string;
  columns: { title: string; links: { label: string; href: string }[] }[];
  copyright: string;
  legalLinks: { label: string; href: string }[];
};

export type CmsNav = {
  /** Header logo image URL (Media library). Empty → letter mark from brandName. */
  logoUrl?: string;
  brandName: string;
  tagline: string;
  items: { label: string; href: string }[];
};

export type CmsPartnerItem = {
  id: string;
  /**
   * Catalog Brand id — nguồn tên + logo.
   * Legacy items may omit this and only have `name` (matched by brand name on resolve).
   */
  brandId?: string;
  /** Optional link override; empty → `/brands/{slug}` when resolved from catalog */
  href?: string;
  visible: boolean;
  /** @deprecated Prefer brandId — kept for legacy partners.json */
  name?: string;
  /** @deprecated Prefer Brand.logoUrl — kept for legacy partners.json */
  logoUrl?: string;
  /** @deprecated Prefer catalog brand — kept for legacy partners.json */
  brandColor?: string;
};

export type CmsPartners = {
  title: string;
  badges: string[];
  items: CmsPartnerItem[];
};

/** Fallback SVG when item has no iconUrl — matches storefront CategoryItem.icon */
export type CmsCategoryIconKey =
  | "windows"
  | "office"
  | "adobe"
  | "cloud"
  | "security"
  | "autodesk"
  | "backup"
  | "other";

export type CmsCategoryItem = {
  id: string;
  title: string;
  countLabel: string;
  href: string;
  iconUrl?: string;
  accentColor?: string;
  iconKey?: CmsCategoryIconKey;
  visible: boolean;
  sortOrder: number;
};

export type CmsCategories = {
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  items: CmsCategoryItem[];
};

export const defaultCmsBanner: CmsBanner = {
  title: "Mua bản quyền chính hãng",
  ctaLabel: "Xem sản phẩm",
  ctaHref: "/products",
  imageUrl: "",
  visible: true,
};

export const defaultCmsProductivity: CmsProductivity = {
  heroImageUrl: "",
  consultImageUrl: "",
  workSceneImageUrl: "",
};

export const defaultCmsFaq: CmsFaqItem[] = [
  {
    id: "q1",
    question: "KEYON bán gì?",
    answer:
      "Phần mềm / giấy phép bản quyền số. Bạn mua trên KEYON, nhận đúng loại đã ghi trên gói, quản lý trong Tài khoản.",
    category: "general",
    showOnHome: true,
    showOnFaqPage: true,
  },
  {
    id: "q2",
    question: "KEYON hiện hỗ trợ những phương thức thanh toán nào?",
    answer:
      "Hiện hỗ trợ chuyển khoản qua cổng thanh toán đã cấu hình (SePay). Sau khi nhận tiền, hệ thống cập nhật trạng thái đơn — bạn theo dõi trên trang đơn hàng.",
    category: "payment",
    showOnHome: false,
    showOnFaqPage: true,
  },
  {
    id: "q3",
    question: "Chuyển khoản xong bao lâu có hàng?",
    answer:
      "Có gói giao ngay sau khi thanh toán thành công. Có gói KEYON xử lý trong giờ làm việc — xem dòng ghi trên từng sản phẩm.",
    category: "payment",
    showOnHome: true,
    showOnFaqPage: true,
  },
  {
    id: "q4",
    question: "Thanh toán xong đã nhận hàng chưa?",
    answer:
      "Chưa hẳn. Đã thanh toán và đã giao là hai trạng thái riêng — luôn kiểm tra trên đơn hàng.",
    category: "payment",
    showOnHome: false,
    showOnFaqPage: true,
  },
  {
    id: "q5",
    question: "Tôi nhận hàng ở đâu?",
    answer:
      "Trong đơn hàng / Tài sản trên KEYON sau khi đăng nhập. Email chỉ để báo — hãy vào web để xem lại.",
    category: "delivery",
    showOnHome: true,
    showOnFaqPage: true,
  },
  {
    id: "q6",
    question: "Nhận hàng gồm những dạng nào?",
    answer:
      "Tùy gói: mã kích hoạt (key), tài khoản đã sẵn, hoặc hướng dẫn kích hoạt. PDP ghi rõ loại nhận trước khi mua.",
    category: "delivery",
    showOnHome: false,
    showOnFaqPage: true,
  },
  {
    id: "q7",
    question: "Làm sao xem lại giấy phép đã mua?",
    answer:
      "Đăng nhập → Tài khoản → Tài sản / Đơn hàng. Mọi giao hàng thành công lưu tại đây để mở lại khi cần.",
    category: "account",
    showOnHome: false,
    showOnFaqPage: true,
  },
  {
    id: "q8",
    question: "Quên mật khẩu thì làm thế nào?",
    answer:
      "Vào Quên mật khẩu, nhập email đã đăng ký — hệ thống gửi link đặt lại. Kiểm tra cả hộp thư spam.",
    category: "account",
    showOnHome: false,
    showOnFaqPage: true,
  },
];

export const defaultCmsFooter: CmsFooter = {
  brandName: "KEYON",
  blurb:
    "Nền tảng phân phối và quản lý bản quyền phần mềm, cloud và dịch vụ số.",
  columns: [
    {
      title: "Sản phẩm",
      links: [
        { label: "Windows", href: "/products?cat=windows" },
        { label: "Microsoft Office", href: "/products?cat=office" },
        { label: "Adobe", href: "/brands/adobe" },
        { label: "Bảo mật", href: "/products?cat=security" },
        { label: "Cloud & Server", href: "/products?cat=cloud" },
        { label: "Tất cả sản phẩm", href: "/products" },
      ],
    },
    {
      title: "Giải pháp",
      links: [
        { label: "Bản quyền phần mềm", href: "/solutions/software-licensing" },
        { label: "Năng suất & Cộng tác", href: "/solutions/productivity" },
        { label: "Cloud", href: "/solutions/cloud" },
        { label: "Bảo mật", href: "/solutions/security" },
        { label: "Quản lý bản quyền", href: "/solutions/license-management" },
      ],
    },
    {
      title: "Doanh nghiệp & Hỗ trợ",
      links: [
        { label: "Giải pháp doanh nghiệp", href: "/business" },
        { label: "Volume licensing", href: "/business/volume-licensing" },
        { label: "Tài nguyên", href: "/resources" },
        { label: "Trung tâm hỗ trợ", href: "/support" },
        { label: "FAQ", href: "/faq" },
        { label: "Liên hệ", href: "/contact" },
      ],
    },
    {
      title: "Thông tin doanh nghiệp",
      links: [
        { label: "KEYON", href: "/about" },
        { label: "support@keyon.vn", href: "mailto:support@keyon.vn" },
        { label: "Đà Nẵng, Việt Nam", href: "/contact" },
        { label: "Liên hệ kinh doanh", href: "/contact/sales" },
      ],
    },
  ],
  copyright: "© 2026 KEYON. All rights reserved.",
  legalLinks: [
    { label: "Điều khoản", href: "/terms" },
    { label: "Chính sách bảo mật", href: "/policy" },
    { label: "Chính sách thanh toán", href: "/policy" },
    { label: "Chính sách giao hàng điện tử", href: "/policy" },
    { label: "Quy định sản phẩm số", href: "/policy" },
  ],
};

export const defaultCmsNav: CmsNav = {
  brandName: "KEYON",
  tagline: "Digital License Platform",
  items: [
    { label: "Sản phẩm", href: "/products" },
    { label: "Giải pháp", href: "/solutions" },
    { label: "Doanh nghiệp", href: "/business" },
    { label: "Tài nguyên", href: "/resources" },
    { label: "Hỗ trợ", href: "/support" },
  ],
};

export const defaultCmsPartners: CmsPartners = {
  title: "Thương hiệu phần mềm trên KEYON",
  badges: ["Bản quyền chính hãng", "Thanh toán rõ ràng"],
  /** Empty by default — admin picks Catalog brands. Legacy name-only rows still resolve by name. */
  items: [],
};

export const defaultCmsCategories: CmsCategories = {
  title: "Danh mục sản phẩm",
  viewAllHref: "/products",
  viewAllLabel: "Xem tất cả",
  items: [
    {
      id: "c1",
      title: "Windows",
      countLabel: "18 sản phẩm",
      href: "/products",
      iconKey: "windows",
      accentColor: "#2563EB",
      visible: true,
      sortOrder: 0,
    },
    {
      id: "c2",
      title: "Microsoft Office",
      countLabel: "12 sản phẩm",
      href: "/products",
      iconKey: "office",
      accentColor: "#EA580C",
      visible: true,
      sortOrder: 1,
    },
    {
      id: "c3",
      title: "Adobe",
      countLabel: "10 sản phẩm",
      href: "/products",
      iconKey: "adobe",
      accentColor: "#E11D48",
      visible: true,
      sortOrder: 2,
    },
    {
      id: "c4",
      title: "Cloud & Server",
      countLabel: "8 sản phẩm",
      href: "/products",
      iconKey: "cloud",
      accentColor: "#0284C7",
      visible: true,
      sortOrder: 3,
    },
    {
      id: "c5",
      title: "Bảo mật",
      countLabel: "14 sản phẩm",
      href: "/products",
      iconKey: "security",
      accentColor: "#0EA5A4",
      visible: true,
      sortOrder: 4,
    },
    {
      id: "c6",
      title: "Autodesk",
      countLabel: "9 sản phẩm",
      href: "/products",
      iconKey: "autodesk",
      accentColor: "#0696D7",
      visible: true,
      sortOrder: 5,
    },
    {
      id: "c7",
      title: "Backup",
      countLabel: "7 sản phẩm",
      href: "/products",
      iconKey: "backup",
      accentColor: "#1A73E8",
      visible: true,
      sortOrder: 6,
    },
  ],
};

export type CmsProductRating = {
  /** Matches FeaturedProduct.id or catalog product id */
  productKey: string;
  ratingAvg: number;
  reviewCount: number;
};

export type CmsProductRatings = {
  items: CmsProductRating[];
};

/** Empty by default — do not invent storefront ratings. */
export const defaultCmsProductRatings: CmsProductRatings = {
  items: [],
};

export const defaultSettings: SiteSettings = {
  siteName: "KEYON",
  supportEmail: "support@keyon.vn",
  seoTitle: "KEYON — Phần mềm bản quyền chính hãng",
  seoDescription:
    "Mua phần mềm bản quyền — thanh toán rõ, nhận hàng rõ, quản lý trong Tài khoản.",
  pageSeo: {
    "/": {
      title: "KEYON — Phần mềm bản quyền chính hãng",
      description:
        "Mua phần mềm bản quyền — thanh toán rõ, nhận hàng rõ, quản lý trong Tài khoản.",
    },
    "/products": {
      title: "Sản phẩm — KEYON",
      description: "Danh mục phần mềm bản quyền chính hãng trên KEYON.",
    },
    "/blog": {
      title: "Blog — KEYON",
      description: "Kiến thức bản quyền, license và vận hành phần mềm cho doanh nghiệp.",
    },
    "/contact": {
      title: "Liên hệ — KEYON",
      description: "Liên hệ hỗ trợ KEYON — tư vấn mua bản quyền phần mềm.",
    },
    "/about": {
      title: "Về KEYON",
      description: "KEYON — nền tảng mua phần mềm bản quyền chính hãng.",
    },
    "/faq": {
      title: "Hỗ trợ / FAQ — KEYON",
      description: "Câu hỏi thường gặp về mua, kích hoạt và hỗ trợ bản quyền trên KEYON.",
    },
    "/policy": {
      title: "Chính sách — KEYON",
      description:
        "Điều khoản, giao hàng, hoàn tiền, bảo hành, bảo mật và hỗ trợ tại KEYON.",
    },
    "/brands": {
      title: "Thương hiệu — KEYON",
      description: "Danh sách thương hiệu phần mềm trên KEYON.",
    },
  },
};

export const defaultStorageSettings: StorageSettings = {
  driver: "local",
  wasabi: {
    endpoint: "",
    region: "",
    bucket: "",
    accessKeyId: "",
    secretAccessKeyEnc: "",
    publicBaseUrl: "",
    pathPrefix: "media",
  },
};

/** Outbound email (Brevo SMTP / custom). Password AES-GCM encrypted at rest. */
export type MailSettings = {
  /** `env` = use ENV only; `brevo` / `custom` prefer admin fields then ENV fallback. */
  provider: "env" | "brevo" | "custom";
  host: string;
  port: number;
  /** true = SMTPS (465); false = STARTTLS (587) or plain (1025 Mailpit). */
  secure: boolean;
  user: string;
  passEnc: string;
  from: string;
  replyTo: string;
  health: {
    lastSuccessAt: string | null;
    lastFailedAt: string | null;
    lastError: string | null;
    lastTestKind: "connection" | "send" | null;
  };
};

export const defaultMailSettings: MailSettings = {
  provider: "env",
  host: "",
  port: 587,
  secure: false,
  user: "",
  passEnc: "",
  from: "",
  replyTo: "",
  health: {
    lastSuccessAt: null,
    lastFailedAt: null,
    lastError: null,
    lastTestKind: null,
  },
};

/** Payment gateway (SePay). Secrets AES-GCM encrypted at rest. */
export type PaymentSettings = {
  provider: "stub" | "sepay" | "payos" | "megapay";
  sepay: {
    /** sandbox → PG checkout; production → bank VietQR + HMAC webhook */
    environment?: "sandbox" | "production";
    accountNumber: string;
    bankBin: string;
    bankName: string;
    bankDisplayName: string;
    accountName: string;
    qrTemplate: string;
    /** PG merchant id (SP-TEST-…) */
    merchantId?: string;
    paymentMethod?: "BANK_TRANSFER" | "NAPAS_BANK_TRANSFER";
    apiKeyEnc: string;
    webhookSecretEnc: string;
    merchantSecretEnc?: string;
    ipnSecretEnc?: string;
  };
};

export const defaultPaymentSettings: PaymentSettings = {
  provider: "stub",
  sepay: {
    environment: "sandbox",
    accountNumber: "",
    bankBin: "",
    bankName: "",
    bankDisplayName: "",
    accountName: "",
    qrTemplate: "compact2",
    merchantId: "",
    paymentMethod: "BANK_TRANSFER",
    apiKeyEnc: "",
    webhookSecretEnc: "",
    merchantSecretEnc: "",
    ipnSecretEnc: "",
  },
};

/** Supplier API credentials (Pax8 + reserved NCC). Secrets AES-GCM encrypted. */
export type Pax8ApiSettings = {
  driver: "stub" | "sandbox" | "http";
  baseUrl: string;
  clientId: string;
  clientSecretEnc: string;
  companyId: string;
};

export type PacisoftApiSettings = {
  enabled: boolean;
  baseUrl: string;
  apiKeyEnc: string;
  notes: string;
};

export type SupplierApiSettings = {
  pax8: Pax8ApiSettings;
  /** Reserved — MANUAL_OPS today; API credentials for later */
  pacisoft: PacisoftApiSettings;
};

export const defaultSupplierApiSettings: SupplierApiSettings = {
  pax8: {
    driver: "stub",
    baseUrl: "",
    clientId: "",
    clientSecretEnc: "",
    companyId: "",
  },
  pacisoft: {
    enabled: false,
    baseUrl: "",
    apiKeyEnc: "",
    notes: "",
  },
};

export type CmsCheckoutPaymentMethod = {
  id: string;
  title: string;
  subtitle: string;
  /** e.g. Phổ biến */
  badge?: string;
  /** Only sepay_qr is wired to real payment today */
  provider: "sepay_qr" | "coming_soon";
  enabled: boolean;
};

export type CmsCheckoutTrustItem = {
  id: string;
  title: string;
  description: string;
};

export type CmsCheckoutNextStep = {
  id: string;
  title: string;
  /** Use {{amount}} for formatted pay amount */
  description: string;
};

export type CmsCheckout = {
  securityLine: string;
  warrantyBadge: string;
  emailHelp: string;
  paidNote: string;
  /** Step 2 — continue to confirm (QR) */
  continueCtaLabel: string;
  continueCtaHint: string;
  /** Step 3 — confirm page hero */
  confirmTitle: string;
  confirmLead: string;
  orderInfoTitle: string;
  vatIncludedNote: string;
  paymentMethodCardTitle: string;
  selectedMethodBadge: string;
  payAmountLabel: string;
  timerLabel: string;
  expireHint: string;
  nextStepsTitle: string;
  nextSteps: CmsCheckoutNextStep[];
  qrCardTitle: string;
  qrNetworkLabel: string;
  amountFieldLabel: string;
  contentFieldLabel: string;
  reloadQrLabel: string;
  backToMethodLabel: string;
  /** Step 3 — after showing QR (stub / manual confirm) */
  payCtaLabel: string;
  payCtaHint: string;
  comingSoonNote: string;
  whyTitle: string;
  whyItems: CmsCheckoutTrustItem[];
  supportTitle: string;
  supportLiveChatLabel: string;
  supportLiveChatHref: string;
  supportEmailLabel: string;
  supportPhone: string;
  trustBar: { id: string; label: string; sub: string }[];
  /** Confirm page trust row (typically 3 items) */
  confirmTrustBar: { id: string; label: string; sub: string }[];
  paymentMethods: CmsCheckoutPaymentMethod[];
  vatLabel: string;
  feeLabel: string;
  feeValue: string;
  /** Step 4 — success */
  successTitle: string;
  successLead: string;
  successOrderCodeLabel: string;
  successTimeLabel: string;
  successMethodLabel: string;
  successViewOrderCta: string;
  successHomeCta: string;
  licenseSectionTitle: string;
  licenseReadyBadge: string;
  licenseKeyLabel: string;
  licenseShowLabel: string;
  licenseHideLabel: string;
  licenseCopyLabel: string;
  licensePendingNote: string;
  activationStepsTitle: string;
  activationSteps: { id: string; text: string }[];
  activationGuideCta: string;
  activationGuideHref: string;
  summaryPaidBanner: string;
  successSupportTitle: string;
  successSupportLinks: { id: string; title: string; href: string }[];
  accountUpsellTitle: string;
  accountUpsellBody: string;
  accountUpsellCta: string;
  accountUpsellHref: string;
  recommendedTitle: string;
  recommendedViewAllLabel: string;
};

export const defaultCmsCheckout: CmsCheckout = {
  securityLine: "Thông tin được mã hóa & bảo mật tuyệt đối",
  warrantyBadge: "Bảo hành 12 tháng",
  emailHelp: "Tự động gửi sau khi thanh toán",
  paidNote:
    "KEYON gửi giấy phép sau khi nhận tiền. Đã thanh toán ≠ đã giao — theo dõi trong Đơn hàng / Tài sản.",
  continueCtaLabel: "Tiếp tục thanh toán",
  continueCtaHint: "Bước tiếp theo: VietQR / hướng dẫn chuyển khoản",
  confirmTitle: "Xác nhận tiếp theo để hoàn tất giao dịch",
  confirmLead:
    "Đơn hàng gần hoàn tất — quét QR hoặc chuyển khoản đúng nội dung để kích hoạt license.",
  orderInfoTitle: "Thông tin đơn hàng",
  vatIncludedNote: "Đã bao gồm VAT",
  paymentMethodCardTitle: "Phương thức thanh toán",
  selectedMethodBadge: "Đã chọn",
  payAmountLabel: "Bạn sẽ thanh toán",
  timerLabel: "Thời gian thanh toán",
  expireHint:
    "Vui lòng hoàn tất thanh toán trong thời gian còn lại để giữ đơn hàng.",
  nextStepsTitle: "3 bước xác nhận tiếp theo",
  nextSteps: [
    {
      id: "s1",
      title: "Quét mã QR",
      description: "Mở ứng dụng ngân hàng / ví điện tử và quét mã QR bên cạnh.",
    },
    {
      id: "s2",
      title: "Xác nhận thanh toán",
      description: "Kiểm tra thông tin và xác nhận thanh toán {{amount}}.",
    },
    {
      id: "s3",
      title: "Hoàn tất & nhận license",
      description:
        "Thanh toán thành công, hệ thống sẽ tự động kích hoạt license cho bạn.",
    },
  ],
  qrCardTitle: "QR Code thanh toán",
  qrNetworkLabel: "napas 247",
  amountFieldLabel: "Số tiền",
  contentFieldLabel: "Nội dung",
  reloadQrLabel: "Tải lại mã QR",
  backToMethodLabel: "Quay lại chọn phương thức khác",
  payCtaLabel: "Tôi đã chuyển khoản",
  payCtaHint: "Sau khi chuyển đúng số tiền và nội dung, hệ thống sẽ cập nhật khi nhận được xác nhận thanh toán.",
  comingSoonNote:
    "Phương thức này sắp ra mắt. Vui lòng chọn VietQR / chuyển khoản để thanh toán ngay.",
  whyTitle: "Vì sao chọn KEYON?",
  whyItems: [
    {
      id: "w1",
      title: "Bản quyền chính hãng",
      description: "Nguồn cung rõ — hóa đơn & đối soát",
    },
    {
      id: "w2",
      title: "Giao siêu nhanh",
      description: "Instant thường 1–5 phút sau khi nhận tiền",
    },
    {
      id: "w3",
      title: "Bảo hành uy tín",
      description: "Hỗ trợ kích hoạt / gửi lại khi cần",
    },
    {
      id: "w4",
      title: "Hoàn tiền 100%",
      description: "Khi giao sai loại theo mô tả gói",
    },
  ],
  supportTitle: "Cần hỗ trợ?",
  supportLiveChatLabel: "Live chat",
  supportLiveChatHref: "/faq",
  supportEmailLabel: "Email hỗ trợ",
  supportPhone: "1900 0000",
  trustBar: [
    { id: "t1", label: "Bản quyền chính hãng", sub: "100% từ Microsoft" },
    { id: "t2", label: "Giao hàng siêu nhanh", sub: "Tự động 1 – 5 phút" },
    { id: "t3", label: "Thanh toán an toàn", sub: "Bảo mật tuyệt đối" },
    { id: "t4", label: "Hỗ trợ 24/7", sub: "Sẵn sàng mọi lúc mọi nơi" },
  ],
  confirmTrustBar: [
    {
      id: "ct1",
      label: "Bảo mật tuyệt đối",
      sub: "Cam kết bảo mật thông tin & giao dịch",
    },
    {
      id: "ct2",
      label: "Không lưu thông tin thẻ",
      sub: "KEYON không lưu số thẻ của bạn",
    },
    {
      id: "ct3",
      label: "Hỗ trợ 24/7",
      sub: "Đội ngũ luôn sẵn sàng hỗ trợ",
    },
  ],
  paymentMethods: [
    {
      id: "qr",
      title: "VietQR",
      subtitle: "Quét QR hoặc CK đúng nội dung",
      badge: "Phổ biến",
      provider: "sepay_qr",
      enabled: true,
    },
    {
      id: "atm",
      title: "Thẻ ATM / Internet Banking",
      subtitle: "Napas — sắp ra mắt",
      provider: "coming_soon",
      enabled: false,
    },
    {
      id: "intl",
      title: "Thẻ quốc tế",
      subtitle: "Visa · Mastercard · JCB",
      provider: "coming_soon",
      enabled: false,
    },
    {
      id: "wallet",
      title: "Ví điện tử khác",
      subtitle: "MoMo · ZaloPay · VNPay",
      provider: "coming_soon",
      enabled: false,
    },
  ],
  vatLabel: "VAT (10%)",
  feeLabel: "Phí giao dịch",
  feeValue: "Miễn phí",
  successTitle: "Thanh toán thành công!",
  successLead:
    "Cảm ơn bạn đã mua hàng tại KEYON. Đơn hàng của bạn đã được ghi nhận thanh toán.",
  successOrderCodeLabel: "Mã đơn hàng",
  successTimeLabel: "Thời gian",
  successMethodLabel: "Phương thức thanh toán",
  successViewOrderCta: "Xem chi tiết đơn hàng",
  successHomeCta: "Về trang chủ",
  licenseSectionTitle: "Thông tin license",
  licenseReadyBadge: "Kích hoạt ngay",
  licenseKeyLabel: "Mã kích hoạt (Product Key)",
  licenseShowLabel: "Hiện",
  licenseHideLabel: "Ẩn",
  licenseCopyLabel: "Sao chép",
  licensePendingNote:
    "Đã thanh toán ≠ đã giao. KEYON đang xử lý — license sẽ hiện tại đây khi sẵn sàng (hoặc trong Tài sản).",
  activationStepsTitle: "Hướng dẫn kích hoạt nhanh",
  activationSteps: [
    { id: "a1", text: "Nhấn Windows + I để mở Cài đặt." },
    { id: "a2", text: "Chọn Hệ thống → Kích hoạt." },
    { id: "a3", text: "Chọn Thay đổi khóa sản phẩm." },
    { id: "a4", text: "Nhập mã kích hoạt và xác nhận." },
  ],
  activationGuideCta: "Xem hướng dẫn chi tiết",
  activationGuideHref: "/faq",
  summaryPaidBanner: "Đơn hàng đã được thanh toán thành công",
  successSupportTitle: "Bạn cần hỗ trợ?",
  successSupportLinks: [
    { id: "h1", title: "Hướng dẫn kích hoạt", href: "/faq" },
    { id: "h2", title: "Liên hệ hỗ trợ", href: "/contact" },
    { id: "h3", title: "Gửi yêu cầu", href: "/account/tickets" },
    { id: "h4", title: "Trung tâm trợ giúp", href: "/faq" },
  ],
  accountUpsellTitle: "Trải nghiệm KEYON tốt hơn",
  accountUpsellBody:
    "Tạo tài khoản để quản lý đơn hàng, license và nhận nhiều ưu đãi hấp dẫn.",
  accountUpsellCta: "Tạo tài khoản ngay",
  accountUpsellHref: "/register",
  recommendedTitle: "Sản phẩm được nhiều khách hàng quan tâm",
  recommendedViewAllLabel: "Xem tất cả sản phẩm",
};

export const defaultCmsHome: CmsHome = {
  heroTitle: "Nền tảng phân phối bản quyền số",
  heroTitleAccent: "",
  heroSubtitle:
    "Mua, triển khai và quản lý bản quyền phần mềm, cloud và dịch vụ số trên một nền tảng duy nhất. Dành cho cá nhân, đội nhóm và doanh nghiệp.",
  heroCta: "Khám phá sản phẩm →",
  heroCtaHref: "/products",
  whyTitle: "",
  whySubtitle: "",
  howTitle: "",
  howSubtitle: "",
  solutionsTitle: "",
  solutionsSubtitle: "",
  ctaTitle: "",
  ctaSubtitle: "",
  ctaLabel: "",
  ctaHref: "",
  published: true,
};

export const defaultCmsBlog: CmsBlog = {
  pageTitle: "Tin tức & Kiến thức",
  pageLead:
    "Cập nhật tin tức mới nhất về phần mềm bản quyền, hướng dẫn sử dụng và kiến thức công nghệ từ KEYON.",
  searchPlaceholder: "Tìm kiếm bài viết…",
  sortNewest: "Mới nhất",
  sortOldest: "Cũ nhất",
  featuredBadge: "Nổi bật",
  latestTitle: "Bài viết mới nhất",
  loadMoreCta: "Xem thêm bài viết",
  trendingTitle: "Xu hướng",
  topicsTitle: "Chủ đề phổ biến",
  exploreTitle: "Cần license chính hãng?",
  exploreBody:
    "Windows, Office, Adobe và hơn thế nữa — giao nhanh, lưu trong tài khoản KEYON.",
  exploreCta: "Xem sản phẩm",
  exploreHref: "/products",
  newsletterTitle: "Đăng ký nhận bản tin Keyon",
  newsletterBody:
    "Nhận tin tức mới nhất về phần mềm bản quyền, hướng dẫn và ưu đãi độc quyền mỗi tuần.",
  newsletterCta: "Đăng ký",
  newsletterEmailPlaceholder: "Email của bạn",
  newsletterPerk1: "Tin tức mới nhất",
  newsletterPerk2: "Ưu đãi độc quyền",
  newsletterPerk3: "Kiến thức chuyên sâu",
  emptyTitle: "Chưa có bài viết",
  emptyBody: "KEYON sẽ sớm cập nhật tin tức và kiến thức tại đây.",
  detailTocTitle: "Nội dung chính",
  detailContinueCta: "Xem tiếp",
  detailPrevLabel: "Bài viết trước",
  detailNextLabel: "Bài viết tiếp theo",
  detailHelpfulTitle: "Bài viết này có hữu ích với bạn?",
  detailHelpfulYes: "Hữu ích",
  detailHelpfulNo: "Không hữu ích",
  detailShareTitle: "Chia sẻ bài viết",
  detailSearchTitle: "Tìm kiếm bài viết",
  detailCategoriesTitle: "Danh mục",
  detailFeaturedTitle: "Bài viết nổi bật",
  detailTagsTitle: "Thẻ phổ biến",
  detailVerifiedLabel: "Đã xác thực",
};

export const defaultCmsContact: CmsContact = {
  heroTitle: "Liên hệ với",
  heroTitleAccent: "KEYON",
  heroLead:
    "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin, đội ngũ KEYON sẽ phản hồi sớm nhất.",
  mapCompany: "KEYON., JSC",
  mapAddress:
    "Tầng 7, Tòa nhà Hà Nội Tower, 49 Hai Bà Trưng, Hoàn Kiếm, Hà Nội, Việt Nam",
  mapMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=49+Hai+Ba+Trung+Hoan+Kiem+Ha+Noi",
  mapMapsCta: "Xem trên Google Maps",
  mapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=105.833%2C21.018%2C105.850%2C21.031&layer=mapnik&marker=21.0245%2C105.8412",
  infoTitle: "Thông tin liên hệ",
  infoLead: "Bạn có thể liên hệ với chúng tôi qua các kênh sau",
  hotlineLabel: "Hotline",
  hotlineValue: "1900 1234",
  hotlineHint: "8:00 – 18:00, T2 – T7",
  emailLabel: "Email",
  emailValue: "support@keyon.vn",
  emailHint: "Phản hồi trong 2 giờ",
  chatLabel: "Live Chat",
  chatValue: "Chat trực tuyến 24/7",
  chatHint: "Hỗ trợ nhanh chóng",
  chatHref: "/account/tickets",
  hoursLabel: "Giờ làm việc",
  hoursValue: "Thứ 2 – Thứ 7: 8:00 – 18:00",
  hoursHint: "Nghỉ Chủ Nhật và ngày lễ",
  formTitle: "Gửi cho chúng tôi",
  formLead: "Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại sớm.",
  formNameLabel: "Họ và tên",
  formNamePlaceholder: "Nguyễn Văn A",
  formEmailLabel: "Email",
  formEmailPlaceholder: "email@example.com",
  formPhoneLabel: "Số điện thoại",
  formPhonePlaceholder: "09xx xxx xxx",
  formTopicLabel: "Chủ đề",
  formTopicPlaceholder: "Chọn chủ đề",
  formTopics: [
    { id: "order", label: "Đơn hàng / thanh toán" },
    { id: "license", label: "License / kích hoạt" },
    { id: "account", label: "Tài khoản" },
    { id: "partner", label: "Hợp tác / đại lý" },
    { id: "other", label: "Khác" },
  ],
  formMessageLabel: "Nội dung tin nhắn",
  formMessagePlaceholder: "Mô tả yêu cầu của bạn…",
  formPrivacyLabel:
    "Tôi đồng ý với Chính sách bảo mật và cho phép KEYON xử lý thông tin của tôi.",
  formPrivacyHref: "/policy/privacy",
  formSubmit: "Gửi tin nhắn",
  formSuccess: "Đã gửi tin nhắn. KEYON sẽ phản hồi sớm nhất có thể.",
  instantTitle: "Bạn cần hỗ trợ ngay?",
  instantBody: "Đội ngũ hỗ trợ của KEYON sẵn sàng giúp bạn 24/7",
  instantCta: "Chat ngay với chúng tôi",
  instantCtaHref: "/account/tickets",
  instantPerks: [
    "Phản hồi nhanh chóng",
    "Hỗ trợ chuyên nghiệp",
    "Bảo mật thông tin",
    "Hoàn toàn miễn phí",
  ],
};

export type CmsPolicyIconKey =
  | "terms"
  | "delivery"
  | "refund"
  | "warranty"
  | "privacy"
  | "payment"
  | "support"
  | "complaint";

export type CmsPolicyItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconKey: CmsPolicyIconKey;
  /** ISO date shown on detail page */
  updatedAt?: string;
  /** Optional PDF download URL */
  pdfUrl?: string;
  /**
   * Simple markdown:
   * - intro paragraphs before first ##
   * - ## heading
   * - paragraphs, `- ` bullets, `> ` callout
   * First `openSectionCount` sections render expanded; rest accordion.
   */
  body: string;
};

export type CmsPolicy = {
  heroTitle: string;
  heroTitleAccent: string;
  heroLead: string;
  cardCta: string;
  supportTitle: string;
  supportBody: string;
  supportCta: string;
  supportCtaHref: string;
  supportPhone: string;
  supportPhoneHint: string;
  supportEmail: string;
  supportEmailHint: string;
  /** Detail page sidebar */
  sidebarTitle: string;
  detailSupportTitle: string;
  detailSupportBody: string;
  detailUpdatedLabel: string;
  detailPdfLabel: string;
  /** First N ## sections stay open; rest accordion */
  openSectionCount: number;
  items: CmsPolicyItem[];
};

function policyBody(
  sections: { h: string; p?: string; bullets?: string[] }[],
  intro?: string,
) {
  const parts: string[] = [];
  if (intro?.trim()) parts.push(intro.trim());
  for (const s of sections) {
    let block = `## ${s.h}`;
    if (s.p?.trim()) block += `\n${s.p.trim()}`;
    if (s.bullets?.length) {
      block += `\n${s.bullets.map((b) => `- ${b}`).join("\n")}`;
    }
    parts.push(block);
  }
  return parts.join("\n\n");
}

export const defaultCmsPolicy: CmsPolicy = {
  heroTitle: "Chính sách của",
  heroTitleAccent: "KEYON",
  heroLead:
    "Minh bạch điều khoản, giao hàng, bảo hành và hỗ trợ — giúp bạn yên tâm khi mua bản quyền số tại KEYON.",
  cardCta: "Xem chi tiết",
  supportTitle: "Bạn cần hỗ trợ thêm?",
  supportBody:
    "Đội ngũ KEYON sẵn sàng giải đáp thắc mắc về chính sách và đơn hàng.",
  supportCta: "Liên hệ ngay",
  supportCtaHref: "/contact",
  supportPhone: "1900 1234",
  supportPhoneHint: "8:00 – 18:00, T2 – T7",
  supportEmail: "support@keyon.vn",
  supportEmailHint: "Phản hồi trong 2 giờ",
  sidebarTitle: "Danh mục chính sách",
  detailSupportTitle: "Cần hỗ trợ?",
  detailSupportBody: "Đội ngũ KEYON sẵn sàng hỗ trợ bạn 24/7.",
  detailUpdatedLabel: "Cập nhật lần cuối",
  detailPdfLabel: "Tải xuống PDF",
  openSectionCount: 2,
  items: [
    {
      id: "terms",
      slug: "terms",
      title: "Điều khoản sử dụng",
      description:
        "Quy định khi sử dụng website, tài khoản và dịch vụ phân phối bản quyền số KEYON.",
      iconKey: "terms",
      updatedAt: "2025-05-15",
      body: policyBody(
        [
          {
            h: "1. Phạm vi áp dụng",
            p: "Điều khoản này áp dụng khi bạn truy cập keyon.vn, tạo tài khoản, đặt mua hoặc sử dụng dịch vụ hỗ trợ của KEYON.",
            bullets: [
              "Áp dụng cho khách hàng cá nhân và tổ chức mua trên nền tảng",
              "Bao gồm website, tài khoản và kênh hỗ trợ chính thức",
            ],
          },
          {
            h: "2. Tài khoản người dùng",
            p: "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình.",
            bullets: [
              "Không chia sẻ mật khẩu hoặc mã xác thực",
              "KEYON có quyền tạm khóa khi nghi ngờ gian lận",
            ],
          },
          {
            h: "3. Sản phẩm số hợp pháp",
            p: "KEYON chỉ phân phối bản quyền phần mềm hợp pháp. Không hỗ trợ crack, key lậu hoặc nguồn gốc không rõ ràng.",
          },
          {
            h: "4. Hành vi bị cấm",
            p: "Nghiêm cấm lợi dụng nền tảng để gian lận thanh toán, spam, hoặc xâm phạm quyền sở hữu trí tuệ.",
          },
          {
            h: "5. Thay đổi điều khoản",
            p: "KEYON có thể cập nhật điều khoản; phiên bản mới có hiệu lực khi công bố trên trang này.",
          },
        ],
        "Khi sử dụng KEYON, bạn đồng ý với các điều khoản dưới đây. Vui lòng đọc kỹ trước khi đặt mua hoặc tạo tài khoản.",
      ),
    },
    {
      id: "delivery",
      slug: "delivery",
      title: "Chính sách giao hàng",
      description:
        "SLA Instant / Manual, cách nhận license và theo dõi trạng thái đơn hàng.",
      iconKey: "delivery",
      updatedAt: "2025-05-15",
      body: policyBody(
        [
          {
            h: "1. Hình thức giao",
            p: "KEYON giao sản phẩm số (key / tài khoản / kích hoạt) vào Tài khoản sau khi thanh toán thành công. Không giao hàng vật lý.",
          },
          {
            h: "2. SLA Instant & Manual",
            bullets: [
              "Instant: thường ≤ 15–30 phút sau thanh toán",
              "Manual: 2–8 giờ làm việc tùy sản phẩm và tồn kho",
              "Thanh toán thành công ≠ đã giao — theo dõi trạng thái đơn",
            ],
          },
          {
            h: "3. Nhận license",
            p: "License hiển thị trong Tài khoản → Đơn hàng / License sau khi fulfillment thành công.",
          },
          {
            h: "4. Sự cố giao hàng",
            p: "Nếu quá SLA, liên hệ hỗ trợ kèm mã đơn để được ưu tiên xử lý.",
          },
        ],
        "Chính sách giao hàng mô tả cách KEYON chuyển license số đến bạn và khung thời gian cam kết.",
      ),
    },
    {
      id: "refund",
      slug: "refund",
      title: "Chính sách hoàn tiền",
      description:
        "Điều kiện hoàn / không hoàn và quy trình xử lý khiếu nại thanh toán.",
      iconKey: "refund",
      updatedAt: "2025-05-15",
      body: policyBody(
        [
          {
            h: "1. Nguyên tắc",
            p: "Thanh toán OK nhưng giao fail → không auto-refund. Nhân viên KEYON xử lý tay theo từng trường hợp, có audit trail.",
          },
          {
            h: "2. Trường hợp thường không hoàn",
            bullets: [
              "License đã giao và xem được trong Tài khoản",
              "Sai nhu cầu / đổi ý sau khi đã nhận key",
              "Lỗi kích hoạt do phía người dùng (sai thiết bị, sai phiên bản)",
            ],
          },
          {
            h: "3. Cách gửi yêu cầu",
            p: "Gửi yêu cầu kèm mã đơn qua Liên hệ hoặc ticket trong Tài khoản trong giờ hỗ trợ.",
          },
          {
            h: "4. Thời gian xử lý",
            p: "KEYON xác nhận tiếp nhận trong giờ làm việc gần nhất và cập nhật kết quả trên ticket.",
          },
        ],
        "Hoàn tiền được xét theo từng case — ưu tiên minh bạch và có dấu vết xử lý nội bộ.",
      ),
    },
    {
      id: "warranty",
      slug: "warranty",
      title: "Chính sách bảo hành",
      description:
        "Thời hạn bảo hành, resend / replace và điều kiện hỗ trợ sau giao.",
      iconKey: "warranty",
      updatedAt: "2025-05-15",
      body: policyBody(
        [
          {
            h: "1. Thời hạn bảo hành",
            p: "Khiếu nại bảo hành trong 7 ngày kể từ lúc giao thành công, kèm mã đơn và mô tả lỗi.",
          },
          {
            h: "2. Resend & Replace",
            bullets: [
              "Resend: tự gửi lại email giao trong hạn mức delivery",
              "Replace: chỉ nhân viên KEYON thực hiện khi đủ điều kiện",
            ],
          },
          {
            h: "3. Điều kiện hỗ trợ",
            p: "Cần cung cấp bằng chứng lỗi (ảnh/video) và không vi phạm điều khoản sử dụng license.",
          },
          {
            h: "4. Ngoài phạm vi",
            p: "Không bảo hành khi license bị thu hồi do vi phạm EULA của nhà phát hành.",
          },
        ],
        "Bảo hành nhằm hỗ trợ khi license lỗi từ phía KEYON hoặc nhà cung cấp trong thời hạn quy định.",
      ),
    },
    {
      id: "privacy",
      slug: "privacy",
      title: "Chính sách bảo mật",
      description:
        "Cách KEYON thu thập, lưu trữ và bảo vệ dữ liệu cá nhân của bạn.",
      iconKey: "privacy",
      updatedAt: "2025-05-15",
      body: policyBody(
        [
          {
            h: "1. Dữ liệu chúng tôi thu thập",
            p: "KEYON chỉ thu thập dữ liệu cần thiết để vận hành dịch vụ mua bán và hỗ trợ bản quyền số.",
            bullets: [
              "Thông tin tài khoản: họ tên, email, số điện thoại (nếu có)",
              "Thông tin đơn hàng và thanh toán (mã đơn, số tiền, trạng thái)",
              "Nhật ký hỗ trợ / ticket khi bạn liên hệ",
            ],
          },
          {
            h: "2. Mục đích sử dụng",
            bullets: [
              "Xử lý đơn hàng, giao license và đối soát thanh toán",
              "Gửi thông báo giao dịch và hỗ trợ khách hàng",
              "Cải thiện bảo mật tài khoản (phiên đăng nhập, xác thực)",
            ],
          },
          {
            h: "3. Chia sẻ thông tin",
            p: "KEYON không bán dữ liệu cá nhân. Chỉ chia sẻ khi cần để hoàn tất thanh toán, tuân thủ pháp luật, hoặc với nhà cung cấp vận hành dưới hợp đồng bảo mật.",
          },
          {
            h: "4. Bảo mật kỹ thuật",
            p: "Mật khẩu được hash; dữ liệu nhạy cảm được mã hóa khi lưu. Hệ thống có kiểm soát truy cập nội bộ theo vai trò.",
          },
          {
            h: "5. Quyền của bạn",
            p: "Bạn có thể yêu cầu xem, cập nhật hoặc xóa dữ liệu theo quy định pháp luật qua email hỗ trợ.",
          },
          {
            h: "6. Thay đổi chính sách",
            p: "Khi có cập nhật quan trọng, KEYON công bố trên trang này kèm ngày hiệu lực.",
          },
          {
            h: "7. Liên hệ về bảo mật",
            p: "Mọi câu hỏi về dữ liệu cá nhân: support@keyon.vn hoặc form Liên hệ.",
          },
        ],
        "Chính sách này giải thích cách KEYON thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn dùng website và dịch vụ của chúng tôi.",
      ),
    },
    {
      id: "payment",
      slug: "payment",
      title: "Chính sách thanh toán",
      description:
        "Phương thức thanh toán, đối soát và lưu ý khi chuyển khoản / QR.",
      iconKey: "payment",
      updatedAt: "2025-05-15",
      body: policyBody(
        [
          {
            h: "1. Phương thức thanh toán",
            p: "KEYON hỗ trợ thanh toán qua cổng đã cấu hình (ví dụ QR). Chỉ thanh toán trên kênh chính thức của KEYON.",
          },
          {
            h: "2. Nội dung chuyển khoản",
            bullets: [
              "Nhập đúng nội dung / mã đơn hệ thống hiển thị",
              "Sai nội dung có thể làm chậm đối soát tự động",
            ],
          },
          {
            h: "3. Xác nhận thanh toán",
            p: "Hệ thống cập nhật payment_status khi nhận webhook / đối soát thành công.",
          },
          {
            h: "4. Hóa đơn",
            p: "Yêu cầu xuất hóa đơn (nếu áp dụng) được xử lý theo quy trình kế toán sau khi đơn hoàn tất.",
          },
        ],
        "Thanh toán trên KEYON được thiết kế để đối soát rõ ràng — tách biệt với bước giao license.",
      ),
    },
    {
      id: "support",
      slug: "support",
      title: "Chính sách hỗ trợ",
      description:
        "Kênh hỗ trợ, giờ làm việc Inbox và ưu tiên xử lý ticket.",
      iconKey: "support",
      updatedAt: "2025-05-15",
      body: policyBody(
        [
          {
            h: "1. Kênh hỗ trợ",
            bullets: [
              "FAQ và trang Chính sách (tự phục vụ)",
              "Form Liên hệ / ticket trong Tài khoản",
              "Hotline trong giờ hành chính",
            ],
          },
          {
            h: "2. Giờ Inbox",
            p: "T2–T7 · 08:00–18:00 (giờ Việt Nam), trừ ngày nghỉ lễ theo thông báo.",
          },
          {
            h: "3. Ưu tiên xử lý",
            p: "Sự cố giao hàng / license sau thanh toán được ưu tiên hơn câu hỏi chung về sản phẩm.",
          },
          {
            h: "4. Thông tin cần cung cấp",
            p: "Mã đơn, email tài khoản, mô tả lỗi và ảnh/video (nếu có) giúp xử lý nhanh hơn.",
          },
        ],
        "KEYON ưu tiên hỗ trợ dựa trên ticket và kênh chính thức để giữ dấu vết xử lý rõ ràng.",
      ),
    },
    {
      id: "complaint",
      slug: "complaint",
      title: "Chính sách xử lý khiếu nại",
      description:
        "Quy trình tiếp nhận, thời hạn phản hồi và leo thang khiếu nại.",
      iconKey: "complaint",
      updatedAt: "2025-05-15",
      body: policyBody(
        [
          {
            h: "1. Tiếp nhận khiếu nại",
            p: "Gửi khiếu nại qua ticket hoặc email hỗ trợ, ghi rõ mã đơn, thời điểm và bằng chứng liên quan.",
          },
          {
            h: "2. Thời hạn phản hồi",
            p: "KEYON xác nhận đã nhận trong giờ làm việc gần nhất và cập nhật tiến độ trên ticket.",
          },
          {
            h: "3. Kết quả xử lý",
            p: "Kết luận được ghi nhận nội bộ. Bạn có thể bổ sung thông tin nếu chưa đồng ý với kết quả lần đầu.",
          },
          {
            h: "4. Leo thang",
            p: "Trường hợp phức tạp có thể được chuyển đội vận hành / quản lý để xem xét lại.",
          },
        ],
        "Khiếu nại được xử lý có quy trình — nhằm giải quyết công bằng và có thể truy vết.",
      ),
    },
  ],
};

/* ─── Static pages (legal / policy / general) ───────────────────────────── */

export type CmsStaticPageStatus = "draft" | "published";
export type CmsStaticPageCollection = "policy" | "legal" | "general";
export type CmsStaticPageTemplate = "policy" | "simple";

export type CmsStaticPage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  status: CmsStaticPageStatus;
  collection: CmsStaticPageCollection;
  template: CmsStaticPageTemplate;
  /** Used in policy sidebar / hub cards */
  iconKey?: CmsPolicyIconKey;
  sortOrder: number;
  pdfUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

const STATIC_PAGE_SEED_AT = "2025-05-15T08:00:00.000Z";

/** Seed from default policy items — editable independently in CMS. */
export const defaultStaticPages: CmsStaticPage[] = defaultCmsPolicy.items.map(
  (item, index) => ({
    id: `sp_${item.id}`,
    slug: item.slug,
    title: item.title,
    description: item.description,
    body: item.body,
    status: "published" as const,
    collection: "policy" as const,
    template: "policy" as const,
    iconKey: item.iconKey,
    sortOrder: index + 1,
    updatedAt: item.updatedAt
      ? `${item.updatedAt}T00:00:00.000Z`
      : STATIC_PAGE_SEED_AT,
    createdAt: STATIC_PAGE_SEED_AT,
    publishedAt: STATIC_PAGE_SEED_AT,
  }),
);

export function emptyStaticPage(): CmsStaticPage {
  const now = new Date().toISOString();
  const stamp = Date.now();
  return {
    id: `sp_${stamp}`,
    slug: `trang-${stamp}`,
    title: "",
    description: "",
    body: "## 1. Mục đầu tiên\nNội dung…\n\n- Điểm 1\n- Điểm 2\n",
    status: "draft",
    collection: "general",
    template: "simple",
    sortOrder: 100,
    createdAt: now,
    updatedAt: now,
  };
}

export const defaultBlog: BlogPost[] = [
  {
    id: "b1",
    slug: "windows-11-pro-vs-home",
    title: "Windows 11 Pro vs Home: Doanh nghiệp nên chọn bản nào?",
    excerpt:
      "So sánh chi tiết hai phiên bản Windows 11 để giúp doanh nghiệp đưa ra quyết định phù hợp với nhu cầu và ngân sách.",
    body: `## 1. Khác biệt cốt lõi
Windows 11 Pro và Home khác nhau ở BitLocker, Remote Desktop, Hyper-V và chính sách nhóm. Đây là những tính năng doanh nghiệp thường cần khi quản lý máy hàng loạt.

> Pro giúp tiết kiệm tới 15% thời gian triển khai nhờ chính sách nhóm và BitLocker tích hợp.

## 2. Khi nào chọn Home
Home phù hợp cá nhân hoặc hộ kinh doanh nhỏ không cần quản trị tập trung. Nếu không dùng Remote Desktop hay mã hóa ổ đĩa bắt buộc, Home vẫn đủ dùng.

## 3. Khi nào chọn Pro
Môi trường làm việc chuyên nghiệp, máy join domain, hoặc yêu cầu bảo mật endpoint nên ưu tiên Pro. Chi phí license cao hơn nhưng giảm rủi ro vận hành.

## 4. Gợi ý mua tại KEYON
Chọn đúng SKU theo số máy và chu kỳ gia hạn. KEYON giao license chính hãng, lưu trong tài khoản để theo dõi dễ dàng.

## 5. Kết luận
Với hầu hết SME, Windows 11 Pro là lựa chọn an toàn hơn về quản trị và bảo mật dài hạn.`,
    status: "published",
    metaTitle: "Windows 11 Pro vs Home | KEYON",
    metaDescription:
      "So sánh Windows 11 Pro và Home cho doanh nghiệp.",
    category: "windows",
    author: "Admin Keyon",
    readMinutes: 6,
    featured: true,
    coverTone: "navy",
    tags: ["Windows 11", "Windows 10", "License", "Pro", "Home"],
    updatedAt: "2025-05-22T08:00:00.000Z",
    publishedAt: "2025-05-22T08:00:00.000Z",
  },
  {
    id: "b2",
    slug: "retail-oem-volume-license",
    title: "Retail, OEM, Volume License: Khác nhau thế nào?",
    excerpt:
      "Giải thích rõ ràng về các loại license Microsoft phổ biến trên thị trường.",
    body: `## 1. Retail là gì
Retail cho phép chuyển máy trong khuôn khổ điều khoản Microsoft, phù hợp người dùng cá nhân muốn linh hoạt.

## 2. OEM gắn thiết bị
OEM thường đi kèm máy mới và gắn với phần cứng. Chi phí thấp hơn nhưng hạn chế chuyển máy.

## 3. Volume cho doanh nghiệp
Volume phù hợp triển khai số lượng lớn, quản lý tập trung qua portal.

> Chọn đúng loại license giúp tối ưu chi phí và tuân thủ bản quyền.

## 4. Nên mua ở đâu
KEYON cung cấp license chính hãng kèm hỗ trợ kích hoạt sau mua.`,
    status: "published",
    metaTitle: "Retail OEM Volume License | KEYON",
    metaDescription: "Phân biệt Retail, OEM và Volume License.",
    category: "ban-quyen",
    author: "Admin Keyon",
    readMinutes: 5,
    featured: true,
    coverTone: "teal",
    tags: ["License", "Retail", "OEM", "Volume", "Microsoft"],
    updatedAt: "2025-05-20T08:00:00.000Z",
    publishedAt: "2025-05-20T08:00:00.000Z",
  },
  {
    id: "b3",
    slug: "toi-uu-chi-phi-phan-mem",
    title: "5 cách tối ưu chi phí phần mềm cho SME",
    excerpt:
      "Chiến lược mua bản quyền hiệu quả giúp doanh nghiệp vừa và nhỏ tiết kiệm ngân sách IT.",
    body: `## 1. Lập kế hoạch theo năm
Tránh mua lẻ theo từng máy khi quy mô đang tăng. Gom nhu cầu theo quý/năm để đàm phán Volume tốt hơn.

## 2. Đếm đúng seat thực dùng
Loại bỏ tài khoản không còn hoạt động trước khi gia hạn.

## 3. Ưu tiên bản quyền chính hãng
Chi phí ẩn từ phần mềm lậu thường cao hơn nhiều so với license hợp lệ.

## 4. Chọn gói đúng nhu cầu
Không phải team nào cũng cần full suite — tách gói theo phòng ban.

## 5. Đồng hành cùng KEYON
KEYON hỗ trợ tư vấn gói phù hợp theo quy mô thực tế.`,
    status: "published",
    metaTitle: "Tối ưu chi phí phần mềm SME | KEYON",
    metaDescription: "5 cách tối ưu chi phí phần mềm cho SME.",
    category: "doanh-nghiep",
    author: "Admin Keyon",
    readMinutes: 7,
    featured: true,
    coverTone: "violet",
    tags: ["SME", "Doanh nghiệp", "Chi phí", "License"],
    updatedAt: "2025-05-18T08:00:00.000Z",
    publishedAt: "2025-05-18T08:00:00.000Z",
  },
  {
    id: "b4",
    slug: "kich-hoat-office-365",
    title: "Hướng dẫn kích hoạt Microsoft 365 từng bước",
    excerpt:
      "Quy trình kích hoạt nhanh, an toàn sau khi mua license Microsoft 365 tại KEYON.",
    body: `## 1. Nhận license trong tài khoản
Sau khi thanh toán thành công, license hiện trong mục License của tôi.

## 2. Đăng nhập portal Microsoft
Dùng tài khoản admin tenant để gán license cho người dùng.

## 3. Cài đặt ứng dụng
Tải Office từ portal và đăng nhập đúng tài khoản đã được gán.

## 4. Khi gặp lỗi
Liên hệ hỗ trợ KEYON kèm mã đơn để được xử lý nhanh.`,
    status: "published",
    metaTitle: "Kích hoạt Microsoft 365 | KEYON",
    metaDescription: "Hướng dẫn kích hoạt Microsoft 365.",
    category: "m365",
    author: "Admin Keyon",
    readMinutes: 4,
    featured: false,
    coverTone: "orange",
    tags: ["Microsoft 365", "Office", "Kích hoạt"],
    updatedAt: "2025-05-15T08:00:00.000Z",
    publishedAt: "2025-05-15T08:00:00.000Z",
  },
  {
    id: "b5",
    slug: "bao-mat-endpoint-2025",
    title: "Checklist bảo mật endpoint cho văn phòng nhỏ",
    excerpt:
      "Những bước cơ bản giúp giảm rủi ro mã độc và mất dữ liệu trên máy nhân viên.",
    body: `## 1. Cập nhật hệ điều hành
Bật Windows Update và kiểm tra định kỳ.

## 2. Mã hóa ổ đĩa
Dùng BitLocker trên Pro khi máy mang ra ngoài văn phòng.

## 3. Hạn chế phần mềm lậu
Cài từ nguồn chính hãng để giảm mã độc.

## 4. Sao lưu quan trọng
Có bản backup dữ liệu kế toán và hợp đồng.`,
    status: "published",
    metaTitle: "Bảo mật endpoint 2025 | KEYON",
    metaDescription: "Checklist bảo mật endpoint cho văn phòng nhỏ.",
    category: "bao-mat",
    author: "Admin Keyon",
    readMinutes: 5,
    featured: false,
    coverTone: "emerald",
    tags: ["Bảo mật", "Endpoint", "BitLocker"],
    updatedAt: "2025-05-12T08:00:00.000Z",
    publishedAt: "2025-05-12T08:00:00.000Z",
  },
  {
    id: "b6",
    slug: "adobe-cc-cho-agency",
    title: "Adobe Creative Cloud phù hợp agency như thế nào?",
    excerpt:
      "Gợi ý chọn gói Creative Cloud theo quy mô team thiết kế và sản xuất nội dung.",
    body: `## 1. Gói Individual vs Teams
Agency nên ưu tiên Teams để quản lý seat tập trung.

## 2. Phân quyền theo dự án
Thu hồi seat khi freelancer kết thúc hợp đồng.

## 3. Mua chính hãng tại KEYON
Nhận license kèm hỗ trợ kích hoạt.`,
    status: "published",
    metaTitle: "Adobe CC cho agency | KEYON",
    metaDescription: "Chọn Adobe Creative Cloud cho agency.",
    category: "ban-quyen",
    author: "Admin Keyon",
    readMinutes: 6,
    featured: false,
    coverTone: "sky",
    tags: ["Adobe", "Creative Cloud", "Agency"],
    updatedAt: "2025-05-10T08:00:00.000Z",
    publishedAt: "2025-05-10T08:00:00.000Z",
  },
  {
    id: "b7",
    slug: "huong-dan-cai-autocad",
    title: "Hướng dẫn cài đặt AutoCAD bản quyền",
    excerpt:
      "Các bước tải, cài và kích hoạt AutoCAD đúng quy trình nhà cung cấp.",
    body: `## 1. Tải từ nguồn chính thức
Tránh cài từ file share nội bộ không kiểm soát.

## 2. Cài đúng phiên bản đã mua
Khớp năm bản quyền với installer.

## 3. Kích hoạt bằng license KEYON
Làm theo hướng dẫn trong đơn hàng.`,
    status: "published",
    metaTitle: "Cài đặt AutoCAD | KEYON",
    metaDescription: "Hướng dẫn cài AutoCAD bản quyền.",
    category: "huong-dan",
    author: "Admin Keyon",
    readMinutes: 8,
    featured: false,
    coverTone: "navy",
    tags: ["AutoCAD", "Hướng dẫn", "Cài đặt"],
    updatedAt: "2025-05-08T08:00:00.000Z",
    publishedAt: "2025-05-08T08:00:00.000Z",
  },
  {
    id: "b8",
    slug: "keyon-ra-mat-portal",
    title: "KEYON ra mắt cổng tài khoản tự phục vụ",
    excerpt:
      "Khách hàng có thể xem đơn, license và yêu cầu hỗ trợ ngay trên portal KEYON.",
    body: `## 1. Quản lý đơn hàng
Theo dõi trạng thái thanh toán và giao license.

## 2. Kho license của bạn
Xem và sao chép key đã mua trong tài khoản.

## 3. Hỗ trợ nhanh hơn
Tạo ticket trực tiếp từ portal.`,
    status: "published",
    metaTitle: "KEYON portal tự phục vụ | KEYON",
    metaDescription: "KEYON ra mắt cổng tài khoản tự phục vụ.",
    category: "tin-keyon",
    author: "Admin Keyon",
    readMinutes: 3,
    featured: false,
    coverTone: "teal",
    tags: ["KEYON", "Portal", "Tài khoản"],
    updatedAt: "2025-05-05T08:00:00.000Z",
    publishedAt: "2025-05-05T08:00:00.000Z",
  },
];

/** Account portal copy (order detail + sidebar pages) */
/**
 * Account CMS — chỉ field ops thật sự đổi (liên hệ, promo, banner, trust).
 * UI chrome (tab/cột/nhãn form) → storefront/lib/account-ui.ts
 */
export type CmsAccount = {
  contactPhone: string;
  contactEmail: string;
  contactBarLead: string;
  warrantyBadge: string;
  supportCardTitle: string;
  supportCardBody: string;
  supportCardCta: string;
  promoTitle: string;
  promoBody: string;
  promoCta: string;
  promoHref: string;
  activationGuideCta: string;
  activationGuideHref: string;
  licenseSecurityNote: string;
  feeValue: string;
  overviewWelcomeHi: string;
  overviewWelcomeBody: string;
  licensesBannerTitle: string;
  licensesBannerBody: string;
  licensesTrust1Title: string;
  licensesTrust1Body: string;
  licensesTrust2Title: string;
  licensesTrust2Body: string;
  licensesTrust3Title: string;
  licensesTrust3Body: string;
  licensesTrust4Title: string;
  licensesTrust4Body: string;
  securityLead: string;
  notificationsLead: string;
  ticketsLead: string;
};

export const defaultCmsAccount: CmsAccount = {
  contactPhone: "1900 636 939",
  contactEmail: "support@keyon.vn",
  contactBarLead: "Có thắc mắc về đơn hàng? Liên hệ ngay:",
  warrantyBadge: "Bảo hành: 12 tháng",
  supportCardTitle: "Bạn cần hỗ trợ?",
  supportCardBody:
    "Nếu bạn gặp vấn đề với license hoặc đơn hàng, hãy liên hệ với chúng tôi.",
  supportCardCta: "Tạo yêu cầu hỗ trợ",
  promoTitle: "Khám phá thêm sản phẩm",
  promoBody:
    "Phần mềm bản quyền chính hãng — giao nhanh, lưu trong License của tôi.",
  promoCta: "Xem sản phẩm",
  promoHref: "/products",
  activationGuideCta: "Hướng dẫn kích hoạt",
  activationGuideHref: "/faq",
  licenseSecurityNote:
    "KEYON cam kết bảo mật tuyệt đối thông tin license của bạn.",
  feeValue: "Miễn phí",
  overviewWelcomeHi: "Chào mừng trở lại",
  overviewWelcomeBody:
    "Cảm ơn bạn đã đồng hành cùng KEYON. Chúc bạn một ngày làm việc hiệu quả!",
  licensesBannerTitle: "KEYON cam kết bản quyền chính hãng",
  licensesBannerBody:
    "100% license chính hãng · Kích hoạt nhanh chóng · Hỗ trợ tận tâm",
  licensesTrust1Title: "100% Chính hãng",
  licensesTrust1Body: "License chính hãng từ nhà cung cấp uy tín",
  licensesTrust2Title: "Kích hoạt nhanh",
  licensesTrust2Body: "Quy trình rõ ràng, kích hoạt chỉ trong vài phút",
  licensesTrust3Title: "Hỗ trợ tận tâm",
  licensesTrust3Body: "Đội ngũ kỹ thuật sẵn sàng hỗ trợ 24/7",
  licensesTrust4Title: "Quản lý dễ dàng",
  licensesTrust4Body: "Theo dõi và quản lý tất cả license trên một nền tảng",
  securityLead: "Quản lý mật khẩu, xác thực email, phiên đăng nhập và 2FA.",
  notificationsLead: "Cập nhật đơn hàng, giao license và hỗ trợ.",
  ticketsLead: "Gửi yêu cầu và theo dõi phản hồi từ KEYON.",
};
