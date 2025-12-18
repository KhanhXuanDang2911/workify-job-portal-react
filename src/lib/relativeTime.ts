import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  format,
  formatDistanceToNow,
} from "date-fns";

// Lightweight wrapper to produce i18n-friendly relative times for chat
export function formatRelativeTime(
  dateInput: string | Date,
  t: (key: string, opts?: any) => string
) {
  // If server returns an ISO datetime string without timezone (e.g. "2025-12-19T10:00:00"),
  // browsers may parse it as local time which causes incorrect relative times when
  // server and client are in different timezones. Treat timezone-less strings as UTC
  // by appending a trailing 'Z' so Date parses them consistently.
  let date: Date;
  if (typeof dateInput === "string") {
    const s = dateInput;
    const hasTZ = /Z|[+-]\d{2}:?\d{2}$/.test(s);
    date = new Date(hasTZ ? s : `${s}Z`);
  } else {
    date = dateInput;
  }
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
  return formatDistanceToNow(date, { addSuffix: true });
}

export type RelativeTimeFn = typeof formatRelativeTime;
