import { Database } from "lucide-react";
import { FaFolderOpen } from "react-icons/fa";

const NoData = ({ bg = 1 }) => {
  return (
    <div className="w-full h-full flex flex-col text-sm text-gray-500 items-center justify-center gap-1">
      <FaFolderOpen size={30} />
      <p>ไม่พบข้อมูล</p>
    </div>
  );
};
export default NoData;
