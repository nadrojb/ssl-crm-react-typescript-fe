import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import LoginForm from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center space-y-4">
                <h1 className="text-2xl font-semibold">Page not found</h1>
                <div className="space-x-3">
                  <Link className="text-indigo-600 hover:underline" to="/login">
                    Go to Login
                  </Link>
                  <Link className="text-indigo-600 hover:underline" to="/register">
                    Go to Register
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
