"use client";

import Script from "next/script";

type Props = {
  ga4MeasurementId?: string;
  gtmContainerId?: string;
};

/**
 * GA4 and/or GTM — only renders when IDs are configured in Site Settings.
 * Prefer GTM alone when both are set (GA4 usually loaded via GTM).
 */
export function AnalyticsScripts({
  ga4MeasurementId,
  gtmContainerId,
}: Props) {
  const gtm = gtmContainerId?.trim().toUpperCase();
  const ga4 = ga4MeasurementId?.trim().toUpperCase();
  const useGtm = Boolean(gtm && /^GTM-[A-Z0-9]+$/.test(gtm));
  const useGa4 = !useGtm && Boolean(ga4 && /^G-[A-Z0-9]+$/.test(ga4));

  if (!useGtm && !useGa4) return null;

  return (
    <>
      {useGtm ? (
        <>
          <Script id="keyon-gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');
          `}</Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
              height={0}
              width={0}
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : null}
      {useGa4 ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script id="keyon-ga4" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga4}', { anonymize_ip: true });
          `}</Script>
        </>
      ) : null}
    </>
  );
}
