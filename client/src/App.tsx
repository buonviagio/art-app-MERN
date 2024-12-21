//import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/registration/RegisterPage";
import NavigationBar from "./components/NavigationBar";

/* const Root = () => {
  return (
    <>
      <MenuAppBar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route
        path="countries/:country"
        element={
          <ProtectedRoute>
            <CountryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRouteForProfilePage>
            <ProfilePage />
          </ProtectedRouteForProfilePage>
        }
      />

      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
); */

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          {<Route index element={<HomePage />} />}
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
