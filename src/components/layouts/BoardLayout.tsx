import { Outlet } from "react-router-dom";
import TrenoHeader from "../common/Header";

const BoardLayout = () => {
  return (
    <div>
      <TrenoHeader />
      <Outlet />
    </div>
  );
};

export default BoardLayout;
