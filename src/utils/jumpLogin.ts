import { vm } from "@/main";
import { authorizationTokenKey } from "@/utils/constants";

export const jumpLogin = () => {
  localStorage.removeItem(authorizationTokenKey);
  vm.$router.push(`/login?redirect=${encodeURIComponent(vm.$route.fullPath)}`);
};
