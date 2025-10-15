import { Sarabun } from "next/font/google";
import "./globals.css";
import ProgressBar from "@/components/progressbar";


const sarabun = Sarabun({
  weight: ["400", "800"],
  subsets: ["thai"],
});

export const metadata = {
  title: "RMU ALUMNI",
  description: "ระบบสารสนเทศเครือข่ายศิษย์เก่ามหาวิทยาลัยราชภัฏมหาสารคาม ",
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
      <body className={`${sarabun.className} antialiased`}>
        <ProgressBar />
        {children}
      </body>
    </html>
  );
}
