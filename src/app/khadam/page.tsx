export default function KhadamPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="gold-frame rounded-3xl bg-white p-8">
        <h1 className="text-3xl font-extrabold text-[#0B3D2E]">ثبت‌نام خادمین</h1>
        <p className="mt-2 leading-8 text-[#3D2B1F]/80">
          برای خدمت در هیأت فدائیان حضرت زهرا (س) فرم زیر را پر کنید. پس از تایید در پنل مدیریت، با شما تماس گرفته می‌شود.
        </p>
        <form className="mt-6 space-y-4" action="/api/khadam" method="post">
          <div>
            <label className="text-sm font-bold">نام و نام خانوادگی *</label>
            <input name="full_name" required className="mt-1 w-full rounded-xl border p-3" placeholder="مثلاً محمد محمدی" />
          </div>
          <div>
            <label className="text-sm font-bold">شماره موبایل *</label>
            <input name="mobile" required inputMode="tel" className="mt-1 w-full rounded-xl border p-3" placeholder="0912..." />
          </div>
          <div>
            <label className="text-sm font-bold">شهر</label>
            <input name="city" className="mt-1 w-full rounded-xl border p-3" placeholder="تهران" />
          </div>
          <div>
            <label className="text-sm font-bold">نوع خدمت</label>
            <select name="service_type" className="mt-1 w-full rounded-xl border p-3">
              <option>انتظامات</option>
              <option>پذیرایی</option>
              <option>رسانه و عکاسی</option>
              <option>صدا و نور</option>
              <option>سایر</option>
            </select>
          </div>
          <button className="w-full rounded-full bg-[#0B3D2E] py-3 font-bold text-[#F7F3E8]">ثبت درخواست</button>
          <p className="text-center text-xs text-[#3D2B1F]/60">در فاز دیتابیس، درخواست‌ها در پنل /admin بررسی می‌شوند.</p>
        </form>
      </div>
    </div>
  );
}
