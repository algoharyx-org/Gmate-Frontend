import { useQuery } from "@tanstack/react-query";
import {
  getMyTasks,
  type GetMyTasksParams,
  type GetMyTasksResult,
} from "@/services/apiTask";

export const useGetMyTasks = (params: GetMyTasksParams) => {
  return useQuery({
    queryKey: [
      "tasks",
      "me",
      params.page,
      params.limit,
      params.search ?? "",
      params.status ?? "",
      params.priority ?? "",
      params.projectId ?? "",
    ],
    queryFn: () => getMyTasks(params),
    placeholderData: (previousData: GetMyTasksResult | undefined) => previousData,
  });
};
