import Link from "next/link";
import { reels } from "@/data/mock";

export default function ReelsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">ریلزهای فدک</h1>
      <p className="mt-2 text-[#3D2B1F]/80">ویدیوهای کوتاه عمودی ۹:۱۶ مثل اینستاگرام</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {reels.map((r) => (
          <Link key={r.id} href={`/reels/${r.id}`} className="overflow-hidden rounded-3xl bg-[#0B3D2E] text-[#F7F3E8]">
            <div className="flex h-80 items-center justify-center bg-gradient-to-b from-[#0E7C7B] to-[#0B3D2E] text-5xl">▶</div>
            <div className="p-4">
              <div className="font-bold">{r.title}</div>
              <div className="text-xs opacity-70">{r.duration}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
