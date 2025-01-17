import { createContext, ReactNode, useEffect, useState } from "react";
import { GetProfileOkResponse, User } from "../types/customType";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContextInitialValue = {
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(
  AuthContextInitialValue
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token) as any;
        const nowTime = Date.now() / 1000;

        if (decoded.exp > nowTime) {
          //setIsAuthenticated(true);
          const myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);

          const requestOptions = {
            method: "GET",
            headers: myHeaders,
          };

          fetch("http://localhost:5000/api/user/profile", requestOptions)
            .then((result) => {
              const res = result.json();
              console.log("object :>> ", res);
              return res;
            })
            .then((data) => {
              setUser(data.userProfile);
              setIsAuthenticated(true);
            });
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    //const decoded = jwtDecode(token) as any;
    setIsAuthenticated(true);
    //setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
