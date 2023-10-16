import { useState } from "react";
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={"Explore"} />
            <Route path="/ticket" element={"ticket"} />
            <Route path="/favorites" element={"favorites"} />
            <Route path="/settings" element={"settings"} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
