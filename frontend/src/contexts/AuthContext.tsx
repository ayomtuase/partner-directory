import { createContext, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isViewer: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    isManager, 
    isViewer, 
    login: loginUser, 
    logout: logoutUser 
  } = useAuth();

  const login = async (email: string, password: string) => {
    await loginUser({ email, password });
  };

  const logout = async () => {
    await logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isManager,
        isViewer,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
