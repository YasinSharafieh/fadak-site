import Link from "next/link";
import { collections } from "@/data/mock";

export const instant = false;

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <Link href="/collections" className="text-sm text-[#14a3a2] hover:underline">← بازگشت به مجموعه‌ها</Link>

      <div data-motion="fade" className="mt-6 text-center">
        <div className="text-6xl">🕌</div>
        <h1 className="mt-4 text-3xl font-extrabold text-white">{collection?.name || "مجموعه"}</h1>
        <p className="mt-2 text-white/70/70">آرشیو آثار {collection?.name}</p>
      </div>

      <div data-motion="lift" className="gold-frame mt-10 rounded-3xl bg-[#1a1a1a] p-8 text-center">
        <p className="text-white/70/70">محتوای این مجموعه به‌زودی اضافه می‌شود.</p>
        <Link href="/archive" className="btn-green mt-4 inline-block rounded-full px-6 py-3">
          مشاهده آرشیو مراسم‌ها
        </Link>
      </div>
    </div>
  );
}
