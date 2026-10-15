import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Any content string containing square brackets is a placeholder that must be
 * replaced with real church content before launch (see CONTENT_TODO.md).
 * Components use this to render honest "pending content" states instead of
 * inventing facts.
 */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  return /[[\]]/.test(value);
}

/** Renders a value as text, or as a marked placeholder chip when unset. */
export function displayValue(value: string | null | undefined): string | null {
  if (isPlaceholder(value)) return null;
  return value ?? null;
}
