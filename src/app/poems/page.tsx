const poems = [
  { title: "شعر ولادت حضرت علی‌اکبر (ع)", poet: "—", preview: "ای ماه بنی‌هاشم..." },
  { title: "روضه شهادت حضرت جوادالائمه (ع)", poet: "—", preview: "یا جوادالائمه..." },
  { title: "مدح حضرت زهرا (س)", poet: "—", preview: "فاطمه پاره تن پیامبر..." },
];

export default function PoemsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">متن شعر</h1>
      <p className="mt-2 text-[#3D2B1F]/80">متن کامل اشعار خوانده‌شده با جستجو و اشتراک‌گذاری</p>
      <div className="mt-8 space-y-4">
        {poems.map((p) => (
          <article key={p.title} className="gold-frame rounded-3xl bg-white p-6">
            <h2 className="text-lg font-extrabold">{p.title}</h2>
            <p className="mt-2 leading-8 text-[#3D2B1F]/80">{p.preview}</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-full bg-[#0B3D2E] px-4 py-2 text-sm text-white">متن کامل</button>
              <button className="rounded-full border px-4 py-2 text-sm">کپی</button>
              <button className="rounded-full border px-4 py-2 text-sm">اشتراک‌گذاری</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
