import { createContext, ReactNode, useEffect, useState } from "react";
import { ExistingUserInDB } from "../types/customType";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

type AuthContextType = {
  isAuthenticated: boolean;
  user: ExistingUserInDB;
  loading: boolean;
  setUser: (
    user: ExistingUserInDB | ((prevUser: ExistingUserInDB) => ExistingUserInDB)
  ) => void;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContextInitialValue = {
  isAuthenticated: false,
  user: {
    userName: "Guest",
    email: "",
    userId: "",
  },
  loading: true,
  login: () => {},
  logout: () => {},
  setUser: () => {},
};

export const AuthContext = createContext<AuthContextType>(
  AuthContextInitialValue
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  /* const [user, setUser] = useState<ExistingUserInDB>({
    userName: "Guest",
    email: "",
    userId: "",
  }); */
  const [user, setUser] = useState<ExistingUserInDB>(
    AuthContextInitialValue.user
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    console.log("1!");
    await fetchProfileData();
    navigate("/profile");
    setLoading(false);
    console.log("4!");
  };

  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");
    console.log("2!");
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

          const result = await fetch(
            "http://localhost:5000/api/user/profile",
            requestOptions
          );
          console.log("3!");
          const data = await result.json();

          setUser(data.userProfile);
          setIsAuthenticated(true);
          setLoading(false);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser({
      userName: "Guest",
      email: "",
      userId: "",
    });
    setLoading(true);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
