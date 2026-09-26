import Home from "./pages/Home";
import MangaMenu from "./pages/MangaMenu";

export default function App() {
  return window.location.pathname === "/manga-menu" ? <MangaMenu /> : <Home />;
}
