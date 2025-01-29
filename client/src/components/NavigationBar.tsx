import { NavLink } from "react-router";
import "./NavigationBar.css";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function NavigationBar() {
  const { logout, isAuthenticated, user } = useContext(AuthContext);

  const handleSignOut = () => {
    logout();
  };

  return (
    <nav className="navigation-bar-container">
      <ul className="navigation-bar-table">
        <li>
          <NavLink
            to="/cardscontainer"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Gallery
          </NavLink>
        </li>

        {!isAuthenticated && (
          <li>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Sign In/Up
            </NavLink>
          </li>
        )}
        {isAuthenticated && (
          <>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/" onClick={handleSignOut}>
                Sign Out
              </NavLink>
            </li>
          </>
        )}
      </ul>
      {isAuthenticated && (
        <div className="profile-icon">
          {user?.avatar?.secure_url ? (
            <img
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
              }}
              src={user.avatar.secure_url}
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <AccountCircle fontSize="large" sx={{ color: "#66ccff" }} />
          )}
        </div>
      )}
    </nav>
  );
}
