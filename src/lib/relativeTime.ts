import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  format,
  formatDistanceToNow,
} from "date-fns";

export function formatRelativeTime(
  dateInput: string | Date,
  t: (key: string, opts?: any) => string
) {
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
    return `${t("chatModal.yesterday")} ${format(date, "HH:mm")}`;
  }

  if (days <= 30) return t("notifications.time.daysAgo", { count: days });

  return formatDistanceToNow(date, { addSuffix: true });
}

export type RelativeTimeFn = typeof formatRelativeTime;
