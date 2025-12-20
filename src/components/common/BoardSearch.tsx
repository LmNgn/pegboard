import { AutoComplete, Input } from "antd";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../hooks/useBoard";
import { searchBoards } from "../../api/board";
import type { Board } from "../../types/board";

const BoardSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const debounced = useSearch(keyword);
  const nav = useNavigate();

  useEffect(() => {
    // reset nếu không có từ khóa
    if (!debounced.trim()) {
      setOptions([]);
      return;
    }

    searchBoards(debounced).then((boards: Board[]) => {
      if (boards.length === 0) {
        setOptions([
          {
            value: "__empty__",
            label: (
              <div className="px-3 py-2 text-sm text-gray-500">
                Không tìm thấy bảng
              </div>
            ),
            disabled: true,
          },
        ]);
        return;
      }
      setOptions(
        boards.map((board) => ({
          value: board.id.toString(),
          label: (
            <div className="flex flex-col items-start text-black">
              <span className="block truncate font-medium">{board.title}</span>
            </div>
          ),
          id: board.id,
        }))
      );
    });
  }, [debounced]);

  return (
    <AutoComplete
      options={options}
      value={keyword}
      onChange={setKeyword}
      onSelect={(_, option) => {
        nav(`/boards/${option.id}`);
        setKeyword("");
      }}
      className="hidden md:block w-full max-w-md"
    >
      <Input
        prefix={<Search className="w-4 h-4 text-gray-500" />}
        placeholder="Tìm kiếm bảng..."
        className="bg-white text-black placeholder:text-gray-500"
      />
    </AutoComplete>
  );
};

export default BoardSearch;
