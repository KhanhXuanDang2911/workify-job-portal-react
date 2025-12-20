export const formatCompactSalary = (
  amount: number,
  unit: "VND" | "USD"
): string => {
  if (unit === "VND") {
    if (amount >= 1_000_000) {
      const millions = amount / 1_000_000;

      if (millions % 1 === 0) {
        return `${millions}M VND`;
      }

      return `${millions.toFixed(1)}M VND`;
    }

    if (amount >= 1_000) {
      const thousands = amount / 1_000;
      if (thousands % 1 === 0) {
        return `${thousands}K VND`;
      }
      return `${thousands.toFixed(1)}K VND`;
    }

    return `${amount.toLocaleString("vi-VN")} VND`;
  } else {
    if (amount >= 1_000_000) {
      const millions = amount / 1_000_000;
      if (millions % 1 === 0) {
        return `${millions}M USD`;
      }
      return `${millions.toFixed(1)}M USD`;
    }

    if (amount >= 1_000) {
      const thousands = amount / 1_000;
      if (thousands % 1 === 0) {
        return `${thousands}K USD`;
      }
      return `${thousands.toFixed(1)}K USD`;
    }

    return `${amount.toLocaleString("en-US")} USD`;
  }
};

export const formatSalaryCompact = (
  job: {
    salaryType: string;
    minSalary?: number | null;
    maxSalary?: number | null;
    salaryUnit?: "VND" | "USD" | null;
  },
  t: (key: string) => string
): string => {
  try {
    const unit = (job.salaryUnit ?? "VND") as "VND" | "USD";

    if (job.salaryType === "RANGE") {
      const min = job.minSalary != null ? Number(job.minSalary) : null;
      const max = job.maxSalary != null ? Number(job.maxSalary) : null;

      if (min != null && max != null) {
        return `${formatCompactSalary(min, unit)} - ${formatCompactSalary(max, unit)}`;
      }
      if (min != null) {
        return formatCompactSalary(min, unit);
      }
      if (max != null) {
        return formatCompactSalary(max, unit);
      }
      return t("jobSearch.salaryNegotiable");
    }

    if (job.salaryType === "GREATER_THAN" && job.minSalary != null) {
      return formatCompactSalary(Number(job.minSalary), unit);
    }

    if (job.salaryType === "NEGOTIABLE") return t("jobSearch.salaryNegotiable");
    if (job.salaryType === "COMPETITIVE")
      return t("jobSearch.salaryCompetitive");

    return t("jobSearch.salaryNegotiable");
  } catch (e) {
    return t("jobSearch.salaryNegotiable");
  }
};
