import React from "react";
// 1. Changed HashRouter to BrowserRouter
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import DataHub from "./DataHub";
import "leaflet/dist/leaflet.css";
import About from "./About";
import Updates from "./Updates";

export default function App() {
  return (
    // 2. Added basename so paths map correctly to your GitHub repository URL
    <BrowserRouter basename="/">
      <Routes>
        {/* Main page */}
        <Route path="/" element={<Home />} />

        {/* DataHub page */}
        <Route path="/data-hub" element={<DataHub />} />
        <Route path="/about" element={<About />} />
        <Route path="/updates" element={<Updates />} />
      </Routes>
    </BrowserRouter>
  );
}