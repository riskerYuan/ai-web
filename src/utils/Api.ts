import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { message as AntMessage } from "ant-design-vue";
import { jumpLogin } from "@/utils/jumpLogin";
import { authorizationTokenKey } from "@/utils/constants";

export const createAxiosByinterceptors = (
  config?: AxiosRequestConfig
): AxiosInstance => {
  const instance = axios.create({
    timeout: 100000, //超时配置
    withCredentials: true, //跨域携带cookie
    headers: {
      "Content-Type": "application/json", // 设置默认请求头
    },
    ...config, // 自定义配置覆盖基本配置
  });

  // 添加请求拦截器
  instance.interceptors.request.use(
    function (config: any) {
      // 在发送请求之前做些什么
      console.log("config:", config);
      config.headers["X-Trans-Token"] = localStorage.getItem(
        authorizationTokenKey
      );
      return config;
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );

  // 添加响应拦截器
  instance.interceptors.response.use(
    function (response) {
      // 对响应数据做点什么
      console.log("response:", response);
      const status = response.status;
      const { message } = response.data;
      if (status === 200) return response.data;
      else if (status === 401) {
        jumpLogin();
      } else {
        AntMessage.error(message);
        return Promise.reject(response.data);
      }
    },
    function (error) {
      // 对响应错误做点什么
      console.log("error-response:", error.response);
      console.log("error-config:", error.config);
      console.log("error-request:", error.request);
      if (error.response) {
        if (error.response.status === 401) {
          jumpLogin();
        }
      }
      AntMessage.error(error?.response?.data?.message || "服务端异常");
      return Promise.reject(error);
    }
  );
  return instance;
};

export default createAxiosByinterceptors();
