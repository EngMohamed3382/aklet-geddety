import { createClient } from "@/utils/supabase/server";
import CookCard from "@/components/CookCard"; // <-- استدعاء المكون الجديد

export default async function HomePage() {
  const supabase = createClient();
  
  const { data: cooks, error } = await supabase.from("cooks").select("*");

  if (error) {
    return <p>عذرًا، حدث خطأ ما: {error.message}</p>;
  }

  if (!cooks || cooks.length === 0) {
    return <p>لا يوجد طهاة متاحون حاليًا.</p>;
  }

  return (
    <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">
          أشهى الأكلات من مطابخ جيرانك
        </h1>
        <p className="text-lg text-text-light">طعام بيتي أصيل، مُعد بحب وشغف.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* الآن نقوم فقط باستدعاء المكون CookCard لكل طاه */}
        {cooks.map((cook) => (
          <CookCard key={cook.id} cook={cook} />
        ))}
      </div>
    </main>
  );
}