// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12 py-4">
      <div className="max-w-5xl mx-auto text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} أكلة جدتي. كل الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}