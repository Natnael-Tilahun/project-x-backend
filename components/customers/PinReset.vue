<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { ref } from "vue";
import { toast } from "~/components/ui/toast";

const { getCoreAccountsByCustomerId, isLoading } = useCustomers();

const loading = ref(isLoading.value);
const isError = ref(false);
const coreCustomerId = ref<string>();
const pinReset = ref(false);
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

const handlePinReset = async () => {
  try {
    loading.value = true;
    console.log("coreCustomerId.value: ", coreCustomerId.value);
    if (coreCustomerId.value) {
      const response = await getCoreAccountsByCustomerId(coreCustomerId.value); // Call your API function to fetch roles
      console.log("response: ", response);
    } else {
      return true;
    }
  } catch (err: any) {
    console.error("Error resetting pin:", err);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `${
        err.message == "404 NOT_FOUND" ? "Customer not found." : err.message
      }`,
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="flex gap-8 items-center">
      <div class="grid w-full max-w-sm items-center gap-2">
        <UiLabel for="search" class="font-normal text-muted-foreground"
          >Enter customer id</UiLabel
        >
        <div class="flex items-center gap-4">
          <UiInput
            id="search"
            type="search"
            placeholder="Enter customer id"
            class="md:w-[100px] lg:w-[300px]"
            v-model="coreCustomerId"
          />
          <UiButton
            :disabled="coreCustomerId == '' || loading"
            @click="setOpenEditModal(true)"
            class="w-fit whitespace-nowrap"
          >
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="loading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            Reset PIN</UiButton
          >
        </div>
      </div>
    </div>
  </div>

  <UiAlertDialog :open="openEditModal" :onOpenChange="setOpenEditModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently reset the pin for
          the customer.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          :disabled="loading"
          @click="handlePinReset"
          class="bg-red-600 w-fit whitespace-nowrap"
        >
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="loading"
            :disabled="loading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<style lang="css" scoped></style>
