import {
  defaultCmsCheckout,
  type CmsCheckout,
} from "@/server/cms/types";

/** Merge stored checkout CMS with defaults (new keys after deploy). */
export function mergeCheckoutCms(raw: Partial<CmsCheckout> | null | undefined): CmsCheckout {
  return {
    ...defaultCmsCheckout,
    ...raw,
    whyItems: raw?.whyItems?.length ? raw.whyItems : defaultCmsCheckout.whyItems,
    trustBar: raw?.trustBar?.length ? raw.trustBar : defaultCmsCheckout.trustBar,
    confirmTrustBar: raw?.confirmTrustBar?.length
      ? raw.confirmTrustBar
      : defaultCmsCheckout.confirmTrustBar,
    nextSteps: raw?.nextSteps?.length ? raw.nextSteps : defaultCmsCheckout.nextSteps,
    paymentMethods: raw?.paymentMethods?.length
      ? raw.paymentMethods
      : defaultCmsCheckout.paymentMethods,
    activationSteps: raw?.activationSteps?.length
      ? raw.activationSteps
      : defaultCmsCheckout.activationSteps,
    continueCtaLabel: raw?.continueCtaLabel ?? defaultCmsCheckout.continueCtaLabel,
    continueCtaHint: raw?.continueCtaHint ?? defaultCmsCheckout.continueCtaHint,
    confirmTitle: raw?.confirmTitle ?? defaultCmsCheckout.confirmTitle,
    confirmLead: raw?.confirmLead ?? defaultCmsCheckout.confirmLead,
    orderInfoTitle: raw?.orderInfoTitle ?? defaultCmsCheckout.orderInfoTitle,
    vatIncludedNote: raw?.vatIncludedNote ?? defaultCmsCheckout.vatIncludedNote,
    paymentMethodCardTitle:
      raw?.paymentMethodCardTitle ?? defaultCmsCheckout.paymentMethodCardTitle,
    selectedMethodBadge:
      raw?.selectedMethodBadge ?? defaultCmsCheckout.selectedMethodBadge,
    payAmountLabel: raw?.payAmountLabel ?? defaultCmsCheckout.payAmountLabel,
    timerLabel: raw?.timerLabel ?? defaultCmsCheckout.timerLabel,
    expireHint: raw?.expireHint ?? defaultCmsCheckout.expireHint,
    nextStepsTitle: raw?.nextStepsTitle ?? defaultCmsCheckout.nextStepsTitle,
    qrCardTitle: raw?.qrCardTitle ?? defaultCmsCheckout.qrCardTitle,
    qrNetworkLabel: raw?.qrNetworkLabel ?? defaultCmsCheckout.qrNetworkLabel,
    amountFieldLabel: raw?.amountFieldLabel ?? defaultCmsCheckout.amountFieldLabel,
    contentFieldLabel:
      raw?.contentFieldLabel ?? defaultCmsCheckout.contentFieldLabel,
    reloadQrLabel: raw?.reloadQrLabel ?? defaultCmsCheckout.reloadQrLabel,
    backToMethodLabel:
      raw?.backToMethodLabel ?? defaultCmsCheckout.backToMethodLabel,
    successTitle: raw?.successTitle ?? defaultCmsCheckout.successTitle,
    successLead: raw?.successLead ?? defaultCmsCheckout.successLead,
    successOrderCodeLabel:
      raw?.successOrderCodeLabel ?? defaultCmsCheckout.successOrderCodeLabel,
    successTimeLabel: raw?.successTimeLabel ?? defaultCmsCheckout.successTimeLabel,
    successMethodLabel:
      raw?.successMethodLabel ?? defaultCmsCheckout.successMethodLabel,
    successViewOrderCta:
      raw?.successViewOrderCta ?? defaultCmsCheckout.successViewOrderCta,
    successHomeCta: raw?.successHomeCta ?? defaultCmsCheckout.successHomeCta,
    licenseSectionTitle:
      raw?.licenseSectionTitle ?? defaultCmsCheckout.licenseSectionTitle,
    licenseReadyBadge:
      raw?.licenseReadyBadge ?? defaultCmsCheckout.licenseReadyBadge,
    licenseKeyLabel: raw?.licenseKeyLabel ?? defaultCmsCheckout.licenseKeyLabel,
    licenseShowLabel: raw?.licenseShowLabel ?? defaultCmsCheckout.licenseShowLabel,
    licenseHideLabel: raw?.licenseHideLabel ?? defaultCmsCheckout.licenseHideLabel,
    licenseCopyLabel: raw?.licenseCopyLabel ?? defaultCmsCheckout.licenseCopyLabel,
    licensePendingNote:
      raw?.licensePendingNote ?? defaultCmsCheckout.licensePendingNote,
    activationStepsTitle:
      raw?.activationStepsTitle ?? defaultCmsCheckout.activationStepsTitle,
    activationGuideCta:
      raw?.activationGuideCta ?? defaultCmsCheckout.activationGuideCta,
    activationGuideHref:
      raw?.activationGuideHref ?? defaultCmsCheckout.activationGuideHref,
    summaryPaidBanner:
      raw?.summaryPaidBanner ?? defaultCmsCheckout.summaryPaidBanner,
    successSupportTitle:
      raw?.successSupportTitle ?? defaultCmsCheckout.successSupportTitle,
    successSupportLinks: raw?.successSupportLinks?.length
      ? raw.successSupportLinks
      : defaultCmsCheckout.successSupportLinks,
    accountUpsellTitle:
      raw?.accountUpsellTitle ?? defaultCmsCheckout.accountUpsellTitle,
    accountUpsellBody:
      raw?.accountUpsellBody ?? defaultCmsCheckout.accountUpsellBody,
    accountUpsellCta: raw?.accountUpsellCta ?? defaultCmsCheckout.accountUpsellCta,
    accountUpsellHref:
      raw?.accountUpsellHref ?? defaultCmsCheckout.accountUpsellHref,
    recommendedTitle: raw?.recommendedTitle ?? defaultCmsCheckout.recommendedTitle,
    recommendedViewAllLabel:
      raw?.recommendedViewAllLabel ?? defaultCmsCheckout.recommendedViewAllLabel,
  };
}
