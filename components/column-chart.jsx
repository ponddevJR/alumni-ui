"use client";
import { FaFolderOpen } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

// 🔹 ตัวอย่างข้อมูลจากคำถาม

// 🔹 แปลงข้อมูลให้พร้อมใช้งานในกราฟ

const AlumniColumnChart = ({ rawData }) => {
  const data = rawData?.map((item) => ({
    name: item.company_place,
    alumniCount: item._count.alumniId,
  }));
  return (
    <div
      style={{
        width: "100%",
        height: 400,
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        padding: "1rem",
      }}
    >
      <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
        ประเทศที่ศิษย์เก่าไปทำงานมากที่สุด
      </h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" tick={{ fontSize: 15 }} />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Legend />
            <Bar
              dataKey="alumniCount"
              fill="#2196F3" // 🔵 น้ำเงินสด (ดูโดดเด่นบนพื้นขาว)
              barSize={50}
              radius={[10, 10, 0, 0]} // มุมโค้งด้านบน
              name="จำนวนศิษย์เก่า(คน)"
            >
              {/* แสดงค่าบนแท่ง */}
              <LabelList
                dataKey="alumniCount"
                position="top"
                fill="#333"
                fontSize={13}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex flex-col text-sm text-gray-500 items-center justify-center gap-1">
          <FaFolderOpen size={30} />
          <p>ไม่พบข้อมูล</p>
        </div>
      )}
    </div>
  );
};

export default AlumniColumnChart;
