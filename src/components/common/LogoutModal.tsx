import React from "react";
import { Modal } from "antd";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      title="Xác nhận"
      open={open}
      onOk={onConfirm}
      onCancel={onClose}
      okText="Đăng xuất"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>
    </Modal>
  );
};

export default LogoutModal;
