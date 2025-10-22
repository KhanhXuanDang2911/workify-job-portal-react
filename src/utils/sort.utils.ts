export function sortByName<T extends { name: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => a.name.localeCompare(b.name, "vi", { sensitivity: "base" }));
}

export function sortByKey<T>(arr: T[], key: keyof T): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal, "vi", { sensitivity: "base" });
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return aVal - bVal;
    }
    return 0;
  });
}
