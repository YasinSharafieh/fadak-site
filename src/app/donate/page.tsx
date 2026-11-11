export default function DonatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="gold-frame rounded-3xl bg-white p-8 text-center">
        <div className="text-4xl">❤️</div>
        <h1 className="mt-3 text-3xl font-extrabold text-[#0B3D2E]">کمک به هیئت</h1>
        <p className="mt-3 leading-8 text-[#3D2B1F]/80">
          با کمک‌های شما، مراسم‌های هیأت فدائیان حضرت زهرا (س) با کیفیت بهتر برگزار می‌شود. گزارش شفاف هزینه‌کرد در سایت منتشر می‌شود.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {["۵۰ هزار تومان", "۱۰۰ هزار تومان", "۲۰۰ هزار تومان"].map((a) => (
            <button key={a} className="rounded-2xl border border-[#C9A227]/50 bg-[#F7F3E8] p-4 font-bold hover:bg-[#0B3D2E] hover:text-white">
              {a}
            </button>
          ))}
        </div>
        <button className="mt-6 w-full rounded-full bg-[#C9A227] py-3 font-bold text-[#0B3D2E]">
          پرداخت از طریق زرین‌پال
        </button>
        <p className="mt-3 text-xs text-[#3D2B1F]/60">درگاه زرین‌پال در فاز پرداخت فعال می‌شود.</p>
      </div>
    </div>
  );
}
