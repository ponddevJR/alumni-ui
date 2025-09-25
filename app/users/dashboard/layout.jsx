"use client";
import useGetSession from "@/hook/useGetSeesion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardContext } from "./dashboard-context";

export default function Layout({ children }) {
  const { user } = useGetSession();
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      if (user?.roleId < 2) {
        return router.push("/users/profile");
      }
    }
  }, [user]);

  return <DashboardContext>{children}</DashboardContext>;
}
