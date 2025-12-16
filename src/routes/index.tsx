import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ClientRoute from "./ClientRoute";
import AdminRoute from "./AdminRoute";
import NotFound from "../pages/NotFound";
import AuthRoute from "./AuthRoute";

const router = createBrowserRouter([
  ...AuthRoute,
  ...ClientRoute,
  ...AdminRoute,
  { path: "*", Component: NotFound },
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};
export default AppRoute;
