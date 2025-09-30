// src/app/join/page.tsx

"use client"; // <-- مهم جدًا: هذا المكون تفاعلي

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [story, setStory] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!avatarFile) {
      setError("من فضلك اختر صورة شخصية.");
      setLoading(false);
      return;
    }

    // 1. رفع الصورة إلى Supabase Storage
    const fileName = `${Date.now()}-${avatarFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatarFile);

    if (uploadError) {
      setError("حدث خطأ أثناء رفع الصورة: " + uploadError.message);
      setLoading(false);
      return;
    }

    // 2. الحصول على الرابط العام للصورة
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;


    // 3. إضافة بيانات الطاهي مع رابط الصورة إلى جدول "cooks"
    const { error: insertError } = await supabase.from("cooks").insert({
      name,
      story,
      whatsapp_number: whatsapp,
      profile_image_url: publicUrl,
    });

    if (insertError) {
      setError("حدث خطأ أثناء حفظ البيانات: " + insertError.message);
      setLoading(false);
      return;
    }

    // 4. تمت العملية بنجاح
    setLoading(false);
    setSuccess(true);
    // إعادة توجيه المستخدم للصفحة الرئيسية بعد ثانيتين
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">
        انضم إلينا كطاهٍ
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">الاسم</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="story" className="block font-medium">قصتك باختصار</label>
          <textarea id="story" value={story} onChange={(e) => setStory(e.target.value)} required className="w-full p-2 border rounded"></textarea>
        </div>
        <div>
          <label htmlFor="whatsapp" className="block font-medium">رقم الواتساب</label>
          <input type="tel" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="avatar" className="block font-medium">الصورة الشخصية</label>
          <input type="file" id="avatar" onChange={handleFileChange} required accept="image/*" className="w-full p-2 border rounded" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400">
          {loading ? "جاري التسجيل..." : "سجل الآن"}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">تم التسجيل بنجاح! سيتم توجيهك للصفحة الرئيسية.</p>}
      </form>
    </main>
  );
}