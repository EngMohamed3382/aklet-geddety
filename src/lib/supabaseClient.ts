// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// اقرأ متغيرات البيئة التي حفظناها في ملف .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// تأكد من أن المتغيرات موجودة
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}

// أنشئ وأخرج (export) العميل الذي سنتعامل به مع قاعدة البيانات
export const supabase = createClient(supabaseUrl, supabaseAnonKey)