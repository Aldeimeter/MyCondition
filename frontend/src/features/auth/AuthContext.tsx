import React, { createContext, useState, useContext, useEffect } from "react";
import api, { setAuthToken, removeAuthToken } from "@/shared/api/axios";
import { User } from "@/entities/user";
import { AxiosError } from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    email: "",
    username: "",
    role: "user",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      api
        .get("/users/me")
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((e: unknown) => {
          if (e instanceof AxiosError) {
            const error = e as AxiosError;
            switch (error.status) {
              case 401:
                logout();
                break;

              default:
                console.error(error.cause);
                break;
            }
          } else {
            console.error(e);
          }
        });
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    removeAuthToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
