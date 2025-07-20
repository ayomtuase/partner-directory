import { Outlet } from 'react-router-dom';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import { useAuth } from '@/hooks/useAuthContext';

export function Layout() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Partner Directory</h1>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={user} onLogout={logout} />
          </div>
        </div>
      </div>
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
