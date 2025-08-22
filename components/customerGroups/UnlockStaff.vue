<script lang="ts" setup>
import { ref } from "vue";
import { toast } from "~/components/ui/toast";

const { resetStaffPassword, isLoading } = useStaffs();

const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const showSuccess = ref(false);
const responseData = ref()
const emailAddress = ref("")
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

const props = defineProps<{
  staffId: string;
  email?: string
}>();


if(props.email){
  emailAddress.value = props.email
}



const handlePinReset = async () => {
  try {
    loading.value = true;
    const response = await resetStaffPassword(props.staffId);
    responseData.value = response
    console.log("response: ", response);
    showSuccess.value = true;
    toast({
      title: "Link Sent Successfully",
      description: "A link to reset password has been sent to the stafff's email.",
    });
  } catch (err: any) {
    console.error("Error resetting password:", err);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `${
        err.message == "404 NOT_FOUND" ? "Staff not found." : err.message
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
    <UiCard v-if="!showSuccess" class="rounded-lg border bg-purple-50 text-card-foreground shadow-sm">
      <div class="p-6 flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <div class="p-2 bg-red-100 rounded-full">
            <Icon name="heroicons:key" class="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">Reset Staff Password</h3>
            <p class="text-sm text-muted-foreground">
              Reset the password for email: <strong>{{emailAddress }} </strong> and Staff ID: <strong>{{ staffId }}</strong>
            </p>
          </div>
        </div>
        
        <div class="bg-muted/50 p-4 rounded-md">
          <p class="text-sm text-muted-foreground">
            This operation will:
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>Generate a new temporary link</li>
              <li>Send the new link to the staff's registered email via email</li>
              <li>Force the customer to change their password on their next login</li>
              <li>The link will expire after 3 days</li>
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
            Reset Password
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
            <h3 class="text-lg font-semibold">Password Reseted Successfully</h3>
            <p class="text-sm text-green-700">
              A new link has been sent to the staff's email: {{responseData.maskedIdentifier  }}
            </p>
          </div>
        </div>
        
        <div class="bg-green-100/50 p-4 rounded-md">
          <p class="text-sm text-green-700">
            <strong>What happens next:</strong>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>The customer will receive an email with their new temporary password reset link</li>
              <li>They will be required to set new password on their next login</li>
              <li>The old password is no longer valid</li>
            </ul>
          </p>
        </div>

        <div class="flex justify-end">
          <UiButton
            @click="showSuccess = false"
            class="w-fit whitespace-nowrap bg-green-600 hover:bg-green-700"
          >
            Send Another Reset Link
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
          This action will send a new link to the email's email and force them to change it on their next login.
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
          />
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
