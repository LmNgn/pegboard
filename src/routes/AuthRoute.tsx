import ClientLayout from "../components/layouts/ClientLayout";
import Login from "../pages/client/auth/Login";
import Register from "../pages/client/auth/Register";
import ForgotPassword from "../pages/client/forgotPassword/ForgotPassword";
import ResetPassword from "../pages/client/resetPassword/ResetPassword";

const AuthRoute = [
  {
    path: "",
    Component: ClientLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },
    ],
  },
];
export default AuthRoute;
