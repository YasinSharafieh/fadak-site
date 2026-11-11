export const instant = false;

export default function AdminEventsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">افزودن مراسم جدید</h1>
      <form className="mt-8 space-y-4 rounded-3xl bg-white p-6 shadow" action="/api/admin/events" method="post">
        <div>
          <label className="text-sm font-bold">عنوان مراسم *</label>
          <input name="title" required className="mt-1 w-full rounded-xl border p-3" placeholder="مثلاً مجلس روضه هفتگی" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold">تاریخ شمسی</label>
            <input name="date_fa" className="mt-1 w-full rounded-xl border p-3" placeholder="سه‌شنبه ۲۱ آبان ۱۴۰۵" />
          </div>
          <div>
            <label className="text-sm font-bold">تاریخ قمری</label>
            <input name="date_hijri" className="mt-1 w-full rounded-xl border p-3" placeholder="۲۱ جمادی‌الثانی ۱۴۴۸" />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold">مداح</label>
          <input name="maddah" defaultValue="کربلایی حسین طاهری" className="mt-1 w-full rounded-xl border p-3" />
        </div>
        <div>
          <label className="text-sm font-bold">مکان</label>
          <input name="location" className="mt-1 w-full rounded-xl border p-3" placeholder="حسینیه سیدالشهدا (ع)، تهران" />
        </div>
        <div>
          <label className="text-sm font-bold">وضعیت</label>
          <select name="status" className="mt-1 w-full rounded-xl border p-3">
            <option value="upcoming">آینده</option>
            <option value="past">گذشته (آرشیو)</option>
          </select>
        </div>
        <button className="w-full rounded-full bg-[#0B3D2E] py-3 font-bold text-white">ذخیره مراسم</button>
      </form>
      <a href="/admin" className="mt-4 inline-block text-sm text-[#0E7C7B]">← بازگشت به پنل</a>
    </div>
  );
}
