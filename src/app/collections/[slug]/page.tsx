import Link from "next/link";
import { collections } from "@/data/mock";

export const instant = false;

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <Link href="/collections" className="text-sm text-[#0E7C7B] hover:underline">← بازگشت به مجموعه‌ها</Link>

      <div className="mt-6 text-center">
        <div className="text-6xl">🕌</div>
        <h1 className="mt-4 text-3xl font-extrabold text-[#0B3D2E]">{collection?.name || "مجموعه"}</h1>
        <p className="mt-2 text-[#3D2B1F]/70">آرشیو آثار {collection?.name}</p>
      </div>

      <div className="gold-frame mt-10 rounded-3xl bg-white p-8 text-center">
        <p className="text-[#3D2B1F]/70">محتوای این مجموعه به‌زودی اضافه می‌شود.</p>
        <Link href="/archive" className="btn-green mt-4 inline-block rounded-full px-6 py-3">
          مشاهده آرشیو مراسم‌ها
        </Link>
      </div>
    </div>
  );
}
