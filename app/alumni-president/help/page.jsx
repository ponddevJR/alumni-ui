import { ChevronRight } from "lucide-react";

const Page = () => {
  return (
    <a
      href="/files/rmu_alumni_manual.pdf"
      download="rmu_alumni_manual.pdf"
      className="flex items-center justify-between w-full lg:w-1/3 transition duration-300 hover:bg-blue-100 p-3 border-b border-gray-300"
    >
      <p className="text-[0.9rem]">ดาวน์โหลดคู่มือการใช้งาน</p>
      <ChevronRight size={18} color="blue" />
    </a>
  );
};
export default Page;
