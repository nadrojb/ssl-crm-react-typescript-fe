import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiClient } from "../api/client";

interface User {
  id: number;
  name: string;
  email: string;
  last_name?: string | null;
  email_verified_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isUser = (value: unknown): value is User => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    (value.last_name === undefined ||
      typeof value.last_name === "string" ||
      value.last_name === null) &&
    (value.email_verified_at === undefined ||
      typeof value.email_verified_at === "string" ||
      value.email_verified_at === null) &&
    (value.created_at === undefined ||
      typeof value.created_at === "string" ||
      value.created_at === null) &&
    (value.updated_at === undefined ||
      typeof value.updated_at === "string" ||
      value.updated_at === null)
  );
};

const getStoredAuth = (): { token: string | null; user: User | null } => {
  const token = localStorage.getItem(TOKEN_KEY);
  const storedUser = localStorage.getItem(USER_KEY);

  if (!token || !storedUser) {
    return { token: null, user: null };
  }

  try {
    const parsed: unknown = JSON.parse(storedUser);
    if (!isUser(parsed)) {
      return { token: null, user: null };
    }

    return { token, user: parsed };
  } catch {
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedAuth = getStoredAuth();

  const [user, setUser] = useState<User | null>(storedAuth.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    storedAuth.token != null && storedAuth.user != null
  );
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const { token, user: storedUser } = getStoredAuth();

    if (token && storedUser) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
      setUser(null);
      setIsAuthenticated(false);
    }

    setIsReady(true);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    setIsAuthenticated(true);
    setIsReady(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete apiClient.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    setIsReady(true);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isReady, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
