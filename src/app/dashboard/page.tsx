import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AddMealForm from "@/components/AddMealForm";
import MealList from "@/components/MealList"; // <-- 1. استدعاء المكون الجديد

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: cook, error: cookError } = await supabase
    .from('cooks')
    .select('id, name')
    .eq('user_id', user.id)
    .single();

  if (cookError || !cook) {
    return <p className="text-center p-8">لم يتم العثور على ملف الطاهي الخاص بك. يرجى التواصل مع الدعم.</p>;
  }
  
  // جلب الوجبات الحالية لهذا الطاهي
  const { data: initialMeals, error: mealsError } = await supabase
    .from('meals')
    .select('id, name, price') // جلب الحقول المطلوبة فقط
    .eq('cook_id', cook.id);

  // في حالة وجود خطأ في جلب الوجبات، مرر مصفوفة فارغة
  const meals = mealsError ? [] : initialMeals;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">أهلاً بك، {cook.name}!</h1>
      <p className="text-text-light mb-8">هنا يمكنك إدارة قائمة طعامك.</p>
      
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4 border-b pb-2">إضافة وجبة جديدة</h2>
        <AddMealForm cookId={cook.id} />
      </div>

      {/* 2. استخدام المكون الجديد هنا وتمرير الوجبات الأولية له */}
      <MealList initialMeals={meals} />
    </main>
  );
}