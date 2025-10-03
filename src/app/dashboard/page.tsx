import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AddMealForm from "@/components/AddMealForm";
import MealList from "@/components/MealList";
import UpdateAvatar from "@/components/UpdateAvatar"; // <-- استدعاء المكون الجديد

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }
  
  // سنحتاج الآن لجلب بيانات الطاهي الكاملة
  const { data: cook, error: cookError } = await supabase
    .from('cooks')
    .select('*') // <-- جلب كل البيانات
    .eq('user_id', user.id)
    .single();

  if (cookError || !cook) {
    return <p className="text-center p-8">لم يتم العثور على ملف الطاهي الخاص بك.</p>;
  }
  
  const { data: initialMeals, error: mealsError } = await supabase
    .from('meals')
    .select('id, name, price, image_url')
    .eq('cook_id', cook.id);

  const meals = mealsError ? [] : initialMeals;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* قسم الصورة الشخصية */}
        <div className="md:col-span-1">
          <UpdateAvatar profile={{ user_id: user.id, profile_image_url: cook.profile_image_url }} />
        </div>
        
        {/* قسم الترحيب */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">أهلاً بك، {cook.name}!</h1>
          <p className="text-text-light mb-8">هنا يمكنك إدارة قائمة طعامك وتحديث ملفك الشخصي.</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4 border-b pb-2">إضافة وجبة جديدة</h2>
        <AddMealForm cookId={cook.id} />
      </div>

      <MealList initialMeals={meals} />
    </main>
  );
}
