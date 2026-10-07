/** Official product marks in /public/brand. Keys are stable ids used by landings. */
export const BRAND_LOGO: Record<string, string> = {
  microsoft: "/brand/microsoft.svg",
  m365: "/brand/microsoft.svg",
  windows: "/brand/windows.svg",
  office: "/brand/office.svg",
  teams: "/brand/teams.svg",
  outlook: "/brand/outlook.svg",
  word: "/brand/word.svg",
  excel: "/brand/excel.svg",
  onedrive: "/brand/onedrive.svg",
  sharepoint: "/brand/sharepoint.svg",
  onenote: "/brand/onenote.svg",
  todo: "/brand/todo.svg",
  exchange: "/brand/exchange.svg",
  adobe: "/brand/adobe.svg",
  autodesk: "/brand/autodesk.svg",
  acronis: "/brand/acronis.svg",
  veeam: "/brand/veeam.svg",
  bitdefender: "/brand/bitdefender.svg",
  kaspersky: "/brand/kaspersky.svg",
  eset: "/brand/eset.svg",
  sophos: "/brand/sophos.svg",
  fortinet: "/brand/fortinet.svg",
  norton: "/brand/norton.svg",
  symantec: "/brand/norton.svg",
  google: "/brand/google.svg",
  gmail: "/brand/gmail.svg",
  googlecloud: "/brand/googlecloud.svg",
  azure: "/brand/azure.svg",
  aws: "/brand/aws.svg",
  cloudflare: "/brand/cloudflare.svg",
};

export function brandLogoIdFromName(name: string): string | null {
  const key = name.trim().toLowerCase();
  if (BRAND_LOGO[key]) return key;
  const aliases: [string, string][] = [
    ["microsoft", "microsoft"],
    ["office", "office"],
    ["windows", "windows"],
    ["adobe", "adobe"],
    ["autodesk", "autodesk"],
    ["acronis", "acronis"],
    ["veeam", "veeam"],
    ["google", "google"],
    ["bitdefender", "bitdefender"],
    ["kaspersky", "kaspersky"],
    ["norton", "norton"],
    ["symantec", "norton"],
    ["eset", "eset"],
    ["sophos", "sophos"],
    ["fortinet", "fortinet"],
    ["cloudflare", "cloudflare"],
    ["azure", "azure"],
  ];
  for (const [needle, id] of aliases) {
    if (key.includes(needle)) return id;
  }
  return null;
}

export function BrandLogo({
  name,
  size = 32,
  wide = false,
  className = "shrink-0 object-contain",
}: {
  name: string;
  size?: number;
  /** Wordmarks (AWS, Veeam) keep their width instead of a square box. */
  wide?: boolean;
  className?: string;
}) {
  const src = BRAND_LOGO[name];
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      width={wide ? Math.round(size * 2.2) : size}
      height={size}
      className={className}
      style={
        wide
          ? { height: size, width: "auto", maxWidth: size * 2.6 }
          : { width: size, height: size }
      }
    />
  );
}
