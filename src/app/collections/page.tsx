import Link from "next/link";
import { collections } from "@/data/mock";

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div data-motion="fade" className="text-center">
        <h1 className="text-3xl font-extrabold text-white">مجموعه‌ها</h1>
        <p className="mt-2 text-white/70/70">دسترسی سریع به آرشیو مناسبت‌های مختلف</p>
      </div>

      <div data-motion-stagger="slide" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className="card-hover group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B] p-8 text-center text-white"
          >
            <div className="islamic-pattern-dark absolute inset-0" />
            <div className="relative">
              <div className="text-5xl">🕌</div>
              <div className="mt-3 text-2xl font-extrabold">{col.name}</div>
              <p className="mt-2 text-sm text-white/70">مشاهده آثار ←</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
