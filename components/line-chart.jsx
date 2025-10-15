"use client";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ✅ ตัวอย่างข้อมูล

// ✅ Component
const AlumniLineChart = ({ data }) => {
  return (
    <div
      style={{
        width: "100%",
        height: 400,
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        padding: "1rem",
      }}
    >
      <h2 className="text-xl font-bold text-center mb-4 text-gray-700">
        จังหวัดที่ศิษย์เก่าทำงานมากที่สุด
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="company_place" tick={{ fontSize: 15 }} />
          <YAxis allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4F86F7" // สีฟ้าน้ำเงินสด
            strokeWidth={3}
            dot={{ r: 6, fill: "#4F86F7", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 8 }}
            name="จำนวนศิษย์เก่า(คน)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlumniLineChart;
