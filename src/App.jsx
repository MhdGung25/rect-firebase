import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";

function App() {
  const { user, loading } = useAuth();
  const [namaWarung, setNamaWarung] = useState("Catatan Digital");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
      />

      {/* DASHBOARD (PROTECTED) */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard
              user={user}
              namaWarung={namaWarung}
              setNamaWarung={setNamaWarung}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ROOT */}
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
