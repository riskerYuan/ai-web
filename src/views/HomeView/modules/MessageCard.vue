<template>
  <div
    class="container"
    :style="{ background: type === 'TYPE_ASSISTANT' ? '#FFF' : '#F9F9F9' }"
  >
    <div class="icon-ai" v-if="type === 'TYPE_ASSISTANT'">ai</div>
    <div class="icon-g" v-else>G</div>
    <div class="content">
      <div class="loading" v-if="isLoading">
        <a-spin />
      </div>
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  message: {
    required: true,
  },
  type: String,
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
@mixin Icon($bg: #ff8181) {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 12px;
  background: $bg;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 24px;
  font-style: normal;
  font-weight: 493;
  line-height: normal;
  text-transform: uppercase;
}

@mixin Layout {
  padding: 20px 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.container {
  @include Layout();
  padding: 20px 120px 20px 60px;

  .icon-ai {
    @include Icon(#6d75ff);
  }

  .icon-g {
    @include Icon();
  }

  .content {
    margin-left: 20px;
    color: #333;
    font-size: 16px;
    font-style: normal;
    font-weight: 493;
    line-height: 200%; /* 32px */
    text-transform: uppercase;
  }
}

.loading {
  height: 38px;
  text-align: center;
  border-radius: 4px;
  padding: 0 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
