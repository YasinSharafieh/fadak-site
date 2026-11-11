export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="gold-frame rounded-3xl bg-white p-8">
        <h1 className="text-3xl font-extrabold text-[#0B3D2E]">جستجو در فدک</h1>
        <p className="mt-2 text-[#3D2B1F]/80">در مراسم، صوت، شعر و عکس جستجو کنید.</p>
        <form className="mt-6 flex gap-2" action="/search" method="get">
          <input name="q" placeholder="مثلاً: روضه، علی‌اکبر، شعر..." className="flex-1 rounded-full border p-3" />
          <button className="rounded-full bg-[#0B3D2E] px-6 py-3 font-bold text-white">جستجو</button>
        </form>
        <div className="mt-6 rounded-2xl bg-[#F7F3E8] p-4 text-sm">
          جستجوی هوشمند پس از اتصال Supabase فعال می‌شود و نتایج مراسم، صوت و اشعار را یکجا نشان می‌دهد.
        </div>
      </div>
    </div>
  );
}
