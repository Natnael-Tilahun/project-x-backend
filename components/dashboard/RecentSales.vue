<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  customerData: Customer[];
}>();

const data = computed(() => {
  return props.customerData
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => {
      const dateA = a.syncTimestamp ? new Date(a.syncTimestamp) : new Date(0);
      const dateB = b.syncTimestamp ? new Date(b.syncTimestamp) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);
});

const isLoading = ref(false);
const isError = ref(false);

const navigateToCustomerDetail = (id: string) => {
  router.push(`/customers/customerDetails/${id}`);
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-8" v-if="isLoading">
      <div
        class="h-16 flex justify-between items-center shadow-md rounded-xl p-4"
      >
        <div class="flex gap-4 items-center">
          <UiSkeleton class="h-10 w-10 rounded-full bg-slate-300" />
          <div class="flex flex-col gap-2">
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
          </div>
        </div>
        <UiSkeleton class="h-4 w-20 bg-slate-300" />
      </div>
      <div
        class="h-16 flex justify-between items-center shadow-md rounded-xl p-4"
      >
        <div class="flex gap-4 items-center">
          <UiSkeleton class="h-10 w-10 rounded-full bg-slate-300" />
          <div class="flex flex-col gap-2">
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
          </div>
        </div>
        <UiSkeleton class="h-4 w-20 bg-slate-300" />
      </div>
      <div
        class="h-16 flex justify-between items-center shadow-md rounded-xl p-4"
      >
        <div class="flex gap-4 items-center">
          <UiSkeleton class="h-10 w-10 rounded-full bg-slate-300" />
          <div class="flex flex-col gap-2">
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
          </div>
        </div>
        <UiSkeleton class="h-4 w-20 bg-slate-300" />
      </div>
      <div
        class="h-16 flex justify-between items-center shadow-md rounded-xl p-4"
      >
        <div class="flex gap-4 items-center">
          <UiSkeleton class="h-10 w-10 rounded-full bg-slate-300" />
          <div class="flex flex-col gap-2">
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
          </div>
        </div>
        <UiSkeleton class="h-4 w-20 bg-slate-300" />
      </div>
      <div
        class="h-16 flex justify-between items-center shadow-md rounded-xl p-4"
      >
        <div class="flex gap-4 items-center">
          <UiSkeleton class="h-10 w-10 rounded-full bg-slate-300" />
          <div class="flex flex-col gap-2">
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
          </div>
        </div>
        <UiSkeleton class="h-4 w-20 bg-slate-300" />
      </div>
    </div>

    <UiError v-if="isError" />
    <div
      v-else
      v-for="item in data"
      :key="item.id"
      class="flex items-center cursor-pointer p-3 rounded-xl bg-accent dark:bg-gray-700 dark:text-white hover:bg-accent/20 hover:dark:bg-gray-600 hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-accent/20 transition-all duration-300 ease-in-out"
      @click="navigateToCustomerDetail(item.id)"
    >
      <UiAvatar class="h-9 w-9">
        <UiAvatarImage src="/avatars/01.png" alt="Avatar" />
        <UiAvatarFallback>{{
          getInitials(item.fullName || "Unknown")
        }}</UiAvatarFallback>
      </UiAvatar>
      <div class="ml-4 space-y-1">
        <p class="text-sm font-medium leading-none">
          {{ item.fullName || "Full Name" }}
        </p>
        <p class="text-sm text-muted-foreground dark:text-white">
          {{ item.coreCustomerId || "Customer ID" }}
        </p>
      </div>
    </div>
  </div>
</template>
