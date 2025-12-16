import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Board } from "../types/board";

const API_URL = "http://localhost:3000";

export const useBoardData = (boardId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: board, isLoading } = useQuery<Board>({
    queryKey: ["board", boardId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/boards/${boardId}`);
      return data;
    },
    enabled: !!boardId,
  });

  const updateCardPosition = useMutation({
    mutationFn: async ({
      cardId,
      newColumnId,
      newPosition,
    }: {
      cardId: string;
      newColumnId: string;
      newPosition: number;
    }) => {
      await axios.patch(`${API_URL}/cards/${cardId}`, {
        columnId: newColumnId,
        position: newPosition,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });

  const updateColumnPositions = useMutation({
    mutationFn: async (columns: { id: string; position: number }[]) => {
      await Promise.all(
        columns.map((col) =>
          axios.patch(`${API_URL}/columns/${col.id}`, {
            position: col.position,
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });

  return {
    board,
    isLoading,
    updateCardPosition,
    updateColumnPositions,
  };
};
