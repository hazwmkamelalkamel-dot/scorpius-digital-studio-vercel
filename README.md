# SCORPIUS Digital Studio

موقع SCORPIUS لاستوديو رقمي وفريق متكامل في تطوير المنتجات، تصميم الواجهات، والهوية البصرية.

## Vercel

هذا المشروع مهيأ كنشر **Vite + React static** على Vercel، بدون Express أو خادم Node طويل التشغيل.

- Framework Preset: `Vite`
- Root Directory: `.`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm run build`
- Output Directory: `dist`

يوجد ملف `vercel.json` بهذه الإعدادات، لذلك يمكن ترك إعدادات Vercel الافتراضية كما هي عند الربط بالمستودع.

## التشغيل المحلي

```bash
pnpm install
pnpm run dev
```

## منيو QR تجريبية

- صفحة المنيو: `/manga-menu`
- الاسم التجريبي: **حِتّة مانجا**
- تشمل مشروبات مانجا، قهوة، وافلز، بان كيك، كريب، تشيز كيك وسناكس.
- يوجد QR فعلي داخل الصفحة يفتح رابط المنيو نفسه.

## نَبضة — Booking, made human

صفحة Demo مستقلة لنظام حجوزات ذكي لأصحاب البيزنس الصغير:

- رابط التجربة: `/nabda`
- لوحة تحكم بالمواعيد والعملاء والخدمات.
- صفحة حجز تفاعلية مع اختيار الخدمة والوقت وتأكيد الحجز.
- المشروع تجريبي Frontend فقط لعرض تجربة المنتج.
