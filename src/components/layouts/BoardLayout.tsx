import { Header } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";

const BoardLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default BoardLayout;
