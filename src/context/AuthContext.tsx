import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

import type {
  AuthUser,
  RegisterResponse,
} from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<RegisterResponse>;

  logout: () => void;

  updateUser: (
    updatedUser: AuthUser
  ) => void;
}

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] =
    useState<AuthUser | null>(
      null
    );

  const [token, setToken] =
    useState<string | null>(
      () => {
        return localStorage.getItem(
          "sumart-token"
        );
      }
    );

  const [loading, setLoading] =
    useState(true);

  // ========================================
  // RESTORE EXISTING SESSION
  // ========================================

  useEffect(() => {
    const restoreSession =
      async () => {
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          const data =
            await getCurrentUser(
              token
            );

          setUser(data.user);
        } catch (error) {
          console.error(error);

          localStorage.removeItem(
            "sumart-token"
          );

          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    restoreSession();
  }, [token]);

  // ========================================
  // LOGIN
  // ========================================

  const login = async (
    email: string,
    password: string
  ) => {
    const data =
      await loginUser(
        email,
        password
      );

    localStorage.setItem(
      "sumart-token",
      data.token
    );

    setToken(data.token);
    setUser(data.user);
  };

  // ========================================
  // REGISTER
  // ========================================

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> => {
    const data =
      await registerUser(
        name,
        email,
        password
      );

    /*
     * Registration no longer logs
     * the user in.
     *
     * No JWT is stored here.
     * The user must verify their
     * email first.
     */
    return data;
  };

  // ========================================
  // UPDATE CURRENT USER
  // ========================================

  const updateUser = (
    updatedUser: AuthUser
  ) => {
    setUser(updatedUser);
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {
    localStorage.removeItem(
      "sumart-token"
    );

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated:
          Boolean(user),
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
};