import LineChartComponent from "@/components/line-chart";
import NoData from "@/components/nodata";
import { Database, Ellipsis, List, MapPin } from "lucide-react";
import Link from "next/link";

const MostLiveProvince = ({ result, total }) => {
  console.log("🚀 ~ MostLiveProvince ~ result:", result);
  return (
    <div
      id="alumni-province"
      className="w-full p-5 flex flex-col gap-2 mt-5 lg:mt-0 rounded-lg shadow-md bg-gray-800"
    >
      <span className="w-full flex items-center justify-between">
        <span className="w-full flex items-center justify-between">
          <label className="font-bold text-white">
            จังหวัดที่ศิษย์เก่าทำงานอยู่หรือเคยทำงานมากที่สุด
          </label>
          <Link title="ดูรายชื่อ" href="/users/dashboard/list-place">
            <List size={20} color="#8DD1E1" />
          </Link>
        </span>
      </span>
      <div className="w-full flex flex-col gap-3 h-[200px] overflow-y-auto pb-3 ">
        {result?.length > 0 ? (
          <LineChartComponent data={result} />
        ) : (
          <NoData bg={2} />
        )}
      </div>
    </div>
  );
};
export default MostLiveProvince;
