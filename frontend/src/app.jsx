import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginView from './views/LoginView';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import ClienteDashboard from './pages/ClienteDashboard';
import ChoferDashboard from './pages/ChoferDashboard';
import AdminStaffDashboard from './pages/AdminStaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PerfilConfigView from './pages/PerfilConfigView';
import HistorialTrasladosView from './pages/HistorialTrasladosView';

const roleRoutes = {
  CLIENTE: '/cliente',
  CHOFER: '/chofer',
  ADMINISTRATIVO: '/administrativo',
  ADMIN: '/admin',
};

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleRoutes[user.rol] || '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/perfil" element={<PerfilConfigView />} />
        <Route path="/historial" element={<HistorialTrasladosView />} />

        <Route
          path="/cliente"
          element={
            <ProtectedRoute allowedRoles={['CLIENTE']}>
              <ClienteDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chofer"
          element={
            <ProtectedRoute allowedRoles={['CHOFER']}>
              <ChoferDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/administrativo"
          element={
            <ProtectedRoute allowedRoles={['ADMINISTRATIVO']}>
              <AdminStaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route index element={<RoleRedirect />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
