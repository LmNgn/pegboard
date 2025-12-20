import { useState } from "react";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface AddColumnButtonProps {
  onAddColumn: (title: string) => void;
}

const AddColumnButton = ({ onAddColumn }: AddColumnButtonProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleAdd = () => {
    if (newColumnTitle.trim()) {
      onAddColumn(newColumnTitle);
      setNewColumnTitle("");
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewColumnTitle("");
  };

  if (isAdding) {
    return (
      <div className="shrink-0 w-72">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow">
          <Input
            placeholder="Nhập tên cột..."
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onPressEnter={handleAdd}
            autoFocus
            className="mb-2"
          />
          <div className="flex gap-2 mt-2">
            <Button type="primary" size="small" onClick={handleAdd}>
              Thêm bảng
            </Button>
            <Button size="small" onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 w-72">
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => setIsAdding(true)}
        className="h-fit bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 w-full"
        size="large"
      >
        Thêm bảng
      </Button>
    </div>
  );
};

export default AddColumnButton;
