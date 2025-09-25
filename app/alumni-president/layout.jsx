"use client";
import Menu from "@/layouts/menus";
import Image from "next/image";
import logo from "@/assets/images/logo_rmu.png";
import useGetSession from "@/hook/useGetSeesion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardContext } from "../users/dashboard/dashboard-context";
import { AppProvider } from "@/context/app.context";

const Layout = ({ children }) => {
  const { user, checking } = useGetSession();
  const router = useRouter();

  useEffect(() => {
    if (checking) return;

    const timeout = setTimeout(() => {
      if (!user?.id || user?.roleId < 5) {
        router.push("/");
      }
    }, [500]);

    return () => clearTimeout(timeout);
  }, [checking, user]);

  return (
    <div className="w-screen h-screen flex items-center">
      <Menu />
      <div className="flex flex-col w-full h-full overflow-auto p-3">
        {/* header */}
        <header className="mb-2 w-full flex items-center gap-2 pb-2 border-b border-gray-300">
          <Image alt="logo" priority className="w-10 h-10" src={logo} />
          <div className="flex lg:gap-2 lg:items-center lg:flex-row flex-col">
            <h1 className="font-bold text-sm text-blue-600">RMU ALUMNI</h1>
            <p className="text-sm">
              : ระบบศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม (Admin)
            </p>
          </div>
        </header>
        <AppProvider>
          <DashboardContext>{children}</DashboardContext>
        </AppProvider>
      </div>
    </div>
  );
};
export default Layout;
