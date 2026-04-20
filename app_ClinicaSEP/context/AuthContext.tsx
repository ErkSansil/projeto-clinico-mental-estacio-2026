import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = { name: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // carrega sessão ao abrir app
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
      setLoading(false);
    })();
  }, []);

  async function login(username: string, password: string) {
    if (username === "admin" && password === "123") {
      const u = { name: username };
      setUser(u);
      await AsyncStorage.setItem("user", JSON.stringify(u));
      return true;
    }
    return false;
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fora do AuthProvider");
  return ctx;
}