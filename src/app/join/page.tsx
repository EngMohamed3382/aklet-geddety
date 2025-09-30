"use client";

import { useState } from "react";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError("An error occurred while creating the account: " + authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
        setError("Account created, but user data not found. Please try logging in.");
        setLoading(false);
        return;
    }
    
    let publicUrl = "";
    if (avatarFile) {
        // === This is the final and most secure modification ===
        // 1. Extract the file extension
        const fileExt = avatarFile.name.split('.').pop();
        // 2. Create a completely unique and random filename using UUID
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        // =======================================================

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);

        if (uploadError) {
          setError("An error occurred while uploading the image: " + uploadError.message);
          setLoading(false);
          return;
        }
        
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
        
        publicUrl = publicUrlData.publicUrl;
    }
    
    const { error: insertError } = await supabase.from("cooks").insert({
      name,
      story,
      whatsapp_number: whatsapp,
      profile_image_url: publicUrl,
      user_id: authData.user.id,
    });

    if (insertError) {
      setError("An error occurred while saving the profile: " + insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Join Us as a Cook
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">Email (for logging into your account)</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="password" className="block font-medium">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full p-2 border rounded" />
        </div>

        <hr className="my-6"/>

        <div>
          <label htmlFor="name" className="block font-medium">Your Name (as it will appear to customers)</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="story" className="block font-medium">Your story in short</label>
          <textarea id="story" value={story} onChange={(e) => setStory(e.target.value)} required className="w-full p-2 border rounded"></textarea>
        </div>
        <div>
          <label htmlFor="whatsapp" className="block font-medium">WhatsApp Number</label>
          <input type="tel" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="avatar" className="block font-medium">Profile Picture</label>
          <input type="file" id="avatar" onChange={handleFileChange} accept="image/*" className="w-full p-2 border rounded" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-primary text-white p-3 rounded font-bold hover:opacity-90 disabled:bg-gray-400">
          {loading ? "Creating account..." : "Create My Account and Profile"}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">Account created successfully! You will be redirected to the login page.</p>}
      </form>
    </main>
  );
}
