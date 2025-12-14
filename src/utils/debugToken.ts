/**
 * Debug utility to check token storage
 * Use in browser console: window.debugTokens()
 */
export const debugTokens = () => {
  // Debug function disabled
};

// Make it available globally
if (typeof window !== "undefined") {
  (window as any).debugTokens = debugTokens;
}
