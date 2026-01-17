import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; initials: string } | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key for persisting auth state
const AUTH_STORAGE_KEY = "docservant_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; initials: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setUser(parsed.user);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Simple validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    
    if (password.length < 6) {
      throw new Error("Invalid credentials");
    }

    const name = email.split("@")[0];
    const initials = name
      .split(/[._-]/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const userData = { name, email, initials };
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userData }));
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Simple validation
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const userData = { name, email, initials };
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userData }));
  }, []);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  // Don't render children until we've checked the session
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
