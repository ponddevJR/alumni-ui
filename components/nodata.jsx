import { Database } from "lucide-react";

const NoData = ({ bg = 1 }) => {
  return (
    <div className="w-full flex flex-col gap-2 items-center justify-center h-full">
      <Database size={60} color="red" />
      <p className={`${bg < 2 ? "text-black" : "text-white"} text-sm`}>
        ไม่พบข้อมูล
      </p>
    </div>
  );
};
export default NoData;
