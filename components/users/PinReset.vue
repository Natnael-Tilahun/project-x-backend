<script lang="ts" setup>
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { getIdFromPath } from "~/lib/utils";

const { resetUserPin, isLoading } = useUsers();

const loading = ref(isLoading.value);
const isError = ref(false);
const userId = ref<string>();
const openEditModal = ref(false);
const route = useRoute();

const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};


const props = defineProps<{
  userId?: string;
}>();

userId.value = props.userId;
userId.value = getIdFromPath(route.fullPath);

const handlePinReset = async () => {
  try {
    loading.value = true;
    if (userId.value) {
      const response = await resetUserPin(userId.value); // Call your API function to fetch roles
      console.log("response: ", response);
      toast({
        title: "Pin reset successful",
        description: "The pin has been reset successfully.",
      });
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
    setOpenEditModal(false);
  }
};
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="flex gap-8 items-center">
      <div class="grid w-full max-w-sm items-center gap-2">
        <UiLabel for="search" class="font-normal text-muted-foreground"
          >Enter user id</UiLabel
        >
        <div class="flex items-center gap-4">
          <UiInput
            id="search"
            type="search"
            placeholder="Enter user id"
            class="md:w-[100px] lg:w-[300px]"
            v-model="userId"
          />
          <UiButton
            :disabled="userId == '' || loading"
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
          the user.
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
