import Home from "./pages/Home";
import MangaMenu from "./pages/MangaMenu";
import Nabda from "./pages/Nabda";

export default function App() {
  return window.location.pathname === "/manga-menu" ? <MangaMenu /> : window.location.pathname === "/nabda" ? <Nabda /> : <Home />;
}
