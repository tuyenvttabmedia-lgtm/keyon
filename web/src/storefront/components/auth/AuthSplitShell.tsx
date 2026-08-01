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
  /** Tall forms (register): top-align; short forms (login): vertically center */
  formAlign?: "center" | "start";
  children: ReactNode;
};

/**
 * Auth body under Home header/footer.
 * Width = Home container (1120px).
 * Desktop: left brand + right form. Mobile: form only.
 */
export function AuthSplitShell({
  headline,
  subtext,
  features,
  bullets,
  formAlign = "center",
  children,
}: ShellProps) {
  return (
    <div className="flex flex-1 flex-col bg-background py-8 md:py-10 lg:py-12">
      <div className="home-container flex-1">
        <div className="grid w-full overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[minmax(280px,0.88fr)_minmax(0,1.2fr)] lg:items-stretch">
          <AuthBrandPanel
            headline={headline}
            subtext={subtext}
            features={features}
            bullets={bullets}
          />
          <div
            className={`flex justify-center px-4 py-8 sm:px-8 md:py-10 lg:px-10 lg:py-12 ${
              formAlign === "start" ? "items-start" : "items-center"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
