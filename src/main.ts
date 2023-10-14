import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/reset.css";

export const vm = createApp(App).use(Antd).use(store).use(router).mount("#app");
