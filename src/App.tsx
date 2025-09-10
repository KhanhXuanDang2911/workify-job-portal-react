import { ToastContainer } from "react-toastify";
import GlobalLoading from "./components/GlobalLoading";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <>
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
    </>
  );
}
