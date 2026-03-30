import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient } from "../api/client";
import { getMe, type User } from "../api/auth";

type AuthContextType = {
  user: User | null;
  isReady: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";

const setAuthHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common["Authorization"];
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setAuthHeader(null);
      setUser(null);
      setIsReady(true);
      return;
    }

    setAuthHeader(token);

    getMe()
      .then((me) => {
        setUser(me);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthHeader(null);
        setUser(null);
      })
      .finally(() => {
        setIsReady(true);
      });
  }, []);

  const login = async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setAuthHeader(token);

    const me = await getMe();
    setUser(me);
    setIsReady(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthHeader(null);
    setUser(null);
    setIsReady(true);
  };

  const value = useMemo<AuthContextType>(() => {
    return { user, isReady, login, logout };
  }, [user, isReady]);

  return (
    <AuthContext.Provider value={value}>
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
