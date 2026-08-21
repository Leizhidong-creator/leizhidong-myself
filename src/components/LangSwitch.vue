<script setup lang="ts">
import Button from "./Button.vue";
import { locale } from "../i18n/store";
import { changeLocale } from "../i18n/utils/locale";

const handleLangSwitch = () => {
  changeLocale(locale.value === "de" ? "en" : "de");
};
</script>

<template>
  <Button
    variant="border"
    size="sm"
    @click="handleLangSwitch"
    data-cursor="circle-white"
    data-sound="click"
    data-hoversound="hover"
    >{{ locale === "de" ? "EN" : "DE" }}</Button
  >
</template>
