import { createContext, useState, useEffect } from "react";
import api from "../api/Axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      // Check if there was a previous session flag.
      // If not, we don't block the app loading state (huge boost for guests/public pages)
      const hasSession = localStorage.getItem("growstudy_has_session") === "true";
      if (!hasSession) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/user/me");
        setUser(res.data);
      } catch {
        setUser(null);
        localStorage.removeItem("growstudy_has_session");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Automatically sync session status to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("growstudy_has_session", "true");
    } else if (user === null && !loading) {
      localStorage.removeItem("growstudy_has_session");
    }
  }, [user, loading]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};