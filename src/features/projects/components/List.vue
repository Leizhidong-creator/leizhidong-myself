<script setup lang="ts">
import { computed } from "vue";

export interface Props {
  title?: string;
  items: string[];
  size?: "sm" | "md" | "lg";
}

const props = defineProps<Props>();

const classes = computed(() => {
  return ["list", `list-size-${props.size ?? "md"}`];
});
</script>

<template>
  <div :class="classes">
    <h3 v-if="props.title" class="list-title">{{ props.title }}</h3>
    <ul class="list-items">
      <li v-for="item in props.items" :key="item" class="list-item" v-html="item"></li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 100%;
  grid-column: 1 / 13;

  &-size {
    &-sm {
      @include mixins.mq("md") {
        grid-column: 4 / 10;
      }

      @include mixins.mq("lg") {
        grid-column: 6 / 8;
      }
    }

    &-md {
      @include mixins.mq("md") {
        grid-column: 3 / 11;
      }

      @include mixins.mq("lg") {
        grid-column: 4 / 10;
      }
    }

    &-lg {
      @include mixins.mq("md") {
        grid-column: 3 / 11;
      }
    }
  }

  &-title {
    font-size: var(--font-size-title-sm);
    line-height: var(--line-height-md);
  }

  &-items {
    list-style-type: disc;
    padding-left: 1.4em;
  }

  &-item {
    padding: 6px 0;
  }
}
</style>
