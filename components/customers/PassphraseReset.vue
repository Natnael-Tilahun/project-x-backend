<script lang="ts" setup>
import { ref } from "vue";
import { toast } from "~/components/ui/toast";

const { resetPassphrase, isLoading } = useCustomers();

const loading = ref(isLoading.value);
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




const handlePinPassphrase = async () => {
  try {
    loading.value = true;
    const response = await resetPassphrase(props.customerId);
    responseData.value = response
    console.log("response: ", response);
    showSuccess.value = true;
    toast({
      title: "Passphrase Reset Successful",
      description: "A new Passphrase has been sent to the customer's phone number.",
    });
  } catch (err: any) {
    console.error("Error resetting passphrase:", err);
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
    <UiCard v-if="!showSuccess" class="rounded-lg border  border bg-purple-50 text-card-foreground shadow-sm">
      <div class="p-6 flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <div class="p-2 bg-red-100 rounded-full">
            <Icon name="heroicons:arrow-path" class="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">Reset Customer Passphrase</h3>
            <p class="text-sm text-muted-foreground">
              Reset the Passphrase for Phone Number: <strong>{{phoneNumber }} </strong> and Customer ID: <strong>{{ coreCustomerId }}</strong>
            </p>
          </div>
        </div>
        
        <div class="bg-muted/50 p-4 rounded-md">
          <p class="text-sm text-muted-foreground">
            This operation will:
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>Generate a new temporary Passphrase</li>
              <li>Send the new Passphrase to the customer's registered phone number via SMS</li>
              <li>Force the customer to change their Passphrase on their next login</li>
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
            Reset Passphrase
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
            <h3 class="text-lg font-semibold">Passphrase Reset Successful</h3>
            <p class="text-sm text-green-700">
              A new Passphrase has been sent to the customer's phone number: {{responseData.maskedIdentifier  }}
            </p>
          </div>
        </div>
        
        <div class="bg-green-100/50 p-4 rounded-md">
          <p class="text-sm text-green-700">
            <strong>What happens next:</strong>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>The customer will receive an SMS with their new temporary Passphrase</li>
              <li>They will be required to change this Passphrase on their next login</li>
              <li>The old Passphrase is no longer valid</li>
            </ul>
          </p>
        </div>

        <div class="flex justify-end">
          <UiButton
            @click="showSuccess = false"
            class="w-fit whitespace-nowrap bg-green-600 hover:bg-green-700"
          >
            Send Another Passphrase Reset
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
          This action will send a new Passphrase to the customer's phone number and force them to change it on their next login.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          :disabled="loading"
          @click="handlePinPassphrase"
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
