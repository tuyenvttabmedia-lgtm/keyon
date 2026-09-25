/**
 * Server-rendered GA4 / GTM tags so the initial HTML contains the real
 * googletagmanager scripts (Google’s install checker does not wait for
 * Next.js client hydration / afterInteractive Script injection).
 *
 * Prefer GTM alone when both IDs are set (load GA4 inside GTM).
 */
export function AnalyticsScripts({
  ga4MeasurementId,
  gtmContainerId,
}: {
  ga4MeasurementId?: string;
  gtmContainerId?: string;
}) {
  const gtm = gtmContainerId?.trim().toUpperCase();
  const ga4 = ga4MeasurementId?.trim().toUpperCase();
  const useGtm = Boolean(gtm && /^GTM-[A-Z0-9]+$/.test(gtm));
  const useGa4 = !useGtm && Boolean(ga4 && /^G-[A-Z0-9]+$/.test(ga4));

  if (!useGtm && !useGa4) return null;

  if (useGtm) {
    return (
      <>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`,
          }}
        />
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
    );
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
      />
      <script
        id="keyon-ga4"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');`,
        }}
      />
    </>
  );
}
