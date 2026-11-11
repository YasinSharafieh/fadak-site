import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "فدک | پایگاه حفظ و نشر آثار کربلایی حسین طاهری",
  description:
    "حسینیه مجازی هیأت فدائیان حضرت زهرا (س) — آرشیو مراسم، صوت، تصویر، ویدیو، متن اشعار، ریلز و حدیث روز",
  openGraph: {
    title: "فدک | حفظ و نشر آثار کربلایی حسین طاهری",
    description: "مراسم آینده، آرشیو کامل، صوت، تصویر، نماهنگ، ریلز و حدیث روز",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#F7F3E8] text-[#1A2E28] font-[family-name:var(--font-vazirmatn)] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
