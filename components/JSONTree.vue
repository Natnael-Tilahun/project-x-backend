<script lang="ts" setup>
import { copyToClipboard } from "~/lib/utils";

defineProps<{
  jsonData: object | Array<any>;
}>();

const handleCopy = (value: any) => {
  copyToClipboard(value);
};
</script>

<template>
  <ul class="text-sm ml-5 p-0">
    <li class="my-4 w-full" v-for="(value, key) in jsonData" :key="key">
      <strong class="text-[#333]">{{ key }} </strong> :
      <span
        @click="handleCopy(value)"
        class="border px-4 py-1 w-full min-w-[200px] rounded-md bg-white cursor-pointer"
        v-if="typeof value !== 'object'"
      >
        {{ value ? value : "null" }}
        <Icon name="heroicons:clipboard-document" class="w-4 h-4"></Icon>
      </span>
      <JSONTree v-else :jsonData="value" />
    </li>
  </ul>
</template>
