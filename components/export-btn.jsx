import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { alerts } from "@/libs/alerts";
import { Download } from "lucide-react";

const ExportBtn = ({ data, exportname }) => {
  const handleExport = () => {
    if (!data) {
      return alerts.err("ไม่พบข้อมูลที่ต้องการ export");
    }
    // แปลง JSON → Worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // เขียนไฟล์เป็น binary
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // บันทึกไฟล์
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${exportname}.xlsx`);
  };
  return (
    <button
      onClick={handleExport}
      disabled={!data}
      className="p-2 text-white bg-blue-600 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center gap-2"
    >
      <Download size={17} color="white" />
      <p className="text-sm hidden lg:inline-flex">Export</p>
    </button>
  );
};
export default ExportBtn;
