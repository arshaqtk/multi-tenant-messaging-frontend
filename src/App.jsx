import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './components/AdminPanel';
import ChatPage from './components/ChatPage';
import { useAuth } from './context/AuthContext';

function AuthenticatedLayout() {
  const { user, role, logout } = useAuth();

  return (
    <main className="app">
      <AppHeader user={user} role={role} onLogout={logout} />
      <Outlet />
    </main>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/chat" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/chat" replace /> : <Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/chat" replace />} />
        <Route path="chat" element={<ChatPage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/chat' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
