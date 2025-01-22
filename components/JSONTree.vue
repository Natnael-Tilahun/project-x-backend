<template>
  <ul class="text-sm ml-5 p-0">
    <li class="my-2" v-for="(value, key) in jsonData" :key="key">
      <strong class="text-[#333]">{{ key }} </strong> :
      <span
        @click="copyToClipboard(value)"
        class="border"
        v-if="typeof value !== 'object'"
        >{{ value ? value : "null" }}</span
      >
      <JSONTree v-else :jsonData="value" />
    </li>
  </ul>
</template>

<script>
import { copyToClipboard } from "~/lib/utils";
export default {
  name: "JSONTree",
  props: {
    jsonData: {
      type: [Object, Array],
      required: true,
    },
  },
};
</script>
