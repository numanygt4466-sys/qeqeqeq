import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type User = {
  id: number;
  username: string;
  email: string;
  fullName: string;
  labelName: string | null;
  role: string;
  isApproved: boolean;
  country: string | null;
  timezone: string | null;
  createdAt: string;
};

type AuthContextType = {
  user: User | null | undefined;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loginError: string | null;
  registerError: string | null;
  registerSuccess: boolean;
  clearErrors: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ user: User } | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.status === 401) return null;
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", { username, password });
      return res.json();
    },
    onSuccess: () => {
      window.location.href = "/app/dashboard";
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      return res.json();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear();
    },
  });

  const user = data?.user ?? null;

  return (
    <AuthContext.Provider
      value={{
        user: isLoading ? undefined : user,
        isLoading,
        login: async (username, password) => {
          loginMutation.reset();
          await loginMutation.mutateAsync({ username, password });
        },
        register: async (data) => {
          registerMutation.reset();
          await registerMutation.mutateAsync(data);
        },
        logout: async () => {
          await logoutMutation.mutateAsync();
        },
        loginError: loginMutation.error?.message?.replace(/^\d+:\s*/, "") || null,
        registerError: registerMutation.error?.message?.replace(/^\d+:\s*/, "") || null,
        registerSuccess: registerMutation.isSuccess,
        clearErrors: () => {
          loginMutation.reset();
          registerMutation.reset();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
