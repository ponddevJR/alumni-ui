"use client";
import Menu from "@/layouts/menus";
import Image from "next/image";
import logo from "@/assets/images/logo_rmu.png";
import useGetSession from "@/hook/useGetSeesion";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppProvider } from "@/context/app.context";

const Layout = ({ children }) => {
  const { user, checking } = useGetSession();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (checking) return;

    const timeout = setTimeout(() => {
      if (!user?.id || user?.roleId > 4) {
        router.push("/");
      }
    }, [500]);

    return () => clearTimeout(timeout);
  }, [checking, user]);

  return (
    <AppProvider>
      <div className="w-screen h-screen flex items-center">
        <Menu />
        <div className="flex flex-col w-full h-full overflow-auto p-3">
          {/* header */}
          {pathName.split("/")[2] !== "news" && (
            <header className="mb-2 w-full flex items-center gap-2 pb-2 border-b border-gray-300">
              <Image alt="logo" priority className="w-10 h-10" src={logo} />
              <div className="flex flex-col lg:flex-row lg:gap-2">
                <h1 className="font-bold text-sm text-blue-600">RMU ALUMNI</h1>
                <p className="text-sm ">
                  : ระบบศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม
                </p>
              </div>
            </header>
          )}

          {children}
        </div>
      </div>
    </AppProvider>
  );
};
export default Layout;
