import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router";

export default function ProtectedRouteForProfilePage({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated ? (
        children
      ) : (
        <Navigate to={"/"} state={{ prevPath: location.pathname }} />
      )}
    </>
  );
}
