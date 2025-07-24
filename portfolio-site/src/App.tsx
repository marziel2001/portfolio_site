import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import Layout from "./Layout";
import Home from "./home";
import NoPage from "./NoPage";
import Gallery from "./gallery";
import Contact from "./contact";

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
