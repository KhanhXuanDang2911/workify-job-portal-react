import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary.tsx";
import "./index.css";
import "./global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      networkMode: "online",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  </>
);
