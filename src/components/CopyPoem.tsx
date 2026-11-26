"use client";

import { useState } from "react";

export default function CopyPoem({ text, compact = false }: { text: string; compact?: boolean }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "true");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={
        compact
          ? "rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-white/80 transition hover:border-[#14a3a2] hover:text-[#14a3a2]"
          : "rounded-full border border-white/15 px-5 py-2 text-sm font-bold transition hover:border-[#14a3a2] hover:text-[#14a3a2]"
      }
    >
      {done ? "کپی شد" : "کپی متن"}
    </button>
  );
}
