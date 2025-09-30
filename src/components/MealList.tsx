"use client";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

// تعريف نوع البيانات لكل وجبة لتسهيل العمل
type Meal = {
  id: number;
  name: string;
  price: number;
  // أضف أي حقول أخرى تحتاجها هنا
};

export default function MealList({ initialMeals }: { initialMeals: Meal[] }) {
  const supabase = createClient();
  // استخدام "state" لإدارة قائمة الوجبات، مما يسمح لنا بتحديثها فورًا
  const [meals, setMeals] = useState(initialMeals);
  const [error, setError] = useState<string | null>(null);

  // دالة الحذف
  const handleDelete = async (mealId: number) => {
    // رسالة تأكيد قبل الحذف (ممارسة جيدة)
    if (!window.confirm('هل أنت متأكد من أنك تريد حذف هذه الوجبة؟')) {
      return;
    }

    // 1. حذف الوجبة من قاعدة بيانات Supabase
    const { error: deleteError } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId);

    if (deleteError) {
      setError('حدث خطأ أثناء الحذف: ' + deleteError.message);
    } else {
      // 2. إذا نجح الحذف، قم بتحديث القائمة على الشاشة
      //    عن طريق إزالة الوجبة المحذوفة من الـ state
      setMeals(currentMeals => currentMeals.filter(meal => meal.id !== mealId));
      setError(null);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 border-b pb-2">وجباتك الحالية</h2>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
      <div className="space-y-4">
        {meals && meals.length > 0 ? (
          meals.map(meal => (
            <div key={meal.id} className="bg-card p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{meal.name}</h3>
                <p className="text-primary font-semibold">{meal.price} جنيه</p>
              </div>
              <button 
                onClick={() => handleDelete(meal.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-semibold"
              >
                حذف
              </button>
            </div>
          ))
        ) : (
          <p>ليس لديك أي وجبات حاليًا.</p>
        )}
      </div>
    </div>
  );
}