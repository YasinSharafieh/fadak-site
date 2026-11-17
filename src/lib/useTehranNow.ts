"use client";

import { useEffect, useState } from "react";
import { msUntilTehranMidnight, tehranDateKey } from "@/lib/jalali";

/**
 * ساعت جاری، با تعویض قطعی در ۰۰:۰۰ به وقت تهران.
 * اگر تب پس‌زمینه یا سیستم خواب باشد، با برگشت به صفحه همان لحظه تاریخ تازه می‌شود.
 */
export function useTehranNow() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer = 0;
    const refresh = () => {
      const next = new Date();
      const key = tehranDateKey(next);
      setNow((prev) => (prev && tehranDateKey(prev) === key ? prev : next));
      window.clearTimeout(timer);
      timer = window.setTimeout(refresh, msUntilTehranMidnight(next));
    };
    refresh();
    const backup = window.setInterval(refresh, 15_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(backup);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, []);

  return now;
}
