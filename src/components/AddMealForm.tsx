"use client";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // 1. استيراد الدالة الصحيحة

export default function AddMealForm({ cookId }: { cookId: number }) {
  const supabase = createClient(); // 2. إنشاء العميل هنا
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.from('meals').insert({
      name,
      description,
      price: Number(price),
      cook_id: cookId,
    });

    if (error) {
      setMessage('حدث خطأ: ' + error.message);
    } else {
      setMessage('تمت إضافة الوجبة بنجاح!');
      setName('');
      setDescription('');
      setPrice('');
      // تحديث الصفحة لإظهار الوجبة الجديدة
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg shadow">
      <div>
        <label htmlFor="mealName" className="block font-medium">اسم الوجبة</label>
        <input type="text" id="mealName" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded" />
      </div>
      <div>
        <label htmlFor="description" className="block font-medium">الوصف</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded"></textarea>
      </div>
      <div>
        <label htmlFor="price" className="block font-medium">السعر</label>
        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-2 border rounded" />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-primary text-white p-3 rounded font-bold hover:opacity-90 disabled:bg-gray-400">
        {loading ? 'جاري الإضافة...' : 'أضف الوجبة'}
      </button>
      {message && <p className="text-center mt-2">{message}</p>}
    </form>
  );
}