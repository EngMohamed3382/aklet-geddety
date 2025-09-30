"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // <-- 1. إضافة متغير الحالة "loading"

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false); // <-- 2. إيقاف التحميل بعد التأكد من حالة المستخدم
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; 
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            أكلة جدتي 👵
          </Link>
          <div className="flex items-center">
            {/* 3. عدم عرض أي أزرار طالما أن الصفحة لا تزال في حالة التحميل */}
            {loading ? (
              <div className="w-24 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            ) : user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-text-dark hover:text-primary mr-4">
                  لوحة التحكم
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-text-dark hover:text-primary">
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link href="/join" className="text-sm font-medium text-text-dark hover:text-primary mr-4">
                  انضم كطاهٍ
                </Link>
                <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-primary hover:opacity-90">
                  تسجيل الدخول
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}