"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PaginateProgress = () => {
  const pathName = usePathname();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // เริ่มต้น progress bar เมื่อ pathname เปลี่ยน
    setIsLoading(true);
    setProgress(0);

    // สร้าง interval เพื่ออัพเดท progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        // เพิ่มค่า progress แบบค่อยๆ ช้าลงเมื่อใกล้ 100%
        if (prev < 70) {
          return prev + 10;
        } else if (prev < 90) {
          return prev + 5;
        } else if (prev < 95) {
          return prev + 1;
        }
        return prev;
      });
    }, 200);

    // จำลองการโหลดเสร็จ
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathName]);

  if (!isLoading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[999] h-0.5 bg-transparent"
      style={{
        opacity: isLoading || progress < 100 ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        className="h-full bg-blue-600 shadow-sm"
        style={{
          width: `${progress}%`,
          transition:
            progress === 100 ? "width 0.3s ease-out" : "width 0.2s ease-out",
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
        }}
      />
    </div>
  );
};

export default PaginateProgress;
