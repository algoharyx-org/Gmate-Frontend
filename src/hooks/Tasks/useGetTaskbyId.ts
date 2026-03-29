import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/services/apiTask";



export const useGetTaskById = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });
};