import { Calendar1, CalendarCheck } from "lucide-react";

const currentYear = new Date().getFullYear() + 543; // แปลง ค.ศ. → พ.ศ.
const yearsStart = Array.from({ length: 30 }, (_, i) => currentYear - i);
const yearsEnd = Array.from(
  { length: 30 },
  (_, i) => new Date().getFullYear() + 520 + i
);

export const SelectYearStart = ({
  setSelectYearStart,
  selectYearStart,
  setPage,
}) => {
  return (
    <div title="ค้นหาปีที่เข้าศึกษา" className="relative inline-block">
      <select
        onChange={(e) => {
          setSelectYearStart(e.target.value);
          setPage(1);
        }}
        value={selectYearStart}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {yearsStart.map((y, index) => (
          <option key={index} className="text-sm" value={y}>
            พ.ศ. {y}
          </option>
        ))}
      </select>
      <label
        htmlFor="select-row"
        className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        <Calendar1 size={17} />
        <p className="text-sm hidden lg:inline-flex">ปีที่เข้าศึกษา {selectYearStart && `พ.ศ. ${selectYearStart}`}</p>
      </label>
    </div>
  );
};

export const SelectYearEnd = ({ setSelectYearEnd, selectYearEnd, setPage }) => {
  return (
    <div title="ค้นหาปีที่เข้าศึกษา" className="relative inline-block">
      <select
        onChange={(e) => {
          setSelectYearEnd(e.target.value);
          setPage(1);
        }}
        value={selectYearEnd}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {yearsEnd.map((y, index) => (
          <option key={index} className="text-sm" value={y}>
            พ.ศ. {y}
          </option>
        ))}
      </select>
      <label
        htmlFor="select-row"
        className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        <CalendarCheck size={17} />
        <p className="text-sm hidden lg:inline-flex">ปีที่สำเร็จการศึกษา {selectYearEnd && `พ.ศ. ${selectYearEnd}`}</p>
      </label>
    </div>
  );
};
