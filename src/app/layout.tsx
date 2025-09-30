// src/app/layout.tsx - (النسخة المحدثة)
import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // <-- 1. استيراد خط القاهرة
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 2. إعداد الخط بالأوزان التي نحتاجها
const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  weight: ['400', '700'] 
});

export const metadata: Metadata = {
  title: "أكلة جدتي - طعام بيتي من جيرانك",
  description: "اكتشف أشهى الأكلات البيتية المعدة بحب.",
};

// src/app/layout.tsx

// ... (imports) ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      {/* تغيير لون الخلفية ولون النص الافتراضي هنا */}
      <body className={`${cairo.className} bg-background text-text-dark`}> 
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}