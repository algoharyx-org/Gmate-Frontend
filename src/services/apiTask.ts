import api from "@/api/axios";
import cookie from "react-cookies";

const getToken = () => cookie.load("accessToken");

export const createTask = async (data: {
  title: string;
  description: string;
  project?: string; // <-- now optional
  status?: string;
  priority?: string;
  dueDate?: Date;
}) => {
  const token = getToken();
  const response = await api.post("/tasks", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export type GetMyTasksParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  projectId?: string;
  sort?: string;
};

export type GetMyTasksResult = {
  tasks: unknown[];
  length: number;
  metadata: {
    currentPage: number;
    limit: number;
    totalPages: number;
    next?: number;
    prev?: number;
  };
};

function omitEmptyParams(
  params: GetMyTasksParams | undefined
): Record<string, string | number> | undefined {
  if (!params) return undefined;
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

export const getMyTasks = async (
  params?: GetMyTasksParams
): Promise<GetMyTasksResult> => {
  const token = getToken();
  const response = await api.get(`/tasks/me`, {
    headers: { Authorization: `Bearer ${token}` },
    params: omitEmptyParams(params),
  });

  const raw = response.data?.data;

  if (Array.isArray(raw)) {
    const list = raw;
    return {
      tasks: list,
      length: list.length,
      metadata: {
        currentPage: 1,
        limit: list.length || 1,
        totalPages: 1,
      },
    };
  }

  const tasks = Array.isArray(raw?.tasks) ? raw.tasks : [];
  const length = typeof raw?.length === "number" ? raw.length : tasks.length;
  const meta = raw?.metadata;

  return {
    tasks,
    length,
    metadata: {
      currentPage: meta?.currentPage ?? 1,
      limit: meta?.limit ?? (tasks.length || 1),
      totalPages: meta?.totalPages ?? 1,
      next: meta?.next,
      prev: meta?.prev,
    },
  };
};


//getAllTasks
export const getAllTasks = async () =>{
  
    const token = getToken();
    
    const response = await api.get(`/tasks` ,{
        headers: {Authorization:`Bearer ${token}`},
    });

    return response.data;
}



//getTaskById
export const getTaskById = async(id: string)=>{
    const token = getToken();

    const response = await api.get(`/tasks/${id}`,{
        headers: {Authorization:`Bearer ${token}`},
    });

    return response.data;
}


//updateTask

export const updateTask = async (id: string, data: any) => {
  const token = getToken();
  const response = await api.put(`/tasks/${id}`, data, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// //  upload Task
// export const uploadTask = async (id: string, userId: string) => {
//   const token = getToken();
//   const response = await api.post(
//     `/tasks/${id}/attachments`,
//     { userId },
//     {
//       headers: {Authorization: `Bearer ${token}`},
//     }
//   );
//   return response.data;
// };

//upload file
export const uploadTaskAttachments = async (
  taskId: string,
  files: File[]
) => {
  const token = getToken();

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("attachments", file);
  });

  const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};




//  Delete Task
export const deleteTask = async (id: string) => {
  const token = getToken();
  const response = await api.delete(`/tasks/${id}`, {
    headers: {Authorization: `Bearer ${token}`},
  });

  return response.data;
};














// createTask // 7 apis
// export const createTask = async (data: { Title: string; Description: string; Tag:string; Duedate:Date }) => {
//   const token = getToken();
//   const response = await api.post("/tasks", data, {
//     headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//   });
//   return response.data;
// };