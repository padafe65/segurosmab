import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Registrar from "./pages/Register";

import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardUser from "./pages/DashboardUser";

import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <div className="app-layout">

        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Registrar />} />

            <Route
              path="/dashboard-admin"
              element={
                <ProtectedRoute role="admin">
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard-user"
              element={
                <ProtectedRoute role="user">
                  <DashboardUser />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />

      </div>
    </Router>
  );
}
