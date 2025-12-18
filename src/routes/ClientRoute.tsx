import { Navigate } from "react-router-dom";
import ClientLayout from "../components/layouts/ClientLayout";

import HomePage from "../pages/client/homepage/HomePage";
import BoardList from "../pages/client/boardList/BoardList";
import Board from "../pages/client/board/Board";
import BoardLayout from "../components/layouts/BoardLayout";
import PrivateRoute from "./privateRoute/PrivateRoute";

const ClientRoute = [
  {
    path: "",
    element: (
      <PrivateRoute>
        <ClientLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/home" /> },
      { path: "home", element: <HomePage /> },
      { path: "boards", element: <BoardList /> },
    ],
  },
  {
    path: "",
    element: (
      <PrivateRoute>
        <BoardLayout />
      </PrivateRoute>
    ),
    children: [{ path: "boards/:id", element: <Board /> }],
  },
];

export default ClientRoute;
