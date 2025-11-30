import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  format,
  formatDistanceToNow,
} from "date-fns";
import type { TFunc } from "./types";

// Lightweight wrapper to produce i18n-friendly relative times for chat
export function formatRelativeTime(
  dateInput: string | Date,
  t: (key: string, opts?: any) => string,
  locale?: Locale
) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const secs = differenceInSeconds(now, date);
  if (secs < 60) return t("notifications.time.justNow");

  const mins = differenceInMinutes(now, date);
  if (mins < 60) return t("notifications.time.minutesAgo", { count: mins });

  const hours = differenceInHours(now, date);
  if (hours < 24) return t("notifications.time.hoursAgo", { count: hours });

  const days = differenceInDays(now, date);
  if (days === 1) {
    // Yesterday with time like "Yesterday 14:23" — use chatModal.yesterday key
    return `${t("chatModal.yesterday")} ${format(date, "HH:mm")}`;
  }

  // For larger ranges, use daysAgo (i18n) when available, otherwise fallback to distance
  if (days <= 30) return t("notifications.time.daysAgo", { count: days });

  // Fallback: human readable distance
  return formatDistanceToNow(date, { addSuffix: true, locale });
}

export type RelativeTimeFn = typeof formatRelativeTime;
