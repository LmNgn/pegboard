import { Navigate } from "react-router-dom";
import ClientLayout from "../components/layouts/ClientLayout";

import HomePage from "../pages/client/homepage/HomePage";

const ClientRoute = [
  {
    path: "",
    Component: ClientLayout,
    children: [
      { index: true, element: <Navigate to="home" /> },
      { path: "home", Component: HomePage },
    ],
  },
];
export default ClientRoute;
