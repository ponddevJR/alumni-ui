import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const Help = () => {
  const helpMenu = [
    {
      title: "ข้อตกลงและการใช้บริการ",
      url: "/users/help/term-of-service",
    },
    {
      title: "นโยบายความเป็นส่วนตัว",
      url: "/users/help/privacy-policy",
    },
    // {
    //   title: "การจัดการบัญชี",
    //   url: "/users/help/accout",
    // },
    {
      title: "คำถามที่พบบ่อย",
      url: "/users/help/often-ark",
    },
  ];

  return (
    <div className="w-full flex flex-col p-3.5 gap-4">
      <span className="text-xl font-bold ">ศูนย์ช่วยเหลือ</span>
      {helpMenu.map((m, index) => (
        <Link
          href={m.url}
          key={index}
          className="flex items-center justify-between w-full lg:w-1/3 transition duration-300 hover:bg-blue-100 p-3 border-b border-gray-300"
        >
          <p className="text-[0.9rem]">{m.title}</p>
          <ChevronRight size={18} color="blue" />
        </Link>
      ))}
      <a
        href="/files/rmu_alumni_manual.pdf"
        download="rmu_alumni_manual.pdf"
        className="flex items-center justify-between w-full lg:w-1/3 transition duration-300 hover:bg-blue-100 p-3 border-b border-gray-300"
      >
        <p className="text-[0.9rem]">ดาวน์โหลดคู่มือการใช้งาน</p>
        <ChevronRight size={18} color="blue" />
      </a>
    </div>
  );
};
export default Help;
