import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; initials: string } | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for existing session
    return localStorage.getItem("docservant_auth") === "true";
  });
  
  const [user, setUser] = useState<{ name: string; email: string; initials: string } | null>(() => {
    const stored = localStorage.getItem("docservant_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate login - in production this would call an API
    const name = email.split("@")[0];
    const initials = name.slice(0, 2).toUpperCase();
    const userData = { name, email, initials };
    
    localStorage.setItem("docservant_auth", "true");
    localStorage.setItem("docservant_user", JSON.stringify(userData));
    
    setIsAuthenticated(true);
    setUser(userData);
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    // Simulate signup - in production this would call an API
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const userData = { name, email, initials };
    
    localStorage.setItem("docservant_auth", "true");
    localStorage.setItem("docservant_user", JSON.stringify(userData));
    
    setIsAuthenticated(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("docservant_auth");
    localStorage.removeItem("docservant_user");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

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
