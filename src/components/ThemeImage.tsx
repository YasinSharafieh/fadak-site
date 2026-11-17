"use client";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  darkSrc: string;
  lightSrc: string;
  alt: string;
  className?: string;
};

/** در حالت شب همان لوگوی سفید، در حالت روز نسخهٔ تیرهٔ همان لوگو. حالت شب پیش‌فرض است. */
export default function ThemeImage({ darkSrc, lightSrc, alt, className }: Props) {
  const { theme } = useTheme();
  return <img src={theme === "light" ? lightSrc : darkSrc} alt={alt} className={className} />;
}
