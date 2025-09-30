import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function CookDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // لاحظ أننا أضفنا "whatsapp_number" إلى جملة select
  const { data: cook } = await supabase
    .from("cooks")
    .select("*, whatsapp_number") 
    .eq("id", params.id)
    .single();

  if (!cook) {
    notFound();
  }

  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("cook_id", params.id);

  return (
    <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-10 text-center flex flex-col items-center">
        {cook.profile_image_url && (
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary">
                <Image 
                    src={cook.profile_image_url}
                    alt={cook.name}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </div>
        )}
        <h1 className="text-5xl font-bold text-text-dark">{cook.name}</h1>
        <p className="text-lg text-text-light mt-2 max-w-2xl">{cook.story}</p>
        
        {/* === الجزء الجديد الذي تمت إضافته === */}
        {cook.whatsapp_number && (
          <a 
            href={`https://wa.me/${cook.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            تواصل عبر واتساب
          </a>
        )}
        {/* ==================================== */}

      </div>

      <h2 className="text-3xl font-bold mb-6 border-b-2 border-primary pb-2">
        قائمة الطعام (المنيو)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals && meals.length > 0 ? (
          meals.map((meal) => (
            <div key={meal.id} className="bg-card border rounded-lg p-5 shadow-md">
              <h3 className="text-2xl font-bold text-text-dark">{meal.name}</h3>
              <p className="text-text-light my-2 flex-grow">{meal.description}</p>
              <p className="text-xl font-bold text-primary mt-4">{meal.price} جنيه</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-text-light">هذا الطاهي لم يضف أي وجبات بعد.</p>
        )}
      </div>
    </main>
  );
}