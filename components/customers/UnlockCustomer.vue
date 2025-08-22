<script lang="ts" setup>
import { ref } from "vue";
import { toast } from "~/components/ui/toast";

const { unlockCustomer } = useCustomers();

const loading = ref(false);
const isError = ref(false);
const openEditModal = ref(false);
const showSuccess = ref(false);
const responseData = ref()
const phoneNumber = ref("")
	
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

const props = defineProps<{
  customerId: string;
  phone?: string
  coreCustomerId?:string
}>();

const coreCustomerId = ref(props?.coreCustomerId || "")

if(props.phone){
  phoneNumber.value = props.phone
}

const handleCustomerUnlock = async () => {
  try {
    loading.value = true;
    const response = await unlockCustomer(props.customerId);
    responseData.value = response
    console.log("response: ", response);
    showSuccess.value = true;
    toast({
      title: "Customer Unlocked Successfully",
      description: "The customer account has been unlocked.",
    });
  } catch (err: any) {
    console.error("Error unlocking customer:", err);
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
    <UiCard v-if="!showSuccess" class="rounded-lg border bg-purple-50 text-card-foreground shadow-sm">
      <div class="p-6 flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <div class="p-2 bg-yellow-100 rounded-full">
            <Icon name="heroicons:lock-open" class="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">Unlock Customer Account</h3>
            <p class="text-sm text-muted-foreground">
              Unlock the account for Phone Number: <strong>{{ phoneNumber }}</strong> and Customer ID: <strong>{{ coreCustomerId }}</strong>
            </p>
          </div>
        </div>
        
        <div class="bg-muted/50 p-4 rounded-md">
          <p class="text-sm text-muted-foreground">
            This operation will:
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>Unlock the customer's account if it is currently locked</li>
              <li>Allow the customer to log in again</li>
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
            Unlock Customer
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
            <h3 class="text-lg font-semibold">Customer Unlocked</h3>
            <p class="text-sm text-green-700">
              The customer account has been successfully unlocked.
            </p>
          </div>
        </div>
        
        <div class="bg-green-100/50 p-4 rounded-md">
          <p class="text-sm text-green-700">
            <strong>What happens next:</strong>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>The customer can now log in to their account</li>
              <li>No further action is required</li>
            </ul>
          </p>
        </div>

        <div class="flex justify-end">
          <UiButton
            @click="showSuccess = false"
            class="w-fit whitespace-nowrap bg-green-600 hover:bg-green-700"
          >
            Unlock Another Customer
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
          This action will unlock the customer's account and allow them to log in again.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          :disabled="loading"
          @click="handleCustomerUnlock"
          class="bg-yellow-600 w-fit whitespace-nowrap"
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
