// components/DropdownMenu.tsx
"use client";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function DropdownMenu({
  menus = [],
  icon = <ChevronDown />,
  buttonTitle = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        title={buttonTitle}
        onClick={toggleMenu}
        className="p-1.5 rounded-full hover:bg-blue-100"
      >
        {icon}
      </button>

      {isOpen && (
        <div
          className={`absolute md:left-[-10rem] left-[-7rem] z-10 mt-2 w-48 ${
            menus.length < 7 ? "h-auto" : "h-80"
          } overflow-y-auto bg-white shadow-lg border border-gray-400 rounded`}
        >
          {menus.map((m, index) => (
            <button
              key={index}
              onClick={m.func}
              className="w-full block px-4 py-2 hover:bg-gray-100 text-[0.85rem] text-start"
            >
              {m?.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
