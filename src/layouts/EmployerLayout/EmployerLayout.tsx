import Footer from "@/components/Footer";
import EmployerHeader from "@/components/EmployerHeader";
import { Outlet } from "react-router-dom";
import EmployerSidebar from "@/components/EmployerSideBar";
import { useContext } from "react";
import { ResponsiveContext } from "@/context/ResponsiveContext";

export default function EmployerLayout({ authenticated }: { authenticated?: boolean }) {
  const { device } = useContext(ResponsiveContext);

  return (
    <>
      {authenticated ? (
        <>
          {device === "desktop" ? (
            <div className="flex">
              <EmployerSidebar /> <Outlet />
            </div>
          ) : (
            <Outlet />
          )}
        </>
      ) : (
        <>
          <EmployerHeader />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
}
