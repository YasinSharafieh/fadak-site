const videos = [
  { title: "نماهنگ | پناهمی مادر | کربلایی حسین طاهری", duration: "۰۵:۱۹", views: "۲۴.۸ هزار", ago: "۳ هفته پیش", thumb: "https://static.cdn.asset.aparat.com/avt/73812629-5619-l__4971.jpg?width=900&quality=90&secret=NldLoKX53Nkj81mGJrfMiQ" },
  { title: "نماهنگ | سلسله عشق | حاج محمود کریمی و کربلایی حسین طاهری", duration: "۰۲:۳۱", views: "۹۲ هزار", ago: "۲ ماه پیش", thumb: "https://static.cdn.asset.aparat.com/avt/73196918-2339-l__4741.jpg?width=900&quality=90&secret=ufmvb64zYNzuJNx7DXW9Zg" },
  { title: "نماهنگ | ایران | کربلایی حسین طاهری", duration: "۰۵:۵۵", views: "۲۸.۸ هزار", ago: "۲ ماه پیش", thumb: "https://static.cdn.asset.aparat.com/avt/72763237-5792-l__9420.jpg?width=900&quality=90&secret=-wzqVpMCJ4YYqPHYjawW5Q" },
  { title: "نماهنگ | کوچه پس کوچه مشهد | کربلایی حسین طاهری", duration: "۰۵:۵۰", views: "۲۴ هزار", ago: "۳ ماه پیش", thumb: "https://static.cdn.asset.aparat.com/avt/72678295-3770-l__3829.jpg?width=900&quality=90&secret=W0G8SQOdm9a__-yyseWI5w" },
  { title: "نماهنگ | به عشق رهبرم | حاج محمدرضا طاهری و کربلایی حسین طاهری", duration: "۰۳:۳۹", views: "۱۵.۹ هزار", ago: "۳ ماه پیش", thumb: "https://static.cdn.asset.aparat.com/avt/72472953-8253-l__2827.jpg?width=900&quality=90&secret=C-mrBeZhOt3Wz48kBY087g" },
  { title: "نماهنگ | عشق جهانی | کربلایی حسین طاهری", duration: "۰۳:۵۴", views: "۷۲.۹ هزار", ago: "۳ ماه پیش", thumb: "https://static.cdn.asset.aparat.com/avt/72438501-5505-l__2197.jpg?width=900&quality=90&secret=He-uyIT2FOXsfGNbkwZoMA" },
];

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">نماهنگ و ویدیو</h1>
      <p className="mt-2 text-[#3D2B1F]/80">نماهنگ‌های آپارات فدک — مثل صفحه پیشنهاد سایت فعلی</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <a key={v.title} href="https://www.aparat.com" target="_blank" rel="noreferrer" className="overflow-hidden rounded-3xl bg-white shadow hover:shadow-lg">
            <div className="relative">
              <img src={v.thumb} alt={v.title} className="aspect-video w-full object-cover" />
              <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">{v.duration}</span>
            </div>
            <div className="p-4">
              <div className="font-bold leading-7">{v.title}</div>
              <div className="mt-1 text-xs text-[#3D2B1F]/60">{v.views} بازدید • {v.ago}</div>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-6 rounded-2xl bg-[#F7F3E8] p-4 text-sm">ویدیوهای مراسم‌ها از آپارات نمایش داده می‌شوند (فایل‌های بزرگ تلگرام آپلود نمی‌شوند). برای هر مراسم، لینک آپارات رو از پنل اضافه کنید.</p>
    </div>
  );
}
