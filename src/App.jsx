import { useState } from "react";
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Error from "./pages/Error/Error";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Error Title="explore" />} />
            <Route path="/ticket" element={<Error Title="ticket" />} />
            <Route path="/favorites" element={<Error Title="favorites" />} />
            <Route path="/settings" element={<Error Title="settings" />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
