//import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, Route, Routes } from "react-router";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/registration/RegisterPage";
import NavigationBar from "./components/NavigationBar";
import CardsContainer from "./pages/cardsContainer/CardsContainer";
import ProtectedRouteForProfilePage from "./protectedRoutes/ProtectedRouteForProfilePage";
import ProfilePage from "./pages/profile/ProfilePage";
import AddingArtObject from "./pages/newArtObject/AddingArtObject";
import DetailsPage from "./pages/detailsPage/DetailsPage";
import UpdatingArtObject from "./components/updatingArtObject/UpdatingArtObject";

/* RENSER PROPS PATTERN */
const Root = () => {
  return (
    <>
      <NavigationBar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<HomePage />} />
        <Route path="cardscontainer" element={<CardsContainer />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="addart" element={<AddingArtObject />} />
        <Route path="updateart" element={<UpdatingArtObject />} />
        <Route path="art/:artditail" element={<DetailsPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRouteForProfilePage>
              <ProfilePage />
            </ProtectedRouteForProfilePage>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
