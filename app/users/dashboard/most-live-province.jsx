import NoData from "@/components/nodata";
import { Database, Ellipsis, List, MapPin } from "lucide-react";
import Link from "next/link";

const MostLiveProvince = ({ result, total }) => {
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
          result?.map((r, index) => {
            return (
              <span
                key={index}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center  w-4/5 gap-3">
                  <MapPin size={18} color="red" />
                  <div className="flex w-full flex-col gap-1">
                    <p className="text-[0.9rem] text-white">
                      {r?.company_place} 
                      {/* (
                      {r?._count?.alumniId?.toLocaleString() + " คน"}) */}
                    </p>
                    {/* <section className="w-full relative p-1.5 rounded-full border border-gray-400 bg-gray-50">
                      <div
                        className="absolute h-full top-0 left-0 rounded-full bg-green-400 transition-all duration-300"
                        style={{
                          width: `${(
                            (r?._count?.alumniId / total) *
                            100
                          ).toFixed(1)}%`,
                        }}
                      ></div>
                    </section> */}
                  </div>
                </div>
                <p className="text-green-400">
                  {r?._count?.alumniId?.toLocaleString() + " คน"}
                </p>
              </span>
            );
          })
        ) : (
          <NoData bg={2} />
        )}
      </div>
    </div>
  );
};
export default MostLiveProvince;
