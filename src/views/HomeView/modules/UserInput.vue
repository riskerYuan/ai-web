<template>
  <div class="footerBox">
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
      <div class="operateBox">
        <a-popover placement="topLeft">
          <template #content>
            <div style="width: 360px; padding-bottom: 24px">
              <div
                class="aiInfoPanel"
                v-for="(twoOptions, index) in groupList"
                :key="index"
              >
                <div v-for="(item, idx) in twoOptions" :key="idx">
                  <span>{{ item.label }}：</span>
                  <span>{{ aiDetail[item.key] }}</span>
                </div>
              </div>
            </div>
          </template>
          <template #title>
            <div
              style="
                text-align: center;
                font-size: 16px;
                font-style: normal;
                font-weight: 493;
                line-height: normal;
                text-transform: uppercase;
              "
            >
              设定AI角色信息
            </div>
          </template>
          <SettingOutlined
            style="font-size: 24px; color: #999999; cursor: pointer"
          />
        </a-popover>

        <a-popconfirm
          placement="topLeft"
          cancel-text="否"
          okText="是"
          okType="default"
          @confirm="handlePopConfirm"
        >
          <template #icon></template>
          <template #title> 是否删除当前会话？</template>
          <DeleteOutlined
            style="
              font-size: 24px;
              color: #999999;
              margin-left: 30px;
              cursor: pointer;
            "
          />
        </a-popconfirm>
      </div>
    </a-config-provider>
    <a-config-provider
      :theme="{
        token: {},
      }"
    >
      <div class="ipt">
        <a-input
          autofocus
          v-model:value.trim="inputValue"
          @keydown.enter="handleInput"
          placeholder="发送消息......"
        />
        <SendOutlined
          @click="handleInput"
          class="ipt-icon"
          :style="{
            color: inputValue ? '#6d75ff' : '#999999',
          }"
        />
      </div>
    </a-config-provider>
  </div>
</template>

<script lang="ts">
export const isNull = (value: any) => ["", null, undefined].indexOf(value) > -1;
</script>

<script setup lang="ts">
import {
  DeleteOutlined,
  SendOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import { ref, computed } from "vue";
import {
  deleteSessions,
  getSessions,
  postMessages,
} from "@/views/HomeView/request";
import { convertTo2DArray } from "@/utils/convertTo2DArray";

const props = defineProps({
  updateList: {
    type: Function,
    required: true,
  },
  updateMenuList: {
    type: Function,
    required: true,
  },
  sessionId: {
    type: [String, Number],
    required: true,
  },
  aiDetail: {
    type: Object,
    required: true,
  },
  formList: {
    type: Array,
    required: true,
  },
  autoOpenModal: {
    type: Function,
  },
});

const inputValue = ref<string>("");

const groupList = computed(() => {
  return convertTo2DArray(props.formList as []);
});

const handleInput = async () => {
  const nowStamp = Date.now();
  try {
    if (!isNull(inputValue.value) && !props.sessionId) {
      props?.autoOpenModal();
    }

    if (isNull(inputValue.value) || !props.sessionId) {
      return;
    }
    console.log(nowStamp);
    props.updateList([
      { relatedCreateTime: nowStamp, content: inputValue.value, type: "user" },
      { createTime: nowStamp, isLoading: true, type: "TYPE_ASSISTANT" },
    ]);
    const content = inputValue.value;
    inputValue.value = "";
    const data = await postMessages({
      sessionId: props.sessionId,
      content,
    });

    if (data.message) {
      props.updateList([
        {
          ...data.message,
          createTime: nowStamp,
        },
      ]);
    }

    console.log(data);
  } catch (error) {
    props.updateList([
      {
        createTime: nowStamp,
        content: error.message,
        type: "TYPE_ASSISTANT",
      },
    ]);
  }
};

const handlePopConfirm = async () => {
  try {
    const deleteData = await deleteSessions(props.sessionId);
    if (deleteData) {
      props.updateMenuList();
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped lang="scss">
$h: 130px;

div.footerBox {
  :deep(input) {
    font-size: 18px;
    background: transparent;
    border: none;
    border-radius: 0;

    &:focus {
      box-shadow: 0 0 0 2px transparent;
    }
  }

  padding: 16px;
  padding-right: 120px;
  padding-left: 120px;
  background: #ffffff;
  height: $h;
  display: flex;
  flex-direction: row;

  .operateBox {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .ipt {
    margin-left: 42px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .ipt-icon {
      font-size: 21px;
      color: #1890ff;
      margin-left: 16px;
      cursor: pointer;
    }
  }
}

.aiInfoPanel {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-style: normal;
  font-weight: 493;
  line-height: 16px;
}
</style>
