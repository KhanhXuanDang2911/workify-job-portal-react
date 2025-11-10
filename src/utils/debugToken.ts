/**
 * Debug utility to check token storage
 * Use in browser console: window.debugTokens()
 */
export const debugTokens = () => {
  console.log("=== TOKEN DEBUG INFO ===");

  // Check all localStorage items
  console.log("\n📦 All localStorage items:");
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value && (key.includes("token") || key.includes("Token"))) {
        console.log(`  ${key}:`, value.substring(0, 30) + "...");
      } else {
        console.log(`  ${key}:`, value);
      }
    }
  }

  // Check specific token keys
  console.log("\n🔑 User tokens:");
  console.log(
    "  user_access_token:",
    localStorage.getItem("user_access_token") ? "EXISTS" : "NOT FOUND"
  );
  console.log(
    "  user_refresh_token:",
    localStorage.getItem("user_refresh_token") ? "EXISTS" : "NOT FOUND"
  );

  console.log("\n🏢 Employer tokens:");
  console.log(
    "  employer_access_token:",
    localStorage.getItem("employer_access_token") ? "EXISTS" : "NOT FOUND"
  );
  console.log(
    "  employer_refresh_token:",
    localStorage.getItem("employer_refresh_token") ? "EXISTS" : "NOT FOUND"
  );

  console.log("\n======================");
};

// Make it available globally
if (typeof window !== "undefined") {
  (window as any).debugTokens = debugTokens;
}
