import { useMemo } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "./components/layout/layout";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./hooks/useAuthContext";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { PartnerGroups } from "./pages/partner-groups";
import { Partners } from "./pages/partners";
import { Users } from "./pages/users";

// Protected route component
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "MANAGER" | "VIEWER";
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const isAuthorized = useMemo(() => {
    if (!user) return false;
    if (!requiredRole) return true;
    const roleHierarchy = { VIEWER: 0, MANAGER: 1, ADMIN: 2 };
    const userRoleLevel = user?.role ? roleHierarchy[user.role] : -1;
    const requiredRoleLevel = roleHierarchy[requiredRole];
    return userRoleLevel >= requiredRoleLevel;
  }, [user, requiredRole]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAuthorized) {
    toast("You are not authorized to access this page");
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute requiredRole="VIEWER">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route
              path="partner-groups"
              element={
                <ProtectedRoute requiredRole="VIEWER">
                  <PartnerGroups />
                </ProtectedRoute>
              }
            />
            <Route
              path="partners"
              element={
                <ProtectedRoute requiredRole="VIEWER">
                  <Partners />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Users />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
