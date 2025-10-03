"use client";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

// نفترض أن هذه هي البيانات التي سيتم تمريرها للمكون
type CookProfile = {
  user_id: string;
  profile_image_url: string | null;
};

export default function UpdateAvatar({ profile }: { profile: CookProfile }) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.profile_image_url);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // 1. إنشاء اسم فريد وآمن للملف الجديد
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // 2. رفع الصورة الجديدة إلى bucket "avatars"
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);

    if (uploadError) {
      alert('حدث خطأ أثناء رفع الصورة: ' + uploadError.message);
      setUploading(false);
      return;
    }

    // 3. تحديث جدول "cooks" برابط الصورة الجديد
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const newUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from('cooks')
      .update({ profile_image_url: newUrl })
      .eq('user_id', profile.user_id);
    
    if (updateError) {
      alert('حدث خطأ أثناء تحديث الملف الشخصي: ' + updateError.message);
    } else {
      setAvatarUrl(newUrl);
    }
    
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="الصورة الشخصية"
          width={150}
          height={150}
          className="rounded-full object-cover mb-4"
        />
      ) : (
        <div className="w-[150px] h-[150px] bg-gray-200 rounded-full mb-4 flex items-center justify-center">
          <span className="text-gray-500">لا توجد صورة</span>
        </div>
      )}
      <div>
        <label htmlFor="avatar-upload" className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md font-semibold">
          {uploading ? 'جاري الرفع...' : 'تغيير الصورة'}
        </label>
        <input 
          id="avatar-upload" 
          type="file" 
          accept="image/*" 
          onChange={handleUpload}
          disabled={uploading}
          className="hidden" 
        />
      </div>
    </div>
  );
}