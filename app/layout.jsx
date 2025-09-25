import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  weight: ["400", "800"],
  subsets: ["thai"],
});

export const metadata = {
  title: "RMU ALUMNI",
  description: "ระบบศิษย์เก่ามหาวิทยาลัยราชภัฏมหาสารคาม ",
  icons: {
    icon: "/logo_rmu.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo_rmu.png" />
      </head>
      <body className={`${sarabun.className} antialiased`}>{children}</body>
    </html>
  );
}
