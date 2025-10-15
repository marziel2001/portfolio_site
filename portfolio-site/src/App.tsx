import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import Layout from "./Layout";
import Home from "./pages/home";
import NoPage from "./pages/noPage";
import Gallery from "./pages/gallery";
import Contact from "./pages/contact";
import "@fontsource/italianno";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Gallery" element={<Gallery />} />
          <Route path="Contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
