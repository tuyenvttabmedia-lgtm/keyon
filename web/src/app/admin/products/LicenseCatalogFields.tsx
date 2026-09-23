"use client";

import {
  ACTIVATION_METHODS,
  ACTIVATION_METHOD_LABELS,
  LICENSE_CHANNELS,
  LICENSE_CHANNEL_LABELS,
  LICENSE_REGIONS,
  LICENSE_REGION_LABELS,
  LICENSE_TERMS,
  LICENSE_TERM_LABELS,
  PRODUCT_LANGUAGES,
  PRODUCT_LANGUAGE_LABELS,
  PRODUCT_PLATFORMS,
  PRODUCT_PLATFORM_LABELS,
  type ActivationMethod,
  type LicenseChannel,
  type LicenseRegion,
  type LicenseTermCode,
  type ProductLanguage,
  type ProductPlatform,
} from "@/storefront/lib/license-catalog";

export type ProductLicenseDefaults = {
  platforms: ProductPlatform[];
  language: ProductLanguage | "";
  licenseChannelDefault: LicenseChannel | "";
  licenseTermDefault: LicenseTermCode | "";
  seatsDefault: string;
  activationMethodDefault: ActivationMethod | "";
  transferPolicy: string;
  upgradePolicy: string;
  accountRequired: string;
};

export type VariantLicenseFields = {
  licenseChannel: LicenseChannel | "";
  licenseTerm: LicenseTermCode | "";
  seatsLabel: string;
  regionCode: LicenseRegion | "";
  activationMethod: ActivationMethod | "";
};

const selectClass = "mt-1 w-full rounded-lg border border-border px-3 py-2";
const labelClass = "block text-sm";

export function ProductLicenseDefaultsPanel({
  value,
  onChange,
}: {
  value: ProductLicenseDefaults;
  onChange: (next: ProductLicenseDefaults) => void;
}) {
  function togglePlatform(p: ProductPlatform) {
    const has = value.platforms.includes(p);
    onChange({
      ...value,
      platforms: has
        ? value.platforms.filter((x) => x !== p)
        : [...value.platforms, p],
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface/60 p-4">
      <div>
        <h3 className="text-sm font-semibold text-navy">
          Thông tin bản quyền (mặc định sản phẩm)
        </h3>
        <p className="mt-1 text-xs text-muted">
          Gợi ý cho gói mới. Mỗi SKU có thể ghi đè ở bước gói / trang sửa variant.
          Không liên quan mô hình hệ thống PERPETUAL/SUBSCRIPTION.
        </p>
      </div>
      <fieldset>
        <legend className="text-sm font-medium">Nền tảng</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRODUCT_PLATFORMS.map((p) => {
            const on = value.platforms.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  on
                    ? "bg-accent text-white"
                    : "border border-border bg-card text-navy"
                }`}
              >
                {PRODUCT_PLATFORM_LABELS[p]}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          <span className="font-medium">Ngôn ngữ</span>
          <select
            className={selectClass}
            value={value.language}
            onChange={(e) =>
              onChange({
                ...value,
                language: e.target.value as ProductLanguage | "",
              })
            }
          >
            <option value="">—</option>
            {PRODUCT_LANGUAGES.map((k) => (
              <option key={k} value={k}>
                {PRODUCT_LANGUAGE_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span className="font-medium">Loại bản quyền (mặc định)</span>
          <select
            className={selectClass}
            value={value.licenseChannelDefault}
            onChange={(e) =>
              onChange({
                ...value,
                licenseChannelDefault: e.target.value as LicenseChannel | "",
              })
            }
          >
            <option value="">—</option>
            {LICENSE_CHANNELS.map((k) => (
              <option key={k} value={k}>
                {LICENSE_CHANNEL_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span className="font-medium">Thời hạn (mặc định)</span>
          <select
            className={selectClass}
            value={value.licenseTermDefault}
            onChange={(e) =>
              onChange({
                ...value,
                licenseTermDefault: e.target.value as LicenseTermCode | "",
              })
            }
          >
            <option value="">—</option>
            {LICENSE_TERMS.map((k) => (
              <option key={k} value={k}>
                {LICENSE_TERM_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span className="font-medium">Thiết bị / ghế (mặc định)</span>
          <input
            className={selectClass}
            placeholder="1 thiết bị"
            value={value.seatsDefault}
            onChange={(e) =>
              onChange({ ...value, seatsDefault: e.target.value })
            }
          />
        </label>
        <label className={labelClass}>
          <span className="font-medium">Cách kích hoạt (mặc định)</span>
          <select
            className={selectClass}
            value={value.activationMethodDefault}
            onChange={(e) =>
              onChange({
                ...value,
                activationMethodDefault: e.target
                  .value as ActivationMethod | "",
              })
            }
          >
            <option value="">—</option>
            {ACTIVATION_METHODS.map((k) => (
              <option key={k} value={k}>
                {ACTIVATION_METHOD_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span className="font-medium">Yêu cầu tài khoản</span>
          <input
            className={selectClass}
            placeholder="Không / Microsoft account / …"
            value={value.accountRequired}
            onChange={(e) =>
              onChange({ ...value, accountRequired: e.target.value })
            }
          />
        </label>
      </div>
      <label className={labelClass}>
        <span className="font-medium">Chính sách chuyển nhượng</span>
        <textarea
          rows={2}
          className={selectClass}
          value={value.transferPolicy}
          onChange={(e) =>
            onChange({ ...value, transferPolicy: e.target.value })
          }
        />
      </label>
      <label className={labelClass}>
        <span className="font-medium">Chính sách nâng cấp</span>
        <textarea
          rows={2}
          className={selectClass}
          value={value.upgradePolicy}
          onChange={(e) =>
            onChange({ ...value, upgradePolicy: e.target.value })
          }
        />
      </label>
    </div>
  );
}

export function VariantLicenseFieldsPanel({
  value,
  onChange,
  title = "Bản quyền gói (SKU)",
}: {
  value: VariantLicenseFields;
  onChange: (next: VariantLicenseFields) => void;
  title?: string;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface/60 p-4">
      <div>
        <h3 className="text-sm font-semibold text-navy">{title}</h3>
        <p className="mt-1 text-xs text-muted">
          Ghi đè mặc định sản phẩm cho SKU này (Retail ≠ OEM).
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          <span className="font-medium">Loại bản quyền</span>
          <select
            className={selectClass}
            value={value.licenseChannel}
            onChange={(e) =>
              onChange({
                ...value,
                licenseChannel: e.target.value as LicenseChannel | "",
              })
            }
          >
            <option value="">— dùng mặc định SP —</option>
            {LICENSE_CHANNELS.map((k) => (
              <option key={k} value={k}>
                {LICENSE_CHANNEL_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span className="font-medium">Thời hạn hiển thị</span>
          <select
            className={selectClass}
            value={value.licenseTerm}
            onChange={(e) =>
              onChange({
                ...value,
                licenseTerm: e.target.value as LicenseTermCode | "",
              })
            }
          >
            <option value="">— dùng mặc định SP —</option>
            {LICENSE_TERMS.map((k) => (
              <option key={k} value={k}>
                {LICENSE_TERM_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span className="font-medium">Thiết bị / ghế</span>
          <input
            className={selectClass}
            placeholder="1 thiết bị"
            value={value.seatsLabel}
            onChange={(e) =>
              onChange({ ...value, seatsLabel: e.target.value })
            }
          />
        </label>
        <label className={labelClass}>
          <span className="font-medium">Vùng</span>
          <select
            className={selectClass}
            value={value.regionCode}
            onChange={(e) =>
              onChange({
                ...value,
                regionCode: e.target.value as LicenseRegion | "",
              })
            }
          >
            <option value="">—</option>
            {LICENSE_REGIONS.map((k) => (
              <option key={k} value={k}>
                {LICENSE_REGION_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          <span className="font-medium">Cách kích hoạt</span>
          <select
            className={selectClass}
            value={value.activationMethod}
            onChange={(e) =>
              onChange({
                ...value,
                activationMethod: e.target.value as ActivationMethod | "",
              })
            }
          >
            <option value="">— dùng mặc định SP —</option>
            {ACTIVATION_METHODS.map((k) => (
              <option key={k} value={k}>
                {ACTIVATION_METHOD_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export function emptyProductLicenseDefaults(): ProductLicenseDefaults {
  return {
    platforms: [],
    language: "",
    licenseChannelDefault: "",
    licenseTermDefault: "",
    seatsDefault: "",
    activationMethodDefault: "",
    transferPolicy: "",
    upgradePolicy: "",
    accountRequired: "",
  };
}

export function emptyVariantLicenseFields(): VariantLicenseFields {
  return {
    licenseChannel: "",
    licenseTerm: "",
    seatsLabel: "",
    regionCode: "",
    activationMethod: "",
  };
}
