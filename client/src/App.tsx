import Home from "./pages/Home";
import MangaMenu from "./pages/MangaMenu";
import Nabda from "./pages/Nabda";
import NabdaBarber from "./pages/NabdaBarber";
import Mirqah from "./pages/Mirqah";

export default function App() {
  const path = window.location.pathname;
  return path === "/manga-menu" ? <MangaMenu /> : path === "/nabda" ? <NabdaBarber /> : path === "/nabda-demo" ? <Nabda /> : path === "/mirqah" ? <Mirqah /> : <Home />;
}
