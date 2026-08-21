<script setup lang="ts">
import Github from "./icons/Github.vue";
import Linkedin from "./icons/Linkedin.vue";
import Instagram from "./icons/Instagram.vue";
import Mail from "./icons/Mail.vue";
import Wechat from "./icons/Wechat.vue";
import X from "./icons/X.vue";
import Link from "./Link.vue";
import { t } from "../i18n/utils/translate";
import ButtonRound from "./ButtonRound.vue";
import WeChatContactModal from "./WeChatContactModal.vue";
import { ref } from "vue";

import { social } from "../content/social";

const props = defineProps<{
  variant?: "theme" | "background";
}>();

const wechatModalOpen = ref(false);

// map icon names to components
const icons = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  x: X,
  instagram: Instagram,
  wechat: Wechat,
} as const;

const getAriaLabel = (name: string) => `${t("go-to")} ${name.charAt(0).toUpperCase() + name.slice(1)}`;
</script>

<template>
  <div class="social">
    <template v-for="item in social" :key="item.name">
      <button
        v-if="item.name === 'wechat'"
        type="button"
        :aria-label="getAriaLabel(item.name)"
        class="social-link social-link-button"
        data-cursor="circle-white"
        @click="wechatModalOpen = true"
      >
        <ButtonRound
          renderAs="div"
          :variant="props.variant ?? 'theme'"
          class="children-unclickable"
          data-hoversound="hover"
        >
          <component :is="icons[item.name]" :aria-label="getAriaLabel(item.name)" />
        </ButtonRound>
      </button>
      <Link
        v-else
        external
        :href="item.url"
        :aria-label="getAriaLabel(item.name)"
        class="social-link"
        data-cursor="circle-white"
      >
        <ButtonRound
          renderAs="div"
          :variant="props.variant ?? 'theme'"
          class="children-unclickable"
          data-hoversound="hover"
        >
          <component :is="icons[item.name]" :aria-label="getAriaLabel(item.name)" external />
        </ButtonRound>
      </Link>
    </template>
    <WeChatContactModal :open="wechatModalOpen" @close="wechatModalOpen = false" />
  </div>
</template>

<style scoped lang="scss">
.social {
  display: flex;
  gap: var(--space-md);

  &-link-button {
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }
}
</style>
