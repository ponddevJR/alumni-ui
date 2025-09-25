"use client";
import Loading from "@/components/loading";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  Megaphone,
  PersonStanding,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "@/libs/dayjs";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState();
  const [data, setData] = useState(null);
  const [otherNews, setOtherNews] = useState([]);

  const fetchNews = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/president/get-news/${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!params?.id) return;

    fetchNews(params.id);
  }, [params]);

  useEffect(() => {
    fetchOtherNews(data?.category, params?.id);
  }, [data]);

  const fetchOtherNews = async (category, thisNewsId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI +
          `/president/get-other-news/${category}/${thisNewsId}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setOtherNews(res.data);
        console.log("🚀 ~ fetchOtherNews ~ res.data:", res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center  flex-col gap-2">
        <Loading type={2} />
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col pb-3 bg-gray-50">
      <div className="w-full md:h-[380px] h-[35%] relative overflow-hidden rounded-tl-lg rounded-tr-lg">
        <Link
          href="/users/news"
          className="z-10 text-white absolute top-5 left-5"
        >
          <ArrowLeft size={25} />
        </Link>
        <div className="absolute top-0 inset-0 w-full h-full bg-black/20 backdrop-blur-xs"></div>
        <img
          src={apiConfig.imgAPI + data?.thumnail}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 px-6 lg:px-12 py-8 flex flex-col gap-2 w-full">
          <p className="w-fit p-1 px-1.5 rounded-full text-sm bg-teal-100 flex items-center gap-2">
            {data?.category == 0 ? (
              <Megaphone size={15} />
            ) : (
              <Heart size={15} />
            )}
            {data?.category == 0 ? "ข่าวสาร/กิจกรรม" : "โครงการบริจาค"}
          </p>
          <p className="font-bold lg:text-4xl text-2xl text-white">
            {data?.title}
          </p>
          <span className="flex items-center gap-2 mt-1 text-white">
            <Calendar size={18} />
            <p className="text-sm">
              {dayjs(data?.createdAt).format("D MMMM BBBB")}
            </p>
          </span>
        </div>
      </div>

      <div className="mt-6 gap-5 grid grid-cols-1 md:grid-cols-3 lg:mx-10 mx-4">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <div className="pb-4 w-full border-b border-gray-300">
            <span className="px-2 p-1.5 bg-white rounded-md flex items-center gap-2 border border-gray-300 w-fit">
              <Eye size={20} color="blue" />
              <p>{data?.view?.toLocaleString()}</p>
            </span>
          </div>

          <p className="w-full text-gray-600">{data?.short_detail}</p>

          <h1 className="text-2xl font-bold">{data?.title}</h1>

          <div
            className="prose max-w-full break-words whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: data?.detail }}
          />
        </div>

        <div className="flex flex-col gap-5 mt-4">
          {data?.category == 1 && data?.target_money > 0 && (
            <div className="p-5 rounded-lg border border-gray-300 shadow-sm bg-white flex flex-col gap-3.5">
              <label htmlFor="" className="text-lg font-bold">
                สถานะการบริจาค
              </label>
              <div className="w-full flex flex-col gap-1">
                <span className="w-full flex items-center justify-between">
                  <p className="text-gray-600">ยอดบริจาคปัจจุบัน</p>
                  <p className="text-green-500">
                    {Math.round(
                      (data?.current_money / data?.target_money) * 100
                    )}
                    %
                  </p>
                </span>
                <div className="relative p-1.5 w-full bg-gray-200 rounded-full">
                  <span
                    style={{
                      width: `${Math.round(
                        (data?.current_money / data?.target_money) * 100
                      )}%`,
                    }}
                    className={`absolute bg-blue-400 top-0 h-full left-0 ${
                      Math.round(
                        (data?.current_money / data?.target_money) * 100
                      ) === 100
                        ? "rounded-full"
                        : " rounded-tl-full rounded-bl-full"
                    }`}
                  ></span>
                </div>
                <span className="flex flex-col w-full text-sm justify-between">
                  <p className="text-2xl font-bold text-blue-600">
                    {data?.current_money?.toLocaleString()} บาท
                  </p>
                  <p className="text-sm text-gray-600">
                    เป้าหมาย: {data?.target_money?.toLocaleString()}
                  </p>
                </span>
                <span className="w-full flex flex-col gap-1 items-center mt-1">
                  <p className="text-xl font-bold text-orange-500">
                    {Math.ceil(
                      (new Date(data?.donate_end) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    ).toLocaleString()}
                  </p>
                  <p className="text-gray-700">วันคงเหลือ</p>
                </span>
              </div>
            </div>
          )}

          <div className="p-5 rounded-lg border border-gray-300 shadow-sm bg-white flex flex-col gap-3.5">
            <label htmlFor="" className="text-lg font-bold">
              {data?.category == 0 ? "ข่าวสารและกิจกรรม" : "โครงการรับบริจาค"}{" "}
              อื่นๆ
            </label>
            {otherNews.length > 0 ? (
              otherNews.map((o, index) => (
                <span
                  onClick={() => router.push(`/users/news/${o?.id}`)}
                  key={index}
                  className="pb-3 border-b border-gray-300 flex flex-col gap-2 hover:text-blue-500 cursor-pointer hover:border-blue-500"
                >
                  <p className="">{o?.title}</p>

                  <span className="flex items-center gap-2">
                    <Calendar size={15} color="gray" />
                    <p className="text-gray-700 text-sm">
                      {dayjs(o?.createdAt).format("D MMMM BBBB")}
                    </p>
                    <Eye size={15} color="gray" />
                    <p className="text-gray-700 text-sm">
                      {o?.view?.toLocaleString()} ครั้ง
                    </p>
                  </span>
                </span>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
