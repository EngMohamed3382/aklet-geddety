"use client";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("فشل تسجيل الدخول: البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      setLoading(false);
    } else {
      // Clear any errors and redirect to the dashboard
      setError(null);
      router.push('/dashboard');
      router.refresh(); // To ensure the navbar updates
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">تسجيل الدخول</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-medium">كلمة المرور</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary text-white p-3 rounded font-bold hover:opacity-90 disabled:bg-gray-400">
          {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </main>
  );
}