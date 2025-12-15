import { Menu, type MenuProps } from "antd";

const HeaderContent = () => {
  const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
    key,
    label: `nav ${key}`,
  }));
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={["2"]}
      items={items1}
      style={{ flex: 1, minWidth: 0 }}
    />
  );
};

export default HeaderContent;
