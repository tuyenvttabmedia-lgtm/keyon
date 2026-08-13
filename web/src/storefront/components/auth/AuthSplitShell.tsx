import type { ReactNode } from "react";
import {
  AuthBrandPanel,
  type AuthBrandFeature,
} from "./AuthBrandPanel";

export type { AuthBrandFeature };

type ShellProps = {
  headline: string;
  subtext?: string;
  features?: AuthBrandFeature[];
  bullets?: string[];
  children: ReactNode;
};

/**
 * Auth body under Home header/footer.
 * Must NOT wrap `.home-container` in `display:flex` — auto margins then
 * shrink-wrap to content (login ~866px vs register ~1044px). Home uses block.
 */
export function AuthSplitShell({
  headline,
  subtext,
  features,
  bullets,
  children,
}: ShellProps) {
  return (
    <div className="w-full flex-1 bg-background py-8 md:py-10 lg:py-12">
      <div className="home-container">
        <div className="grid w-full overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-2 lg:items-stretch">
          <AuthBrandPanel
            headline={headline}
            subtext={subtext}
            features={features}
            bullets={bullets}
          />
          <div className="flex items-start justify-start px-5 py-8 sm:px-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
