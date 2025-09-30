"use client";

import Link from "next/link";
import Image from "next/image";

type Cook = {
  id: number;
  name: string;
  story: string;
  profile_image_url: string | null;
  whatsapp_number: string | null;
};

export default function CookCard({ cook }: { cook: Cook }) {
  return (
    <Link href={`/cooks/${cook.id}`} passHref legacyBehavior>
      <a className="group block h-full">
        <div className="bg-card border rounded-lg shadow-md h-full overflow-hidden flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
          {cook.profile_image_url && (
            <div className="relative w-full h-52">
              <Image
                src={cook.profile_image_url}
                alt={cook.name}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          )}
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-2xl font-bold mb-2 text-text-dark">{cook.name}</h2>
            <p className="text-text-light mb-4 h-24 overflow-hidden flex-grow">{cook.story}</p>
            
            <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="font-bold text-primary group-hover:underline">
                عرض المنيو &rarr;
              </span>
              {cook.whatsapp_number && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/${cook.whatsapp_number}`, '_blank');
                  }}
                  className="text-green-600 hover:text-green-800 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}