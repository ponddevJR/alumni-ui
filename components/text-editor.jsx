"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { useRef, useState } from "react";
import Color from "@tiptap/extension-color";

export default function TiptapEditor({ value, onChange, setValue,hiegth = 500 }) {
  const fileInputRef = useRef(null);
  const [color, setColor] = useState("#000000");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextStyle.configure({
        types: ["textStyle"],
        HTMLAttributes: {
          class: "text-style",
        },
      }),
      FontFamily,
      Color,
    ],
    content: value || `<p>เขียนรายละเอียดและเนื้อหาที่นี่</p>`,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // ใช้ onChange ที่ส่งมาจาก Controller
      if (onChange) {
        onChange(html);
      }
      // ใช้ setValue จาก react-hook-form (ถ้าต้องการ)
      if (setValue) {
        setValue("detail", html);
      }
    },

    immediatelyRender: false,
  });

  if (!editor) return null;

  // const addImage = (file) => {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     if (typeof reader.result === "string") {
  //       editor.chain().focus().setImage({ src: reader.result }).run();
  //     }
  //   };
  //   reader.readAsDataURL(file);
  // };

  return (
    <div className="border border-gray-400 rounded-lg shadow-sm p-2 bg-white mt-1">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b border-gray-400 pb-2 mb-2 items-center">
        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          B
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded italic ${
            editor.isActive("italic") ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          I
        </button>

        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            editor.chain().focus().setColor(e.target.value).run();
          }}
        />

        {/* Font Family */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          defaultValue=""
          className="px-2 py-1 border border-gray-400 focus:border-2 focus:border-blue-500 rounded"
        >
          <option value="">Sarabun</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Tahoma">Tahoma</option>
          <option value="Courier New">Courier New</option>
          <option value="Mali">Mali (Google Fonts)</option>
        </select>

        {/* Upload Image */}
        {/* <button
          onClick={() => fileInputRef.current?.click()}
          className="px-2 py-1 rounded bg-gray-100"
        >
          📷 เพิ่มรูปภาพข่าว
        </button> */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              addImage(e.target.files[0]);
            }
          }}
        />
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className={`md:h-[${hiegth}px] h-[300px] p-2 outline-none text-sm`}
      />
    </div>
  );
}
