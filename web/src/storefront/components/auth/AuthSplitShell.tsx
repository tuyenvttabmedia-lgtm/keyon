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
 * Equal columns; brand + form share the same top padding and content edge.
 */
export function AuthSplitShell({
  headline,
  subtext,
  features,
  bullets,
  children,
}: ShellProps) {
  const tall = Boolean(features?.length);

  return (
    <div className="flex flex-1 flex-col bg-background py-8 md:py-10 lg:py-12">
      <div className="home-container">
        <div
          className={`grid w-full overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-2 lg:items-stretch ${
            tall ? "" : "lg:min-h-[560px]"
          }`}
        >
          <AuthBrandPanel
            headline={headline}
            subtext={subtext}
            features={features}
            bullets={bullets}
          />
          <div
            className={`flex justify-center px-5 py-8 sm:px-8 md:px-10 md:py-10 lg:px-12 lg:py-12 ${
              tall ? "items-start" : "items-center"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
