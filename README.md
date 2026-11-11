# فدک — پایگاه حفظ و نشر آثار کربلایی حسین طاهری

حسینیه مجازی هیأت فدائیان حضرت زهرا (س) — Next.js + Supabase + Vercel

## اجرا در لوکال
```bash
npm install
npm run dev
```

## دیپلوی
1. کد را روی GitHub پوش کن
2. در Vercel پروژه را Import کن
3. متغیرهای `.env.example` را در Vercel وارد کن
4. دامنه fadak.me را در Settings → Domains اضافه کن

## ساختار
- `src/app` — صفحات (خانه، مراسم، آرشیو، صوت، ریلز، ...)
- `src/components` — هدر، فوتر، کارت‌ها
- `src/data` — داده نمونه (بعداً از Supabase می‌آید)
- `supabase/schema.sql` — اسکیمای دیتابیس
- `docs/setup-guide.md` — راهنمای ساخت اکانت‌ها
