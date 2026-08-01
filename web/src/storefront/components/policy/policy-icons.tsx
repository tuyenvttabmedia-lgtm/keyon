import type { CmsPolicyIconKey } from "@/server/cms/types";
import {
  IconCard,
  IconFolder,
  IconHeadset,
  IconLock,
  IconReceipt,
  IconShieldCheck,
  IconShuffle,
  IconTruck,
} from "@/storefront/components/icons/StoreIcons";

export const POLICY_ICONS: Record<
  CmsPolicyIconKey,
  (p: { size?: number }) => React.ReactNode
> = {
  terms: (p) => <IconFolder {...p} />,
  delivery: (p) => <IconTruck {...p} />,
  refund: (p) => <IconShuffle {...p} />,
  warranty: (p) => <IconShieldCheck {...p} />,
  privacy: (p) => <IconLock {...p} />,
  payment: (p) => <IconCard {...p} />,
  support: (p) => <IconHeadset {...p} />,
  complaint: (p) => <IconReceipt {...p} />,
};
