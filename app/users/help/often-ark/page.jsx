import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

// Next.js page component (สามารถวางไว้ใน app/faq/page.tsx หรือ pages/faq.jsx)
// ใช้ Tailwind CSS ในการจัดรูปแบบ

export default function FAQPage() {
  const faqs = [
    {
      question: "ใครสามารถใช้ระบบศิษย์เก่าได้บ้าง?",
      answer:
        "ระบบนี้ออกแบบมาเพื่อศิษย์เก่าของมหาวิทยาลัย อาจารย์ และผู้ดูแลระบบที่เกี่ยวข้อง โดยแต่ละบทบาทจะมีสิทธิ์การเข้าถึงแตกต่างกัน",
    },
    {
      question: "ฉันสามารถแก้ไขหรืออัปเดตข้อมูลส่วนตัวได้หรือไม่?",
      answer:
        "สามารถทำได้ โดยผู้ใช้สามารถเข้าสู่ระบบและแก้ไขข้อมูลส่วนตัว ประวัติการศึกษา และประวัติการทำงาน รวมถึงกำหนดสิทธิ์การเปิดเผยข้อมูลได้เอง",
    },
    {
      question: "ข้อมูลของฉันจะปลอดภัยหรือไม่?",
      answer:
        "ผู้ให้บริการใช้มาตรการรักษาความปลอดภัยตามมาตรฐานทั่วไปเพื่อปกป้องข้อมูล และผู้ใช้สามารถจัดการสิทธิ์การเปิดเผยข้อมูลของตนเองได้",
    },
    {
      question: "หากลืมรหัสผ่านต้องทำอย่างไร?",
      answer:
        "สามารถใช้ฟังก์ชัน 'ลืมรหัสผ่าน' บนหน้าเข้าสู่ระบบเพื่อรีเซ็ตรหัสผ่านใหม่ผ่านอีเมลที่ลงทะเบียนไว้",
    },
    {
      question: "ระบบมีค่าใช้จ่ายหรือไม่?",
      answer:
        "การใช้งานพื้นฐานของระบบไม่มีค่าใช้จ่าย",
    },
    {
      question: "ใครเป็นผู้ดูแลระบบศิษย์เก่า?",
      answer:
        "ระบบอยู่ภายใต้ความดูแลของหน่วยงานที่มหาวิทยาลัยกำหนด เช่น ศูนย์ศิษย์เก่า หรือสำนักทะเบียนและประมวลผล",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8 md:p-12">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold">
            คำถามที่พบบ่อย (FAQ)
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            รวมคำถามและคำตอบที่มักพบเกี่ยวกับระบบศิษย์เก่า
          </p>
        </header>

        <section className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <h2 className="text-lg font-medium text-blue-700">
                {index + 1}. {faq.question}
              </h2>
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </section>

        <Link
          href="/users/help"
          className="mt-8 w-fit flex items-center gap-2 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          <ArrowLeft size={17} color="white" /> กลับ
        </Link>
      </div>
    </main>
  );
}
