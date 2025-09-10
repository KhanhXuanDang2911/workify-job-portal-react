import Footer from "@/components/Footer";
import EmployerHeader from "@/components/EmployerHeader";
import { Outlet } from "react-router-dom";

export default function EmployerLayout() {
  return (
    <>
      <EmployerHeader />
      <Outlet />
      <Footer />
    </>
  );
}
