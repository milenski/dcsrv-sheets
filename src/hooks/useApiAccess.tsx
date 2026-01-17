import { createContext, useContext, useState, ReactNode } from "react";

interface ApiAccessContextType {
  apiEnabled: boolean;
  setApiEnabled: (enabled: boolean) => void;
}

const ApiAccessContext = createContext<ApiAccessContextType | undefined>(undefined);

export function ApiAccessProvider({ children }: { children: ReactNode }) {
  // In a real app, this would come from backend/localStorage
  const [apiEnabled, setApiEnabled] = useState(true);

  return (
    <ApiAccessContext.Provider value={{ apiEnabled, setApiEnabled }}>
      {children}
    </ApiAccessContext.Provider>
  );
}

export function useApiAccess() {
  const context = useContext(ApiAccessContext);
  if (!context) {
    throw new Error("useApiAccess must be used within an ApiAccessProvider");
  }
  return context;
}
