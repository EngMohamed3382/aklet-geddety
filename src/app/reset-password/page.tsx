"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // هذا الكود يتحقق من وجود "token" في الرابط عند تحميل الصفحة
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      setHasToken(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHasToken(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError('حدث خطأ: ' + error.message);
    } else {
      setMessage('تم تحديث كلمة المرور بنجاح! سيتم توجيهك لصفحة الدخول.');
      setTimeout(() => router.push('/login'), 3000);
    }
    setLoading(false);
  };

  if (!hasToken) {
    return (
      <main className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600">رابط غير صالح</h1>
        <p className="text-text-light mt-4">يبدو أن رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">تعيين كلمة مرور جديدة</h1>
      <form onSubmit={handleNewPassword} className="space-y-4">
        <div>
          <label htmlFor="newPassword">كلمة المرور الجديدة</label>
          <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className="w-full p-2 border rounded" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary text-white p-3 rounded font-bold hover:opacity-90 disabled:bg-gray-400">
          {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
        </button>
        {message && <p className="text-green-500 text-center mt-4">{message}</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </main>
  );
}