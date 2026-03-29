import api from "@/api/axios";
import cookie from "react-cookies";

const getToken = () => cookie.load("accessToken");

export const addComment = async (data: {
    content: string;
    taskId: string;
}) => {
  const token = getToken();
  const response = await api.post("/comment", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



export const updateComment = async (id: string, data: {
    content: string;
}) => {
  const token = getToken();
  const response = await api.put(`/comment/${id}`, data, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};




export const deleteComment = async (id: string) => {
  const token = getToken();
  const response = await api.delete(`/comment/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
