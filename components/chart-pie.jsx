"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#0088FE", // น้ำเงิน
  "#00C49F", // เขียวมิ้นต์
  "#FFBB28", // เหลือง
  "#FF8042", // ส้ม
  "#8884D8", // ม่วงอ่อน
  "#82CA9D", // เขียวอ่อน
  "#FFC658", // เหลืองทอง
  "#FF7C7C", // แดงอ่อน
  "#8DD1E1", // ฟ้าอ่อน
  "#D084D0", // ม่วงชมพู
  "#87D068", // เขียวสด
  "#FFB347", // ส้มอ่อน
  "#FF6B6B", // แดงชมพู
  "#4ECDC4", // เขียวเทอร์ควอยซ์
];

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-blue-600">
          เฉลี่ย: {Number(Math.round(data.value)).toLocaleString()} บาท / เดือน
        </p>
        <p className="text-green-600">
          คิดเป็น (%):{" "}
          {((data.value / payload[0].payload.total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  payload,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <>
      {/* เปอร์เซ็นต์ในวงกลม */}
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)} %`}
      </text>

      {/* ชื่อคณะ ข้างวงกลม */}
      <text
        x={cx + (outerRadius + 20) * Math.cos(-midAngle * RADIAN)}
        y={cy + (outerRadius + 20) * Math.sin(-midAngle * RADIAN)}
        fill="#fff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={15}
      >
        {payload.name}
      </text>
    </>
  );
};

const PieChartComponent = ({ data, openToolTip }) => {
  // คำนวณ total สำหรับเปอร์เซ็นต์ใน tooltip
  const dataWithTotal = data.map((item) => ({
    ...item,
    total: data.reduce((sum, d) => sum + d.value, 0),
  }));

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={800} height={800}>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          {openToolTip && <Tooltip content={<CustomTooltip />} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
