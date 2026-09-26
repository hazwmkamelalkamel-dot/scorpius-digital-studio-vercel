import { ArrowRight, Coffee, Instagram, MapPin, MessageCircle, QrCode, Sparkles, Star } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type MenuItem = { name: string; description: string; price: string; badge?: string };
type MenuSection = { title: string; subtitle: string; items: MenuItem[] };

const menuSections: MenuSection[] = [
  {
    title: "مشروبات مانجا",
    subtitle: "طازة، ساقعة، ومليانة طاقة",
    items: [
      { name: "مانجا فريش", description: "مانجا طبيعية مضروبة مع تلج", price: "85 ج.م", badge: "الأكثر طلبًا" },
      { name: "مانجا باشن", description: "مانجا، باشن فروت، ولمسة نعناع", price: "95 ج.م" },
      { name: "مانجا كريمي", description: "مانجا كريمي مع فانيليا ووش كريمة", price: "105 ج.م" },
      { name: "مانجا سبلاش", description: "مانجا، صودا، وليمون فوار", price: "90 ج.م" },
    ],
  },
  {
    title: "قهوة ومشروبات ساخنة",
    subtitle: "مزاجك المظبوط في كل رشفة",
    items: [
      { name: "سبانيش لاتيه", description: "إسبريسو، لبن، وحليب مكثف", price: "95 ج.م", badge: "مميز" },
      { name: "آيس كوفي", description: "قهوة باردة مع لبن وتلج", price: "85 ج.م" },
      { name: "كابتشينو", description: "إسبريسو، لبن مبخر، ورغوة ناعمة", price: "80 ج.م" },
      { name: "هوت شوكليت", description: "شوكولاتة ساخنة وكريمة مخفوقة", price: "90 ج.م" },
    ],
  },
  {
    title: "حلو مانجا",
    subtitle: "حاجة مسكرة تستاهلها",
    items: [
      { name: "وافل مانجا", description: "وافل دافئ، مانجا، صوص أبيض وآيس كريم", price: "135 ج.م", badge: "جديد" },
      { name: "بان كيك ميكس", description: "بان كيك، فراولة، موز، وصوص شوكولاتة", price: "145 ج.م" },
      { name: "كريب نوتيلا", description: "كريب طري مع نوتيلا وموز", price: "125 ج.م" },
      { name: "تشيز كيك مانجا", description: "تشيز كيك بارد مع صوص مانجا", price: "120 ج.م" },
    ],
  },
  {
    title: "سناكس خفيفة",
    subtitle: "لقمة على السريع",
    items: [
      { name: "كلوب ساندوتش", description: "فراخ، جبنة، خس، وطماطم مع بطاطس", price: "155 ج.م" },
      { name: "تشيز فرايز", description: "بطاطس كريسبي، جبنة، وصوص خاص", price: "110 ج.م" },
      { name: "كرواسون جبنة", description: "كرواسون طازة بحشوة الجبنة", price: "85 ج.م" },
      { name: "ميني بيتزا", description: "عجينة خفيفة بصوص الطماطم والجبنة", price: "120 ج.م" },
    ],
  },
];

function ItemCard({ item }: { item: MenuItem }) {
  return <article className="manga-item">
    <div className="manga-item-top"><span className="manga-item-dot" /><div><h3>{item.name}</h3><p>{item.description}</p></div>{item.badge && <b>{item.badge}</b>}</div>
    <strong>{item.price}</strong>
  </article>;
}

export default function MangaMenu() {
  const menuUrl = typeof window !== "undefined" ? `${window.location.origin}/manga-menu` : "/manga-menu";
  return <div className="manga-page">
    <header className="manga-header"><a href="/" className="manga-back"><ArrowRight size={16} /> SCORPIUS STUDIO</a><span className="manga-status"><i /> OPEN TODAY · 10 AM — 1 AM</span></header>
    <main>
      <section className="manga-hero"><div className="manga-orb" /><div className="manga-hero-content"><span className="manga-eyebrow"><Sparkles size={15} /> DIGITAL MENU · 01</span><h1>حِتّة<br /><em>مانجا.</em></h1><p>كافيه صغير بمود كبير. مشروبات فريش، قهوة مظبوطة، وحلويات تتصور قبل ما تتاكل.</p><div className="manga-location"><MapPin size={16} /> القاهرة الجديدة · شارع التسعين</div></div><div className="manga-qr-card"><div className="manga-qr"><QRCodeSVG value={menuUrl} size={128} bgColor="#fffaf0" fgColor="#1a261a" level="M" /></div><QrCode size={20} /><span>SCAN TO ORDER<br /><b>امسح الكود للمنيو</b></span></div></section>
      <section className="manga-intro"><div><span>WELCOME TO HETTA MANGA</span><h2>اختار مودك.<br /><em>إحنا نجهزه.</em></h2></div><p>كل حاجة عندنا معمولة عشان توقف يومك خمس دقايق. اطلب منيوك، اقعد براحتك، وسيب الباقي علينا.</p></section>
      <div className="manga-menu-list">{menuSections.map((section) => <section className="manga-section" key={section.title}><div className="manga-section-head"><div><span>MENU / {String(menuSections.indexOf(section) + 1).padStart(2, "0")}</span><h2>{section.title}</h2></div><p>{section.subtitle}</p></div><div className="manga-items">{section.items.map(item => <ItemCard key={item.name} item={item} />)}</div></section>)}</div>
      <section className="manga-note"><Coffee size={25} /><div><h2>عندك سؤال أو طلب خاص؟</h2><p>كلمنا على واتساب قبل ما تيجي، ونجهزلك طلبك.</p></div><a href="https://wa.me/201050094382" target="_blank" rel="noreferrer"><MessageCircle size={17} /> واتساب</a></section>
    </main>
    <footer className="manga-footer"><div><strong>حِتّة مانجا<span> /.</span></strong><p>COFFEE · SWEETS · GOOD MOOD</p></div><div className="manga-footer-right"><span><Star size={14} fill="currentColor" /> 4.9 · OUR GUESTS</span><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={16} /> @hettamanga</a></div></footer>
  </div>;
}
