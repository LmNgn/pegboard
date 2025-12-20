import type React from "react";

import { useState } from "react";
import { Dropdown, Input, Checkbox, Button, Tag } from "antd";
import { ControlOutlined } from "@ant-design/icons";
import type { Column } from "../../../../types/column";
import type { Card } from "../../../../types/column";

interface FilterDropdownProps {
  columns: Column[];
  searchText: string;
  selectedColumns: string[];
  selectedTags: string[];
  onSearchChange: (value: string) => void;
  onColumnToggle: (columnId: string) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
  iconBtnStyle: React.CSSProperties;
  iconProps: { style: { color: string; fontSize: number } };
}

const FilterDropdown = ({
  columns,
  searchText,
  selectedColumns,
  selectedTags,
  onSearchChange,
  onColumnToggle,
  onTagToggle,
  onClearFilters,
  iconBtnStyle,
  iconProps,
}: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);

  const allTags = Array.from(
    new Set(
      columns.flatMap((col) =>
        col.cards.flatMap((card: Card) => card.tags || [])
      )
    )
  );

  const hasActiveFilters =
    searchText.trim() !== "" ||
    selectedColumns.length > 0 ||
    selectedTags.length > 0;

  const dropdownContent = (
    <div
      className="bg-white rounded-lg shadow-lg p-4 w-80"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Tìm kiếm */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tìm kiếm
        </label>
        <Input
          placeholder="Tìm kiếm cột hoặc thẻ..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
        />
      </div>

      {allTags.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lọc theo nhãn
          </label>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {allTags.map((tag) => (
              <div key={tag} className="flex items-center">
                <Checkbox
                  checked={selectedTags.includes(tag)}
                  onChange={() => onTagToggle(tag)}
                >
                  <Tag color="blue">{tag}</Tag>
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lọc theo cột */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lọc theo cột
        </label>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {columns.map((column) => (
            <div key={column.id} className="flex items-center">
              <Checkbox
                checked={selectedColumns.includes(column.id)}
                onChange={() => onColumnToggle(column.id)}
              >
                {column.title} ({column.cards.length})
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      {/* Nút xóa filter */}
      {hasActiveFilters && (
        <Button
          type="link"
          onClick={() => {
            onClearFilters();
            setOpen(false);
          }}
          className="w-full"
        >
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      popupRender={() => dropdownContent}
      trigger={["click"]}
    >
      <Button
        type="text"
        icon={<ControlOutlined {...iconProps} />}
        style={{
          ...iconBtnStyle,
          backgroundColor: hasActiveFilters
            ? "rgba(255, 255, 255, 0.2)"
            : undefined,
        }}
      />
    </Dropdown>
  );
};

export default FilterDropdown;
