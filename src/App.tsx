import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginForm from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Job from "./pages/Job/job";
import Institutions from "./pages/Institutions";
import InstitutionDetails from "./pages/Institutions/institution-details";
import InstitutionCreate from "./pages/Institutions/institution-create";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import Contacts from "./pages/Contacts";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/jobs" element={<ProtectedRoute><Jobs/></ProtectedRoute>}/>
          <Route path="/jobs/:id" element={<ProtectedRoute><Job/></ProtectedRoute>}/>

          <Route path="/institutions" element={<ProtectedRoute><Institutions/></ProtectedRoute>}/>
          <Route path="/institutions/new" element={<ProtectedRoute><InstitutionCreate/></ProtectedRoute>}/>
          <Route path="/institutions/:id" element={<ProtectedRoute><InstitutionDetails/></ProtectedRoute>}/>

          <Route path="/calendar" element={<ProtectedRoute><Calendar/></ProtectedRoute>}/>

          <Route path="/tasks" element={<ProtectedRoute><Tasks/></ProtectedRoute>}/>

          <Route path="/contacts" element={<ProtectedRoute><Contacts/></ProtectedRoute>}/>

          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h1 className="text-2xl font-semibold">Page not found</h1>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
