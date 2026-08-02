"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { FORM_ERROR_CLASS, FORM_LABEL_CLASS, INPUT_TEXT_CLASS } from "@/storefront/typography";
import { TRANSITION_UI } from "@/storefront/effects";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  error?: string | null;
  describedBy?: string;
};

/** Auth inputs — Home color tokens, mockup rounded-xl + icons. */
export const AuthField = forwardRef<HTMLInputElement, Props>(function AuthField(
  {
    label,
    leftIcon,
    rightSlot,
    className = "",
    error,
    describedBy,
    id,
    ...input
  },
  ref,
) {
  const fieldId = id ?? input.name;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;
  const described =
    [describedBy, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className="block" htmlFor={fieldId}>
      <span className={FORM_LABEL_CLASS}>{label}</span>
      <div className="relative mt-1.5">
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {leftIcon}
          </span>
        ) : null}
        <input
          {...input}
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          className={`h-11 w-full rounded-lg border bg-card outline-none ${TRANSITION_UI} placeholder:text-muted/70 focus:border-accent ${INPUT_TEXT_CLASS} ${
            error ? "border-red-400 focus:border-red-500" : "border-border"
          } ${leftIcon ? "pl-10" : "pl-3"} ${rightSlot ? "pr-11" : "pr-3"} ${className}`}
        />
        {rightSlot ? (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} role="alert" className={`mt-1.5 ${FORM_ERROR_CLASS}`}>
          {error}
        </p>
      ) : null}
    </label>
  );
});

export function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function IconEye({ off }: { off?: boolean }) {
  if (off) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.1A9.8 9.8 0 0 1 12 5c5 0 9 4 10 7-.4 1.1-1.2 2.4-2.4 3.5" />
        <path d="M6.1 6.1C4.2 7.5 2.9 9.3 2 12c1 3 5 7 10 7 1.4 0 2.7-.3 3.9-.8" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7.5 3.5h3L12 8l-2 1.5a12 12 0 0 0 4.5 4.5L16 12l4.5 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
    </svg>
  );
}

export function IconMapPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

export function AuthTextarea({
  label,
  leftIcon,
  className = "",
  error,
  id,
  ...input
}: {
  label: string;
  leftIcon?: ReactNode;
  className?: string;
  error?: string | null;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const fieldId = id ?? input.name;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;
  return (
    <label className="block" htmlFor={fieldId}>
      <span className={FORM_LABEL_CLASS}>{label}</span>
      <div className="relative mt-1.5">
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3 top-3 text-muted">
            {leftIcon}
          </span>
        ) : null}
        <textarea
          {...input}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`min-h-[4.5rem] w-full rounded-lg border bg-card py-2.5 outline-none ${TRANSITION_UI} placeholder:text-muted/70 focus:border-accent ${INPUT_TEXT_CLASS} ${
            error ? "border-red-400 focus:border-red-500" : "border-border"
          } ${leftIcon ? "pl-10" : "pl-3"} pr-3 ${className}`}
        />
      </div>
      {error ? (
        <p id={errorId} role="alert" className={`mt-1.5 ${FORM_ERROR_CLASS}`}>
          {error}
        </p>
      ) : null}
    </label>
  );
}
