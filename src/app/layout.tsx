import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VideoPlayerProvider } from "@/context/VideoPlayerContext";
import GlobalVideoPlayer from "@/components/GlobalVideoPlayer";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/context/ThemeContext";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "فدک | پایگاه حفظ و نشر آثار کربلایی حسین طاهری",
  description: "آرشیو زنده و مرجع دیجیتال آثار کربلایی حسین طاهری و هیأت فدائیان حضرت زهرا (س) — صوت، ویدیو، نماهنگ، ریلز، عکس و اشعار",
  manifest: "/manifest.json",
  themeColor: "#0a0a0a",
  openGraph: {
    title: "فدک | پایگاه حفظ و نشر آثار کربلایی حسین طاهری",
    description: "آرشیو زنده و مرجع دیجیتال آثار کربلایی حسین طاهری",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-theme="dark" className={vazirmatn.variable}>
      <body className="min-h-screen bg-[#0a0a0a] font-sans text-white antialiased pb-20">
        <script
          dangerouslySetInnerHTML={{
            __html: "try{localStorage.removeItem('fadak-theme');document.documentElement.setAttribute('data-theme','dark')}catch(e){}",
          }}
        />
        <VideoPlayerProvider>
          <ThemeProvider>
            <ScrollToTop />
            <div className="site-shell">
              <Header />
              <main>{children}</main>
              <Footer />
            </div>
            <GlobalVideoPlayer />
          </ThemeProvider>
        </VideoPlayerProvider>
      </body>
    </html>
  );
}
