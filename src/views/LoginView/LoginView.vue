<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#6d75ff',
      },
    }"
  >
    <div class="container">
      <div class="leftPanel">
        <div class="logo">
          <img src="../../assets/images/logo.png" class="logoImg" />
          <span>精准翻译</span>
        </div>
        <div class="description">
          精准翻译-塑造超前的人工AI智能系统，目标是成为一个有帮助、无害和诚实的人工智能助手。
        </div>
      </div>
      <div class="rightWrapper">
        <div class="loginPanel">
          <div class="title">AI以自动为您生成专属账号</div>
          <div>
            <div class="label">用户名*</div>
            <a-input
              class="buttomLine"
              v-model:value.trim="formState.username"
              autofocus
              placeholder="请输入用户名"
            />
          </div>
          <div style="margin-top: 40px">
            <div class="label">密码*</div>
            <a-input-password
              v-model:value.trim="formState.password"
              placeholder="请输入密码"
            />
          </div>
          <div style="margin-top: 40px; display: flex; justify-content: center">
            <a-button
              style="width: 280px; margin: auto"
              type="primary"
              @click="handleSubmit"
              >登录
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import request from "@/utils/Api";
import { useRouter } from "vue-router";

const router = useRouter();

import { reactive } from "vue";
import { message } from "ant-design-vue";
import { authorizationTokenKey } from "@/utils/constants";

const formState = reactive({
  username: "",
  password: "",
});
const handleSubmit = () => {
  const { username, password } = formState;
  if (!username || !password) {
    return;
  }
  request({
    url: "/v1/users/login",
    method: "post",
    data: JSON.stringify({
      username,
      password,
    }),
  }).then(
    (res: any) => {
      if (res.token || res.user_id) {
        message.success("登录成功");
        localStorage.setItem(authorizationTokenKey, res.token);
        router.push({ name: "home" });
      }
    },
    (error) => {
      console.log(error);
    }
  );
};
</script>

<style lang="scss" scoped>
.container {
  :deep(.ant-input) {
    &:hover,
    &:focus {
      border: none;
      color: #fff;
      box-shadow: 0 0 0 2px transparent;
      background: transparent;
      border-radius: 0;
    }

    &:-internal-autofill-previewed,
    &:-internal-autofill-selected {
      -webkit-text-fill-color: #ffffff;
      transition: background-color 5000s ease-out 0.5s;
    }

    border: none;
    color: #fff;
    box-shadow: 0 0 0 2px transparent;
    background: transparent;
    border-radius: 0;

    &.buttomLine {
      border-bottom: 1px solid #999;
    }
  }

  :deep(.ant-input-affix-wrapper) {
    &:hover,
    &:focus {
      border: none;
      color: #fff;
      box-shadow: 0 0 0 2px transparent;
      background: transparent;
      border-radius: 0;
      border-bottom: 1px solid #999;
    }

    border: none;
    color: #fff;
    box-shadow: 0 0 0 2px transparent;
    background: transparent;
    border-radius: 0;
    border-bottom: 1px solid #999;
  }

  width: 100%;
  height: 100vh;
  background: url("~@/assets/images/loginBg.png") no-repeat;
  background-size: cover;
  overflow: hidden;
  display: flex;

  .leftPanel {
    margin-left: 120px;
    margin-top: 200px;

    .logo {
      display: flex;
      flex-direction: row;
      align-items: center;

      img {
        width: 64px;
        height: 44px;
        flex-shrink: 0;
      }

      span {
        margin-left: 8px;
        color: var(--4, #000);
        font-size: 44px;
        font-style: normal;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
    }

    .description {
      margin-top: 86px;
      max-width: 897px;
      min-width: 400px;
      color: var(--2, #000);
      font-size: 36px;
      font-style: normal;
      font-weight: 493;
      letter-spacing: 4px;
    }
  }

  .rightWrapper {
    min-width: 532px;
    .title {
      color: #fff;
      text-align: center;
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: 17px; /* 70.833% */
      text-transform: capitalize;
      margin-bottom: 88px;
    }
  }

  .loginPanel {
    min-height: 300px;
    margin-top: 180px;
    margin-left: 120px;
    padding-top: 54px;
    padding-bottom: 54px;
    flex-shrink: 0;
    border-radius: 10px;
    border: 1px solid #6d75ff;
    background: rgba(68, 70, 83, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;

    & > div {
      width: 80%;
    }

    .label {
      color: #fff;
      font-size: 20px;
      font-style: normal;
      font-weight: 493;
      margin-bottom: 12px;
    }
  }
}
</style>
