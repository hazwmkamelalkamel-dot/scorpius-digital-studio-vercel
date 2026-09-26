import Home from "./pages/Home";
import MangaMenu from "./pages/MangaMenu";
import Nabda from "./pages/Nabda";
import NabdaBarber from "./pages/NabdaBarber";
import Mirqah from "./pages/Mirqah";
import ScorpiusAdmin from "./pages/ScorpiusAdmin";

export default function App() {
  return window.location.pathname === "/admin" ? <ScorpiusAdmin /> : window.location.pathname === "/manga-menu" ? <MangaMenu /> : window.location.pathname === "/nabda" ? <NabdaBarber /> : window.location.pathname === "/nabda-demo" ? <Nabda /> : window.location.pathname === "/mirqah" ? <Mirqah /> : <Home />;
}
