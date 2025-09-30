// src/app/page.tsx - (النسخة المحدثة)

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image"; // <-- 1. استيراد مكون Image

export default async function HomePage() {
  const { data: cooks, error } = await supabase.from("cooks").select("*");

  if (error) { return <p>عذرًا، حدث خطأ ما...: {error.message}</p>; }
  if (!cooks || cooks.length === 0) { return <p>لا يوجد طهاة متاحون حاليًا.</p>; }

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        أشهى الأكلات من مطابخ جيرانك
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cooks.map((cook) => (
          <Link href={`/cooks/${cook.id}`} key={cook.id}>
            <div className="border rounded-lg shadow-lg h-full hover:bg-gray-50 transition-colors overflow-hidden">
              {/* 2. إضافة الصورة هنا */}
              {cook.profile_image_url && (
                <div className="relative w-full h-48">
                  <Image
                    src={cook.profile_image_url}
                    alt={cook.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{cook.name}</h2>
                <p className="text-gray-700 mb-4">{cook.story}</p>
                <span className="text-green-600 font-semibold">
                  اعرف المزيد...
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}