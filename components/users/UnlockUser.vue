<script lang="ts" setup>
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { getIdFromPath } from "~/lib/utils";

const { unlockUser, isLoading } = useUsers();

const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const showSuccess = ref(false);
const responseData = ref();
const userId = ref<string>()

userId.value = getIdFromPath()

const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

const props = defineProps<{
  userId: string;
}>();

if(props.userId){
  userId.value = props.userId
}


const handleUnlockUser = async () => {
  try {
    loading.value = true;
    const response = await unlockUser(userId.value);
    responseData.value = response;
    console.log("response: ", response);
    showSuccess.value = true;
    toast({
      title: "User Unlocked",
      description: "The user account has been unlocked successfully.",
    });
  } catch (err: any) {
    console.error("Error unlocking user:", err);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `${
        err.message == "404 NOT_FOUND" ? "User not found." : err.message
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
    <UiCard v-if="!showSuccess" class="rounded-lg border border bg-purple-50 text-card-foreground shadow-sm">
      <div class="p-6 flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <div class="p-2 bg-red-100 rounded-full">
            <Icon name="heroicons:key" class="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">Unlock User</h3>
            <p class="text-sm text-muted-foreground">
              Unlock the user account for User ID: <strong>{{ userId }}</strong>
            </p>
          </div>
        </div>
        
        <div class="bg-muted/50 p-4 rounded-md">
          <p class="text-sm text-muted-foreground">
            This operation will:
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>Unlock the user's account</li>
              <li>Allow the user to log in</li>
              <li>Force the user to change their PIN on their next login</li>
            </ul>
          </p>
        </div>

        <div class="flex justify-end">
          <UiButton
            :disabled="loading"
            @click="setOpenEditModal(true)"
            class="w-fit whitespace-nowrap"
          >
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="loading"
              class="mr-2 h-4 w-4 animate-spin"
            />
            Unlock User
          </UiButton>
        </div>
      </div>
    </UiCard>

    <!-- Success Message -->
    <UiCard v-else class="rounded-lg border bg-green-50 text-green-900 shadow-sm">
      <div class="p-6 flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <div class="p-2 bg-green-100 rounded-full">
            <Icon name="heroicons:check-circle" class="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">User Unlocked</h3>
            <p class="text-sm text-green-700">
              The user account has been successfully unlocked for User ID: {{ userId }}
            </p>
          </div>
        </div>
        
        <div class="bg-green-100/50 p-4 rounded-md">
          <p class="text-sm text-green-700">
            <strong>What happens next:</strong>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>The user will need to set a new PIN on their next login</li>
              <li>The old PIN is no longer valid</li>
            </ul>
          </p>
        </div>

        <div class="flex justify-end">
          <UiButton
            @click="showSuccess = false"
            class="w-fit whitespace-nowrap bg-green-600 hover:bg-green-700"
          >
            Unlock Another User
          </UiButton>
        </div>
      </div>
    </UiCard>
  </div>

  <UiAlertDialog :open="openEditModal" :onOpenChange="setOpenEditModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action will unlock the user's account and force them to change their PIN on their next login.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          :disabled="loading"
          @click="handleUnlockUser"
          class="bg-red-600 w-fit whitespace-nowrap"
        >
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="loading"
            :disabled="loading"
            class="mr-2 h-4 w-4 animate-spin"
          />
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<style lang="css" scoped></style>
