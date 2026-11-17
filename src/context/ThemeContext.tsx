"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";

type ThemeValue = {
  theme: Theme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeValue>({ theme: "dark", toggle: () => {} });

/**
 * تم پیش‌فرض همیشه شب است.
 * انتخاب کاربر فقط تا رفرش بعدی در حافظه می‌ماند و هرگز در localStorage ذخیره نمی‌شود.
 * با هر بار بالا آمدن صفحه، تم دوباره مشکی است.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
