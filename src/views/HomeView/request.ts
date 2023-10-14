import request from "@/utils/Api";

export const createSession = (data: object) => {
  return request({
    method: "POST",
    url: "/v1/sessions",
    data: {
      name: "",
      ...data,
    },
  });
};

export const getSessions = () => {
  return request({
    method: "GET",
    url: "/v1/sessions",
    params: {
      limit: 100,
    },
  });
};

export const deleteSessions = (id: string | number) => {
  return request({
    method: "DELETE",
    url: `/v1/sessions/${id}`,
  });
};

type MessageType = {
  sessionId: string | number;
  id?: string | number;
};
export const getMessages = (params: MessageType) => {
  return request({
    method: "GET",
    url: "/v1/messages",
    params: {
      sessionId: params.sessionId,
      id: params.id,
      limit: 100,
      asc: true,
    },
  });
};

export const postMessages = (params: any) => {
  return request({
    method: "POST",
    url: "/v1/messages",
    data: {
      sessionId: params.sessionId,
      content: params.content,
    },
  });
};
