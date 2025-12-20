import type React from "react";
import { Button, Dropdown, Input, Select } from "antd";
import {
  MoreOutlined,
  AppstoreOutlined,
  StarFilled,
  StarOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { type Board, Role } from "../../../../types/board";
import FilterDropdown from "./FilterDropdown";

interface BoardHeaderProps {
  board: Board;
  boardTitle: string;
  isEditingTitle: boolean;
  isStarred: boolean;
  allBoards?: Board[];
  searchText: string;
  selectedColumns: string[];
  selectedTags: string[];
  currentUserRole: Role;
  onBoardTitleChange: (title: string) => void;
  onUpdateBoardTitle: () => void;
  onToggleTitleEdit: (editing: boolean) => void;
  onToggleStar: () => void;
  onSwitchBoard: (boardId: string) => void;
  onDeleteBoard: () => void;
  onSearchChange: (value: string) => void;
  onColumnToggle: (columnId: string) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
  onOpenShareModal: () => void;
  onOpenHistory: () => void;
}

const iconProps = {
  style: { color: "white", fontSize: 20 },
};

const iconBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  padding: 0,
};

const BoardHeader = ({
  board,
  boardTitle,
  isEditingTitle,
  isStarred,
  allBoards,
  searchText,
  selectedColumns,
  selectedTags,
  currentUserRole,
  onBoardTitleChange,
  onUpdateBoardTitle,
  onToggleTitleEdit,
  onToggleStar,
  onSwitchBoard,
  onDeleteBoard,
  onSearchChange,
  onColumnToggle,
  onTagToggle,
  onClearFilters,
  onOpenShareModal,
  onOpenHistory, // Added prop
}: BoardHeaderProps) => {
  const canDelete = currentUserRole === Role.OWNER;
  const menuItems = canDelete
    ? [
        {
          key: "delete",
          icon: <DeleteOutlined />,
          label: "Xóa bảng",
          danger: true,
          onClick: onDeleteBoard,
        },
      ]
    : [];

  return (
    <div className="shrink-0 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* trái */}
        <div className="flex items-center gap-3">
          {isEditingTitle ? (
            <Input
              value={boardTitle}
              onChange={(e) => onBoardTitleChange(e.target.value)}
              onPressEnter={onUpdateBoardTitle}
              onBlur={onUpdateBoardTitle}
              autoFocus
              style={{
                fontSize: "20px",
                lineHeight: "28px",
                fontWeight: 700,
                width: `${Math.max(boardTitle.length, 6)}ch`,
                minWidth: "6ch",
                maxWidth: "400px",
              }}
            />
          ) : (
            <h1
              className="text-xl leading-7 font-bold px-3 py-1 text-white cursor-pointer hover:bg-white/10 rounded max-w-100 truncate"
              onClick={() =>
                currentUserRole !== Role.VIEWER && onToggleTitleEdit(true)
              }
            >
              {board.title}
            </h1>
          )}
        </div>

        {/* Phải */}
        <div className="flex items-center gap-2">
          {/* Lọc*/}
          <FilterDropdown
            columns={board.columns}
            searchText={searchText}
            selectedColumns={selectedColumns}
            selectedTags={selectedTags}
            onSearchChange={onSearchChange}
            onColumnToggle={onColumnToggle}
            onTagToggle={onTagToggle}
            onClearFilters={onClearFilters}
            iconBtnStyle={iconBtnStyle}
            iconProps={iconProps}
          />

          <Button
            type="text"
            icon={<HistoryOutlined {...iconProps} />}
            style={iconBtnStyle}
            onClick={onOpenHistory}
          />

          {currentUserRole === Role.OWNER && (
            <Button
              type="text"
              icon={<ShareAltOutlined {...iconProps} />}
              style={iconBtnStyle}
              onClick={onOpenShareModal}
            />
          )}

          {/* ưu tiên */}
          <Button
            type="text"
            icon={
              isStarred ? (
                <StarFilled style={{ color: "gold", fontSize: 20 }} />
              ) : (
                <StarOutlined {...iconProps} />
              )
            }
            onClick={onToggleStar}
            style={iconBtnStyle}
          />

          {/* đổi bảng */}
          <Select
            value={board.id}
            onChange={onSwitchBoard}
            className="w-40 sm:w-48"
            popupMatchSelectWidth={false}
            suffixIcon={<AppstoreOutlined style={{ color: "white" }} />}
            style={{ height: 36 }}
          >
            {allBoards?.map((b) => (
              <Select.Option key={b.id} value={b.id}>
                {b.title}
              </Select.Option>
            ))}
          </Select>

          {/* Thêm lựa chọn */}
          {menuItems.length > 0 && (
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <Button
                type="text"
                icon={<MoreOutlined {...iconProps} />}
                style={iconBtnStyle}
              />
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardHeader;
