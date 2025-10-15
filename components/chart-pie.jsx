"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// กำหนดสีตามคณะ
const FACULTY_COLORS = {
  คณะวิทยาศาสตร์และเทคโนโลยี: "#FFEB3B", // เหลือง
  คณะเทคโนโลยีสารสนเทศ: "#2196F3", // น้ำเงิน
  คณะครุศาสตร์: "#87CEEB", // ฟ้า
  คณะวิทยาการจัดการ: "#FF9800", // ส้ม
  คณะเทคโนโลยีการเกษตร: "#4CAF50", // เขียว
  คณะมนุษยศาสตร์และสังคมศาสตร์: "#9C27B0", // ม่วง
  คณะรัฐศาสตร์และรัฐประศาสนศาสตร์: "#00BCD4", // เขียวอมฟ้า
  คณะนิติศาสตร์: "#FFA726", // เหลืองส้ม
  คณะวิศวกรรมศาสตร์: "#F44336", // แดง
};

// ฟังก์ชันหาสีจากชื่อคณะ
const getFacultyColor = (facultyName) => {
  return FACULTY_COLORS[facultyName] || "#8884d8";
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const bgColor = getFacultyColor(data.name);

    return (
      <div
        className="p-4 border-2 border-white rounded-lg shadow-2xl"
        style={{
          backgroundColor: bgColor,
          opacity: 0.95,
        }}
      >
        <p className="font-bold text-gray-800 text-lg mb-2">{data.name}</p>
        <p className="text-gray-700 font-semibold">
          เงินเดือนเฉลี่ย: {Number(Math.round(data.value)).toLocaleString()}{" "}
          บาท/เดือน
        </p>
        <p className="text-gray-700 font-semibold">
          คิดเป็น: {((data.value / data.total) * 100).toFixed(1)}%
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
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight="bold"
      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const PieChartComponent = ({ data, openToolTip = true }) => {
  // คำนวณ total สำหรับเปอร์เซ็นต์
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const dataWithTotal = data.map((item) => ({
    ...item,
    total: total,
  }));

  return (
    <div style={{ width: 550, height: 500 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={180}
            innerRadius={0}
            fill="#8884d8"
            dataKey="value"
            activeShape={{
              outerRadius: 200,
            }}
          >
            {dataWithTotal.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getFacultyColor(entry.name)}
                stroke="#fff"
                strokeWidth={2}
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
