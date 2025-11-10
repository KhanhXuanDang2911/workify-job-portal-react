import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import "./global.css";
import "./utils/debugToken";
import "leaflet/dist/leaflet.css";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      networkMode: "online",
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
        >
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </>
);
