import Home from "./pages/Home";
import MangaMenu from "./pages/MangaMenu";
import Nabda from "./pages/Nabda";
import NabdaBarber from "./pages/NabdaBarber";
import Mirqah from "./pages/Mirqah";
import NovaCafe from "./pages/NovaCafe";

export default function App() {
  const path = window.location.pathname;
  if (path === "/nova-cafe") return <NovaCafe />;
  if (path === "/nova-cafe/menu") return <NovaCafe view="menu" />;
  if (path === "/nova-cafe/reserve") return <NovaCafe view="reserve" />;
  if (path === "/nova-cafe/admin") return <NovaCafe view="admin" />;
  if (path === "/nova-cafe/qr-menu") return <NovaCafe view="qr" />;
  return path === "/manga-menu" ? <MangaMenu /> : path === "/nabda" ? <NabdaBarber /> : path === "/nabda-demo" ? <Nabda /> : path === "/mirqah" ? <Mirqah /> : <Home />;
}
