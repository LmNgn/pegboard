import { Navigate } from "react-router-dom";
import ClientLayout from "../components/layouts/ClientLayout";

import HomePage from "../pages/client/homepage/HomePage";
import BoardList from "../pages/client/boardList/BoardList";
import Board from "../pages/client/board/Board";
import BoardLayout from "../components/layouts/BoardLayout";

const ClientRoute = [
  {
    path: "",
    Component: ClientLayout,
    children: [
      { index: true, element: <Navigate to="/home" /> },
      { path: "home", Component: HomePage },
      { path: "boards", Component: BoardList },
    ],
  },
  {
    path: "",
    Component: BoardLayout,
    children: [{ path: "boards/:id", Component: Board }],
  },
];
export default ClientRoute;
