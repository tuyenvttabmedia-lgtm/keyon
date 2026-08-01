export type MediaDto = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  storageDriver: string;
  publicUrl: string;
  altText: string | null;
  caption: string | null;
  purpose: string | null;
  createdAt: string;
  updatedAt: string;
  source: "library" | "brand";
};
