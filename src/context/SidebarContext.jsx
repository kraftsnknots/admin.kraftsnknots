import { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  // (Load saved state from localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  // Save state persistently
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook for easy access
export const useSidebar = () => useContext(SidebarContext);
