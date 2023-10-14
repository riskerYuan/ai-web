<template>
  <a-layout class="homeView" style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" width="280" class="homeSider">
      <div class="logo">
        <img src="../../assets/images/logo.png" class="logoImg" />
        <span>精准翻译</span>
      </div>
      <a-config-provider
        :theme="{
          token: {
            colorPrimary: '#6d75ff',
            colorBgBase: '#6d75ff',
            colorBgContainer: '#6d75ff',
            colorText: '#FFF',
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.03)',
            colorBorder: '#FFF',
          },
        }"
      >
        <div class="menuWrapper">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="dark"
            mode="inline"
          >
            <div class="plusButton" @click="showModal">
              <PlusOutlined :style="{ fontSize: '16px', color: '#EEEEEE' }" />
            </div>

            <a-menu-item
              class="menuListItem"
              v-for="ssItem in menuList"
              :key="ssItem.id"
            >
              <div style="display: flex; align-items: center">
                <div class="menuText">会话 {{ ssItem.id }}</div>
                <a-popconfirm
                  placement="right"
                  cancel-text="否"
                  okText="是"
                  okType="default"
                  @cancel="handlePopCancel(ssItem.id)"
                  @confirm="handlePopConfirm(ssItem.id)"
                >
                  <template #icon></template>
                  <template #title> 是否删除当前会话？</template>
                  <DeleteOutlined class="delIcon" />
                </a-popconfirm>
              </div>
            </a-menu-item>
          </a-menu>
        </div>
      </a-config-provider>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <div class="contentContainer">
          <main ref="contRef">
            <MessageCard
              message="请告诉我你想了解的事情"
              type="TYPE_ASSISTANT"
            />
            <MessageCard
              :message="msItem.content"
              :type="msItem.type"
              v-for="msItem in messageList"
              :key="msItem.id"
              :is-loading="msItem.isLoading"
            />
          </main>
          <UserInput
            :update-list="updateMessageList"
            :update-menu-list="updateMenuList"
            :session-id="selectedKeys[0]"
            :formList="formList"
            :ai-detail="aiDetail"
            :autoOpenModal="openModal"
          />
        </div>
      </a-layout-content>
    </a-layout>

    <div class="modalWrapper" ref="modalWrapper">
      <a-config-provider
        :theme="{
          token: {
            colorPrimary: '#6d75ff',
            colorBgBase: 'rgba(68, 70, 83, 0.8)',
            colorBgContainer: 'transparent',
            controlItemBgActive: '#999',
            colorText: '#FFF',
            lineWidth: 0,
          },
        }"
      >
        <a-modal
          :width="532"
          v-model:open="open"
          :footer="null"
          :closable="false"
          :getContainer="() => $refs.modalWrapper"
        >
          <div class="userTitle">设定AI翻译角色信息</div>

          <div class="formBody">
            <div
              class="formItem"
              style="width: 100%"
              v-for="item in formList"
              :key="item.key"
            >
              <div class="label" style="white-space: nowrap">
                {{ item.label }}:
              </div>
              <div class="formContent" style="width: 100%; margin-left: 8px">
                <a-select
                  ref="select"
                  v-model:value="state[item.key]"
                  style="width: 100%"
                >
                  <a-select-option
                    :value="opts"
                    v-for="opts in item.options"
                    :key="opts"
                    >{{ opts }}</a-select-option
                  >
                </a-select>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: center; margin-top: 80px">
            <a-button
              type="primary"
              shape="round"
              size="large"
              style="width: 350px"
              @click="handleModalConfirm"
            >
              确认
            </a-button>
          </div>
        </a-modal>
      </a-config-provider>
    </div>
  </a-layout>
</template>
<script lang="ts" setup>
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import MessageCard from "@/views/HomeView/modules/MessageCard.vue";
import { ref, reactive, onMounted, watch, nextTick, markRaw } from "vue";
import UserInput from "@/views/HomeView/modules/UserInput.vue";
import {
  createSession,
  deleteSessions,
  getMessages,
  getSessions,
} from "@/views/HomeView/request";

const collapsed = ref<boolean>(false);
const selectedKeys = ref<(number | string)[]>([]);
const contRef = ref(null);

const open = ref<boolean>(false);
const isRquesting = ref<boolean>(false);
const formList = [
  {
    key: "age",
    label: "年龄",
    options: ["20-30", "30-40", "40-50", "50-60"],
  },
  {
    key: "gender",
    label: "性别",
    options: ["男", "女"],
  },
  {
    key: "education",
    label: "学历",
    options: ["高中", "大学", "硕士", "博士"],
  },

  {
    key: "relationship",
    label: "关系",
    options: ["朋友", "陌生人"],
  },
  {
    key: "tone",
    label: "语气状态",
    options: ["专业", "轻松"],
  },
  {
    key: "language",
    label: "目标语言",
    options: [
      "英语",
      "日语",
      "韩语",
      "法语",
      "西班牙语",
      "德语",
      "俄语",
      "葡萄牙语",
      "阿拉伯语",
    ],
  },
];
const initData = () => ({
  age: "20-30",
  education: "大学",
  gender: "男",
  relationship: "朋友",
  tone: "专业",
  language: "韩语",
});
const state = reactive(initData());
const aiDetail = ref(initData());
const menuList = ref([]);
const messageList = ref([]);

const showModal = () => {
  open.value = true;
};

const handleModalConfirm = async () => {
  if (isRquesting.value) return;
  const values = Object.values(state);
  console.log(values);
  const isFilledAll = values.every(
    (value) => value !== null && value !== undefined && value !== ""
  );
  if (isFilledAll) {
    try {
      isRquesting.value = true;
      const createSessionData: any = await createSession(state);
      selectedKeys.value = [createSessionData.id];
      if (createSessionData.id) {
        const sessionsData = await getSessions();
        menuList.value = sessionsData.sessions;
        Object.assign(state, initData());
        open.value = false;
        isRquesting.value = false;
      }
    } catch (error) {
      console.log(error);
      isRquesting.value = false;
    }
  }
};

const handlePopCancel = (e) => {
  console.log(e);
};
const openModal = () => {
  open.value = true;
};
/**/
const updateMenuList = async () => {
  try {
    const sessionsData = await getSessions();
    menuList.value = sessionsData.sessions;
    messageList.value = [];
    selectedKeys.value = [];
  } catch (error) {
    console.log(error);
  }
};
const handlePopConfirm = async (id: string | number) => {
  try {
    const deleteData = await deleteSessions(id);
    if (deleteData) {
      await updateMenuList();
    }
  } catch (error) {
    console.log(error);
  }
};

const updateMessageList = async (list: any) => {
  if (list.length === 1) {
    messageList.value = messageList.value.map((item) =>
      item.createTime === list[0].createTime ? list[0] : item
    );
    return;
  }
  messageList.value = [...messageList.value, ...list];
  nextTick(() => {
    contRef.value.scrollTop = contRef.value.scrollHeight;
  });
  console.log(messageList.value);
};

onMounted(async () => {
  try {
    const { sessions } = await getSessions();
    menuList.value = sessions;
    const id = sessions[0]?.id;
    selectedKeys.value = [id ? id : null];
  } catch (error) {
    console.log(error);
  }
});

watch(
  () => selectedKeys.value[0],
  async (newValue, oldValue) => {
    if (
      newValue != oldValue &&
      newValue != null &&
      newValue != "" &&
      newValue != undefined
    ) {
      const messagesData = await getMessages({
        sessionId: selectedKeys.value[0],
      });
      console.log(messagesData);
      const currentSession = menuList.value.find(
        (item) => item.id == selectedKeys.value[0]
      );
      aiDetail.value = currentSession ? currentSession.option : initData();
      messageList.value = messagesData.messages;
      nextTick(() => {
        contRef.value.scrollTop = contRef.value.scrollHeight;
      });
    }
  }
);
</script>

<style lang="scss" scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}

.homeView {
  :deep(.ant-layout) {
    background: #fff;
  }

  :deep(.ant-menu-item) {
    margin: 0 auto;
    margin-top: 20px;
    width: 240px;
    height: 40px;
    background: #444653;

    &:not(.ant-menu-item-selected):hover {
      background: #6d75ff;
    }
  }

  :deep(.ant-menu-item-selected) {
    background-color: #6d75ff;
  }

  :deep(.ant-modal .ant-modal-content) {
    border-radius: 10px;
    border: 1px solid #6d75ff;
    background: rgba(68, 70, 83, 0.8);
    backdrop-filter: blur(10px);
    color: #fff;
    padding: 50px;
  }
}

.homeSider {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.menuWrapper {
  margin-top: 24px;
  height: calc(100vh - 150px);
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.userTitle {
  color: var(--, #fff);
  text-align: center;
  font-feature-settings: "clig" off, "liga" off;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 17px; /* 70.833% */
  text-transform: capitalize;
}

.formBody {
  margin-top: 60px;

  .formItem {
    margin-top: 30px;

    span {
      white-space: nowrap;
      color: #fff;
      font-size: 20px;
      font-style: normal;
      font-weight: 493;
    }

    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid rgba(153, 153, 153, 0.3);

    :deep(.ant-input-affix-wrapper) {
      background: transparent;
      border: none;
      border-radius: 0;

      &:hover,
      &:focus {
        box-shadow: 0 0 0 1px #6d75ff;
      }
    }

    :deep(.ant-input-affix-wrapper-focused) {
      box-shadow: 0 0 0 1px #6d75ff;
    }

    :deep(input) {
      color: #fff;
      background: transparent;
    }
  }
}

.plusButton {
  width: 240px;
  height: 40px;
  margin: 0 auto;
  border-radius: 10px;
  background: #444653;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logo {
  margin-top: 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 60px;
    height: 40px;
    flex-shrink: 0;
  }

  span {
    margin-top: 8px;
    color: var(--4, #eee);
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
}

.menuText {
  width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delIcon {
  font-size: 16px;
  color: #999999;
  margin-left: 30px;
  cursor: pointer;

  &:hover {
    color: #ffffff;
  }
}

.contentContainer {
  $h: 130px;
  margin-left: 280px;

  main {
    padding-top: 60px;
    height: calc(100vh - $h);
    overflow: auto;
    padding-bottom: 60px;

    &::-webkit-scrollbar {
      width: 4px;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
    }
  }
}
</style>
