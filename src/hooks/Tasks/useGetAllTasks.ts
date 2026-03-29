import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "@/services/apiTask";


export const useGetAllTasks = ()=>{
    return useQuery({
        queryKey: ["tasks", "all"],
        queryFn: getAllTasks,
      
    })
}