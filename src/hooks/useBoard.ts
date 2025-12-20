import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  deleteBoardApi,
  getBoard,
  getBoardsApi,
  updateBoardApi,
} from "../api/board";
import type { Board } from "../types/board";

export function useSearch<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
export const useBoards = () => {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const data = await getBoardsApi();
      return data;
    },
  });
};
export const useBoard = (id: string | undefined) => {
  return useQuery({
    queryKey: ["board", id],
    queryFn: async () => {
      if (!id) throw new Error("Board ID is required");
      const data = await getBoard(id);
      return data;
    },
    enabled: !!id,
  });
};
export const useBoardMutations = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const updateBoard = useMutation({
    mutationFn: async (newBoard: Board) => {
      if (!id) throw new Error("Board ID is required");
      await updateBoardApi(id, newBoard);
      return newBoard;
    },
    onMutate: async (newBoard) => {
      await queryClient.cancelQueries({ queryKey: ["board", id] });

      const previousBoard = queryClient.getQueryData(["board", id]);

      queryClient.setQueryData(["board", id], newBoard);

      return { previousBoard };
    },
    onError: (err, newBoard, context) => {
      console.log(newBoard);
      if (context?.previousBoard) {
        queryClient.setQueryData(["board", id], context.previousBoard);
      }
      console.error("Update board error:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["board", id] });
    },
  });

  const deleteBoard = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Board ID is required");
      await deleteBoardApi(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (err) => {
      console.error("Delete board error:", err);
    },
  });

  return { updateBoard, deleteBoard };
};
