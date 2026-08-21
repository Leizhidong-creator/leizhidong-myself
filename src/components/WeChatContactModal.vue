<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";
import ButtonRound from "./ButtonRound.vue";
import X from "./icons/X.vue";
import Wechat from "./icons/Wechat.vue";
import { wechatContact } from "../content/contact";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const close = () => emit("close");

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.open) {
    close();
  }
};

watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
  },
);

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <div v-if="props.open" class="wechat-modal" role="dialog" aria-modal="true" aria-labelledby="wechat-modal-title">
      <button class="wechat-modal-backdrop" type="button" aria-label="关闭微信联系方式" @click="close"></button>
      <section class="wechat-modal-panel">
        <ButtonRound
          class="wechat-modal-close"
          variant="theme"
          size="sm"
          aria-label="关闭微信联系方式"
          @click="close"
          data-cursor="circle-white"
          data-hoversound="hover"
        >
          <X />
        </ButtonRound>
        <div class="wechat-modal-icon">
          <Wechat />
        </div>
        <div class="wechat-modal-copy">
          <p class="wechat-modal-kicker">WeChat</p>
          <h2 id="wechat-modal-title" class="wechat-modal-title">联系我</h2>
          <p class="wechat-modal-text">扫码添加微信，或搜索微信号：</p>
          <p class="wechat-modal-id">{{ wechatContact.id }}</p>
        </div>
        <img class="wechat-modal-qr" :src="wechatContact.qrCode" alt="雷智栋微信二维码" />
      </section>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.wechat-modal {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-index-header) + 10);
  display: grid;
  place-items: center;
  padding: var(--space-outer);
  color: var(--color-text-400);

  &-backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    background: rgba(20, 17, 13, 0.58);
    backdrop-filter: blur(10px);
    cursor: pointer;
  }

  &-panel {
    position: relative;
    width: min(92vw, 440px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-xl);
    border-radius: var(--radius-xl);
    background: var(--color-background-400);
    box-shadow: 0 32px 90px rgba(0, 0, 0, 0.22);
  }

  &-close {
    position: absolute;
    top: var(--space-sm);
    right: var(--space-sm);
  }

  &-icon {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    padding: 12px;
    border-radius: 50%;
    background: #e7fff1;
    color: #18a85d;
    --icon-color: #18a85d;
  }

  &-copy {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xxs);
    text-align: center;
  }

  &-kicker {
    font-size: var(--font-size-sm);
    font-weight: 900;
    text-transform: uppercase;
    color: #18a85d;
  }

  &-title {
    font-size: var(--font-size-title-sm);
    line-height: var(--line-height-title);
  }

  &-text {
    line-height: var(--line-height-copy);
  }

  &-id {
    font-weight: 900;
    word-break: break-all;
  }

  &-qr {
    width: min(100%, 300px);
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: var(--radius-md);
    border: var(--stroke-sm) solid var(--color-grayscale-400);
  }
}
</style>
