export const debugTokens = () => {};

if (typeof window !== "undefined") {
  (window as any).debugTokens = debugTokens;
}
