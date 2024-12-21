import { NavLink } from "react-router";
import "./NavigationBar.css";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function NavigationBar() {
  return (
    <nav className="navigation-bar-container">
      <ul className="navigation-bar-table">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/register">Sign In/Up</NavLink>
        </li>
        <li>
          <a href="#">Profile</a>
        </li>
      </ul>
      <div className="profile-icon">
        <AccountCircle fontSize="large" sx={{ color: "#66ccff" }} />
      </div>
    </nav>
  );
}
