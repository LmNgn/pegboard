import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Button, Input, List, message, Modal, Select, Tag } from "antd";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  boardMemberSchema,
  type BoardMemberFormData,
} from "../../../../schema/boardSchema";
import { Role, type BoardMember } from "../../../../types/board";
import type { User } from "../../../../types/user";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";
interface ShareBoardModalProps {
  visible: boolean;
  boardId: string;
  members: BoardMember[];
  currentUserRole: Role;
  onClose: () => void;
  onAddMember: (member: Omit<BoardMember, "id" | "addedAt">) => void;
  onUpdateMemberRole: (memberId: string, role: Role) => void;
  onRemoveMember: (memberId: string) => void;
  onSearchUsers: (email: string) => Promise<User[]>;
}

const getRoleLabel = (role: Role) => {
  switch (role) {
    case Role.OWNER:
      return "Chủ sở hữu";
    case Role.MEMBER:
      return "Thành viên";
    case Role.VIEWER:
      return "Người xem";
  }
};

const getRoleColor = (role: Role) => {
  switch (role) {
    case Role.OWNER:
      return "gold";
    case Role.MEMBER:
      return "blue";
    case Role.VIEWER:
      return "default";
  }
};

const ShareBoardModal = ({
  visible,
  members,
  currentUserRole,
  onClose,
  onAddMember,
  onUpdateMemberRole,
  onRemoveMember,
  onSearchUsers,
}: ShareBoardModalProps) => {
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user } = useSelector((state: RootState) => state.user);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BoardMemberFormData>({
    resolver: zodResolver(boardMemberSchema),
    defaultValues: {
      role: Role.MEMBER,
    },
  });
  const handleSearch = async (email: string) => {
    if (!email || email.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const users = await onSearchUsers(email);
      const filteredUsers = users.filter(
        (u) =>
          !members.some((member) => member.email === u.email) && // loại bỏ thành viên đã tồn tại
          u.email !== user?.email // loại bỏ chính người dùng hiện tại
      );
      setSearchResults(filteredUsers);
    } catch (error) {
      message.error("Lỗi khi tìm kiếm người dùng");
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchEmail(user.email);
    setSearchResults([]);
  };

  const onSubmit = (data: BoardMemberFormData) => {
    if (!selectedUser) {
      message.warning("Vui lòng chọn người dùng từ kết quả tìm kiếm");
      return;
    }

    onAddMember({
      email: selectedUser.email,
      name: selectedUser.username,
      role: data.role,
    });

    reset();
    setSelectedUser(null);
    setSearchEmail("");
    message.success("Đã thêm thành viên");
  };

  const handleRoleChange = (memberId: string, newRole: Role) => {
    onUpdateMemberRole(memberId, newRole);
    message.success("Đã cập nhật vai trò");
  };

  const handleRemove = (memberId: string) => {
    Modal.confirm({
      title: "Xóa thành viên?",
      content: "Bạn có chắc chắn muốn xóa thành viên này khỏi bảng?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        onRemoveMember(memberId);
        message.success("Đã xóa thành viên");
      },
    });
  };

  const canEdit = currentUserRole === Role.OWNER;

  return (
    <Modal
      title="Chia sẻ bảng"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnHidden
    >
      {/* thêm mem - chỉ Owner */}
      {canEdit && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">Thêm thành viên mới</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Input
                value={searchEmail}
                onChange={(e) => {
                  setSearchEmail(e.target.value);
                  handleSearch(e.target.value);
                  setSelectedUser(null);
                }}
              />

              {/* kết quả tìm kiếm */}
              {searchResults.length > 0 && (
                <div className="mt-2 border rounded-lg bg-white max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                      onClick={() => handleSelectUser(user)}
                    >
                      <Avatar size="small" icon={<UserOutlined />} />
                      <div>
                        <div className="text-sm font-medium">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Chọn vai trò"
                    className="w-full"
                  >
                    <Select.Option value={Role.MEMBER}>
                      Thành viên - Có thể chỉnh sửa
                    </Select.Option>
                    <Select.Option value={Role.VIEWER}>
                      Người xem - Chỉ xem
                    </Select.Option>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={!selectedUser}
            >
              Thêm thành viên
            </Button>
          </form>
        </div>
      )}

      {/* Danh sách mem */}
      <div>
        <h3 className="text-sm font-semibold mb-3">
          Thành viên ({members.length})
        </h3>
        <List
          dataSource={members}
          renderItem={(member) => (
            <List.Item
              actions={
                canEdit && member.role !== Role.OWNER
                  ? [
                      <Select
                        key="role"
                        value={member.role}
                        onChange={(value) => handleRoleChange(member.id, value)}
                        size="small"
                        className="w-32"
                      >
                        <Select.Option value={Role.MEMBER}>
                          Thành viên
                        </Select.Option>
                        <Select.Option value={Role.VIEWER}>
                          Người xem
                        </Select.Option>
                      </Select>,
                      <Button
                        key="delete"
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(member.id)}
                      />,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                  <div className="flex items-center gap-2">
                    <span>{member.name}</span>
                    <Tag color={getRoleColor(member.role)}>
                      {getRoleLabel(member.role)}
                    </Tag>
                  </div>
                }
                description={member.email}
              />
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default ShareBoardModal;
