import { ToastContainer } from "react-toastify";
import GlobalLoading from "./components/GlobalLoading";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AppRoutes from "./routes/AppRoutes";
import "flowbite";
import { useEffect, useState } from "react";
import { ResponsiveContext } from "./context/ResponsiveContext";
import type {
  DeviceType,
  ResponsiveContextProps,
} from "./context/ResponsiveContext";
import { UserAuthProvider } from "@/context/user-auth";
import { EmployerAuthProvider } from "@/context/employer-auth";
import { WebSocketProvider } from "@/context/websocket/WebSocketContext";

const getDevice = (): DeviceType => {
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1280) return "tablet";
  return "desktop";
};

function AppContent() {
  const [responsive, setResponsive] = useState<ResponsiveContextProps>({
    device: "desktop",
  });

  useEffect(() => {
    const handleResize = () => {
      const newDevice = getDevice();
      setResponsive((prev) =>
        prev.device !== newDevice ? { device: newDevice } : prev
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveContext value={responsive}>
      <ScrollToTop />
      <GlobalLoading />
      <AppRoutes />
      <ToastContainer
        toastClassName="text-[14px]"
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ScrollToTopButton />
    </ResponsiveContext>
  );
}

export default function App() {
  return (
    // BrowserRouter already exists in main.tsx
    // WebSocketProvider must be outside auth providers to avoid circular dependencies
    <WebSocketProvider>
      <UserAuthProvider>
        <EmployerAuthProvider>
          <AppContent />
        </EmployerAuthProvider>
      </UserAuthProvider>
    </WebSocketProvider>
  );
}
