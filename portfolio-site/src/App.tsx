import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import Layout from "./Layout";
import Home from "./home";
import NoPage from "./NoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
