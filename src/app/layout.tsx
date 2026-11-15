import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "فدک | پایگاه حفظ و نشر آثار کربلایی حسین طاهری",
  description: "آرشیو زنده و مرجع دیجیتال آثار کربلایی حسین طاهری و هیأت فدائیان حضرت زهرا (س) — صوت، ویدیو، نماهنگ، ریلز، عکس و اشعار",
  manifest: "/manifest.json",
  themeColor: "#0B3D2E",
  openGraph: {
    title: "فدک | پایگاه حفظ و نشر آثار کربلایی حسین طاهری",
    description: "آرشیو زنده و مرجع دیجیتال آثار کربلایی حسین طاهری",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen bg-[#F7F3E8] font-sans text-[#1a2e28] antialiased pb-20">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
