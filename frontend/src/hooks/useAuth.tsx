import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Session {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Base URL of the backend API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedSession = localStorage.getItem("auth_session");
    if (storedSession) {
      try {
        const parsedSession: Session = JSON.parse(storedSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
      } catch (e) {
        localStorage.removeItem("auth_session");
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const url = `${API_URL}/api/auth/register`;
    console.log("Attempting signup at:", url);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fullName, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to sign up");

    const newSession: Session = { token: data.token, user: { id: data.user.id || data.user._id, name: data.user.name, email: data.user.email } };
    setSession(newSession);
    setUser(newSession.user);
    localStorage.setItem("auth_session", JSON.stringify(newSession));
  };

  const signIn = async (email: string, password: string) => {
    const url = `${API_URL}/api/auth/login`;
    console.log("Attempting login at:", url);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to sign in");

    const newSession: Session = { token: data.token, user: { id: data.user.id || data.user._id, name: data.user.name, email: data.user.email } };
    setSession(newSession);
    setUser(newSession.user);
    localStorage.setItem("auth_session", JSON.stringify(newSession));
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    localStorage.removeItem("auth_session");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
