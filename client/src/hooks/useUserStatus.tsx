import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useUserStatus() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        //here we decode the token
        const decoded = jwtDecode(token);
        const nowTime = Date.now() / 1000;
        const expirationTime = decoded.exp;
        if (expirationTime !== undefined && expirationTime > nowTime) {
          setIsUserLoggedIn(true);
        }
      } catch (error) {
        console.log("Invalid token :>> ", error);
      }
    } else {
      setIsUserLoggedIn(false);
    }
  }, []);

  return isUserLoggedIn;
}
