// src/app/cooks/[id]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

// هذه الصفحة ستستقبل "params" من الرابط، والذي يحتوي على id الطاهي
export default async function CookDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // 1. جلب بيانات الطاهي المحدد باستخدام الـ id
  const { data: cook } = await supabase
    .from("cooks")
    .select("*")
    .eq("id", params.id)
    .single(); // .single() لجلب نتيجة واحدة فقط

  // 2. إذا لم يتم العثور على الطاهي، أظهر صفحة "غير موجود"
  if (!cook) {
    notFound();
  }

  // 3. جلب الوجبات المرتبطة بهذا الطاهي فقط
  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("cook_id", params.id);

  return (
    <main className="p-8">
      {/* عرض معلومات الطاهي الأساسية */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold">{cook.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{cook.story}</p>
      </div>

      {/* عرض قائمة الوجبات */}
      <h2 className="text-3xl font-bold mb-4">قائمة الطعام (المنيو)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals && meals.length > 0 ? (
          meals.map((meal) => (
            <div key={meal.id} className="border rounded-lg p-4 shadow">
              <h3 className="text-2xl font-semibold">{meal.name}</h3>
              <p className="text-gray-700 my-2">{meal.description}</p>
              <p className="text-xl font-bold text-green-700">{meal.price} جنيه</p>
            </div>
          ))
        ) : (
          <p>لا يوجد وجبات متاحة حاليًا لهذا الطاهي.</p>
        )}
      </div>
    </main>
  );
}