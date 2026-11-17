/** شماره موبایل ایران را به شکل 989xxxxxxxxx برمی‌گرداند. نامعتبر باشد null. */
export function normalizeIranMobile(input: string) {
  const digits = input.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/\D/g, "");
  let local = digits;
  if (local.startsWith("0098")) local = local.slice(4);
  else if (local.startsWith("98")) local = local.slice(2);
  else if (local.startsWith("0")) local = local.slice(1);
  if (!/^9\d{9}$/.test(local)) return null;
  return `98${local}`;
}

export function displayIranMobile(normalized: string) {
  const local = normalized.startsWith("98") ? `0${normalized.slice(2)}` : normalized;
  return local.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}
