# تکنیک پخش ویدیوهای آپارات داخل سایت (مهم — برای مراحل بعدی)

این روش برای همه ویدیوهای آینده (نماهنگ، مراسم، ریلز و...) استفاده می‌شود.

## فرمت درست امبد آپارات
```
https://www.aparat.com/video/video/embed/videohash/{APARAT_ID}/vt/frame
```
- `{APARAT_ID}` همان آیدی ویدیو در URL است (مثلاً `tmgr0l2` از `aparat.com/v/tmgr0l2`)
- ⚠️ فرمت قدیمی `https://www.aparat.com/video/{id}/vframe/embed` **کار نمی‌کند** (404 / refused to connect)

## گرفتن لیست ویدیوها از کانال/پلی‌لیست
- صفحه پلی‌لیست: `https://www.aparat.com/playlist/{PLAYLIST_ID}/` — با fetch_page (چانک‌بندی ۶ تایی)
- صفحه ویدیوهای کانال: `https://www.aparat.com/fadakinfo/videos?page=N`
- صفحه پلی‌لیست‌های کانال: `https://www.aparat.com/fadakinfo/playlists`
- از خروجی markdown می‌شود گرفت: آیدی ویدیو، عنوان، مدت، هش کاور (thumb) و secret امضاشده
- ⚠️ API آپارات (`api/fa/v1/...`) خراب است (خطای videohash) — استفاده نکن
- ⚠️ curl از سندباکس به آپارات نمی‌رسد (timeout) — فقط fetch_page کار می‌کند

## کاور (thumbnail)
- فرمت: `https://static.cdn.asset.aparat.com/avt/{HASH}.jpg?width=700&quality=90&secret={SECRET}`
- HASH و SECRET از صفحه پلی‌لیست/کانال گرفته می‌شود
- secret امضاشده است و ممکن است بعد از مدتی منقضی شود — در UI فالبک (onError/placeholder) بگذار

## مرتب‌سازی بر اساس تاریخ انتشار
- ستون `created_at` جدول `videos` برای ترتیب نمایش استفاده می‌شود (جدیدترین اول = created_at بزرگ‌تر)
- «زمان پیش» از صفحه پلی‌لیست (مثلاً «۱۲ ساعت پیش»، «۱ هفته پیش»، «۲ ماه پیش») برای محاسبه ترتیب استفاده می‌شود
- ⚠️ آیدی ویدیوها را دقیق کپی کن (مثلاً `vzbw26q` با v، نه `wzbw26q`) — اشتباه در یک حرف باعث 404 می‌شود

## پلیر سراسری (مینی‌پلیر)
- `src/context/VideoPlayerContext.tsx` — وضعیت پخش سراسری
- `src/components/VideoPlayer.tsx` — پلیر کامل (با دکمه مینی‌مالیز)
- `src/components/GlobalVideoPlayer.tsx` — مینی‌پلیر پایین صفحه (در layout، با تغییر صفحه باقی می‌ماند)
- iframe بین پلیر کامل و مینی‌پلیر با DOM-move جابه‌جا می‌شود تا پخش قطع نشود
- هنگام تغییر صفحه بدون مینی‌مالیز: iframe خالی (about:blank) و پخش متوقف می‌شود

## کانال آپارات فدک
- نام کاربری: `fadakinfo` — آیدی کانال: `547634`
- پلی‌لیست نماهنگ حسین طاهری: `8549865` (۱۰۰ ویدیو)
- پلی‌لیست نماهنگ علیرضا طاهری: `22828737` (۱۱ ویدیو)
- پلی‌لیست نماهنگ حسین طاهری (جدید): `28234661` (۲ ویدیو)
