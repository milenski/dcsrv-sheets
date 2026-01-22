import React, { createContext, useContext, useMemo, useState } from "react";

export type AppRole = "owner" | "admin" | "member";

type RoleContextValue = {
  role: AppRole;
  setRole: (role: AppRole) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  // Demo-only default: owner so the app is usable out of the box.
  const [role, setRole] = useState<AppRole>("owner");

  const value = useMemo(() => ({ role, setRole }), [role]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}

export function canAccessBilling(role: AppRole) {
  return role === "owner";
}

export function canAccessDevelopers(role: AppRole) {
  return role === "owner" || role === "admin";
}

export function canAccessTeam(role: AppRole) {
  return role === "owner" || role === "admin";
}

export function canTransferOwnership(role: AppRole) {
  return role === "owner";
}
