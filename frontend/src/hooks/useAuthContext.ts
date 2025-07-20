import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./useApi";
import { useCurrentUser, useLogin } from "./useAuthHooks";

export const useAuth = () => {
  const navigate = useNavigate();
  const { data: user, mutate: mutateUser, isLoading } = useCurrentUser();
  const { trigger: login, isMutating: isLoggingIn } = useLogin();

  const loginUser = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const result = await login(data);
        const { token } = result || {};
        if (token) {
          delete api.defaults.headers.Authorization;
          api.defaults.headers.Authorization = `Bearer ${token}`;
          localStorage.setItem("token", token);
          await mutateUser();
          navigate("/dashboard");
        }
        return result;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [login, mutateUser, navigate]
  );

  const logoutUser = useCallback(async () => {
    try {
      localStorage.removeItem("token");
      delete api.defaults.headers.Authorization;
      await mutateUser(undefined);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [mutateUser, navigate]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    isManager: user?.role === "MANAGER",
    isViewer: user?.role === "VIEWER",
    isLoggingIn,
    login: loginUser,
    logout: logoutUser,
  };
};
