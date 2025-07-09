<script lang="ts" setup>
const openItems = ref("accounts");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newContractUserAndCustomerFormSchema } from "~/validations/newContractUserAndCustomerFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type {
  Contract,
  Permission,
  User,
  ServiceDefinitionRole,
} from "~/types";
import { copyToClipboard, getIdFromPath } from "~/lib/utils";

const route = useRoute();
const {  createNewContractForNewUser } =
  useContractsUsers();
const { searchUsers } = useUsers();
const { searchCustomers } = useCustomers();
const { getServiceDefinitionsRoles } = useServiceDefinitionsRoles();

const contractId = ref<string>("");
const contractCoreCustomerId = ref<string>("");
const loading = ref(false);
const isError = ref(false);
const data = ref<User | null>(null);
const usersData = ref<User[]>([]);
const contractData = ref<Contract>();
const permissionsData = ref<Permission[]>([]);
const searchUser = ref<string>("");
const openNewUserModal = ref(false);
const openExistingUserModal = ref(false);
const serviceDefinitionRolesData = ref<ServiceDefinitionRole[]>([]);

contractId.value = getIdFromPath();
contractCoreCustomerId.value = route.query.coreCustomerId as string;

const props = defineProps<{
  contractProps?: Contract;
}>();

if (props.contractProps) {
  contractData.value = props.contractProps;
  permissionsData.value = contractData?.value?.permissions;
}

console.log("contractId: ", contractId.value);
console.log("contractCoreCustomerId: ", contractCoreCustomerId.value);
console.log("permissionsData: ", permissionsData.value);
console.log("contractProps: ", contractData.value);
console.log("data: ", data.value);

const newCustomerForm = useForm({
  validationSchema: newContractUserAndCustomerFormSchema,
});

const fetchServiceDefinitionRoles = async () => {
  try {
    loading.value = true;
    const response = await getServiceDefinitionsRoles();
    serviceDefinitionRolesData.value = response;
  } catch (err) {
    console.error("Error fetching service definition roles:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const searchUserHandler = async () => {
  try {
    loading.value = true;
    // userData.value = "";
    if (searchUser.value) {
      const response = await searchCustomers(searchUser.value); // Call your API function to fetch roles
      usersData.value = response;
      data.value = usersData.value[0] || null;
      console.log("user data: ", data.value);
    } else {
      return true;
    }
  } catch (err: any) {
    console.error("Error fetching users:", err);
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
  }
};

const setOpenNewUserModal = (value: boolean) => {
  openNewUserModal.value = value;
};

const setOpenExistingUserModal = (value: boolean) => {
  openExistingUserModal.value = value;
};

const refetch = async () => {
  await fetchServiceDefinitionRoles();
};

onMounted(() => {
  fetchServiceDefinitionRoles();
});

const newUserOnSubmit = newCustomerForm.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    if (!contractId.value) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Contract not found.",
        variant: "destructive",
      });
      return;
    }

    const newValues = {
      ...values,
      serviceDefinitionRoleId: values.serviceDefinitionRoleId,
    };
    console.log("newValues: ", newValues);

    const response = await createNewContractForNewUser(
      contractId.value,
      newValues
    ); // Call your API function to fetch roles
    console.log("response: ", response);
    navigateTo(`${route.path}?activeTab=contractUsers`);
    toast({
      title: "Contract Created",
      description: "Contract user created successfully",
    });
  } catch (err: any) {
    console.error("Error creating contract user:", err);
    isError.value = true;
  } finally {
    loading.value = false;
    openNewUserModal.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div class="flex gap-8 items-center justify-between w-full">
      <div class="grid w-full max-w-sm items-center gap-2">
        <UiLabel for="search" class="font-normal text-muted-foreground"
          >Find customer by phone number or email ( Start phone number with 9
          )</UiLabel
        >
        <div class="flex items-center gap-4">
          <UiInput
            id="search"
            type="search"
            placeholder="Search by phone number or email"
            class="md:w-[100px] lg:w-[300px]"
            v-model="searchUser"
            @keyup.enter="searchUserHandler"
          />
          <UiButton
            :disabled="searchUser == '' || loading"
            @click="searchUserHandler"
          >
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="loading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            Search</UiButton
          >
        </div>
      </div>
      <UiAlertDialog
        v-if="!data"
        :open="openNewUserModal"
        :onOpenChange="setOpenNewUserModal"
      >
        <UiAlertDialogTrigger class="self-end">
          <UiButton class="w-full" @click="setOpenNewUserModal(true)">
            Create new customer and add to contract user</UiButton
          >
        </UiAlertDialogTrigger>
        <UiAlertDialogContent class="sm:min-w-full h-[100%] p-6">
          <UiButton @click="setOpenNewUserModal(false)" variant="outline" class="absolute right-8 top-2">
            <Icon
            name="material-symbols:close"
            class="h-4 w-4 mx-auto"
                ></Icon>
          </UiButton>
          <ContractsUsersNewUserFormDialog  @close="setOpenNewUserModal(false)" :serviceDefinitionId="contractProps?.serviceDefinition?.id" />

        </UiAlertDialogContent>
      </UiAlertDialog>
    </div>
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <div class="w-full flex flex-col gap-4" v-else-if="data && !isError">
      <div class="w-full" v-if="data && usersData.length == 0">
        <UiNoResultFound title="Sorry, No user found." />
      </div>
      <UiCard
        v-if="usersData?.length > 0"
        class="grid lg:grid-cols-3 gap-4 text-sm md:gap-x-8 w-full p-6"
      >
        <div class="space-y-1">
          <h1 class="text-muted-foreground uppercase">ID</h1>
          <div
            @click="copyToClipboard(data?.id)"
            class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
          >
            <p>{{ data?.id || "Not Setted" }}</p>
            <Icon
              name="material-symbols:content-copy"
              class="h-5 w-5 text-primary"
            ></Icon>
          </div>
        </div>
        <div class="space-y-1">
          <h1 class="text-muted-foreground">Username</h1>
          <div
            @click="copyToClipboard(data?.login)"
            class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
          >
            <p>{{ data?.login || "Not Setted" }}</p>
            <Icon
              name="material-symbols:content-copy"
              class="h-5 w-5 text-primary"
            ></Icon>
          </div>
        </div>
        <div class="space-y-1">
          <h1 class="text-muted-foreground">Phone Number</h1>
          <div
            @click="copyToClipboard(data?.phone)"
            class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
          >
            <p>{{ data?.phone || "Not Setted" }}</p>
            <Icon
              name="material-symbols:content-copy"
              class="h-5 w-5 text-primary"
            ></Icon>
          </div>
        </div>
        <div class="space-y-1">
          <h1 class="text-muted-foreground">Email</h1>
          <div
            @click="copyToClipboard(data?.email)"
            class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
          >
            <p>{{ data?.email || "Not Setted" }}</p>
            <Icon
              name="material-symbols:content-copy"
              class="h-5 w-5 text-primary"
            ></Icon>
          </div>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">National Id</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.nationalId || "Not Setted" }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">User Activated</h1>
          <UiBadge
            class="p-2 rounded-md w-full hover:bg-green-500"
            :class="data?.activated ? 'bg-green-500' : 'bg-red-500'"
          >
            {{ data?.activated ? "Active" : "Inactive" }}
          </UiBadge>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Verified</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.verified != null ? data?.verified : "-" }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Email Verified</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.emailVerified != null ? data?.emailVerified : "-" }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Force PIN Change</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.forcePinChange != null ? data.forcePinChange : "-" }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Is Pin Set</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.isPinSet != null ? data.isPinSet : "-" }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Is User Account Locked</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{
              data?.isUserAccountLocked != null ? data.isUserAccountLocked : "-"
            }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Created By</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.createdBy != null ? data.createdBy : "-" }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Created Date</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{
              data?.createdDate != null
                ? new Date(data.createdDate).toLocaleDateString()
                : "-"
            }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Current Login Time</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{
              data?.currentLoginTime != null
                ? new Date(data.currentLoginTime).toLocaleDateString()
                : "-"
            }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Device Id</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.deviceId != null ? data.deviceId : "-" }}
          </p>
        </div>
        <!-- <div class="space-y-0">
          <h1 class="text-muted-foreground">Image Url</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.imageUrl != null ? data.imageUrl : "-" }}
          </p>
        </div> -->
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Language Key</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.langKey != null ? data.langKey : "-" }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Last Login Time</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{
              data?.lastLoginTime != null
                ? new Date(data.lastLoginTime).toLocaleDateString()
                : "-"
            }}
          </p>
        </div>
        <!-- <div class="space-y-0">
          <h1 class="text-muted-foreground">Last Modified By</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.lastModifiedBy != null ? data.lastModifiedBy : "-" }}
          </p>
        </div> -->
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Last Modified Date</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{
              data?.lastModifiedDate != null
                ? new Date(data.lastModifiedDate).toLocaleDateString()
                : "-"
            }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Lock Count</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.lockCount != null ? data.lockCount : "-" }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Lockout Date Time</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{
              data?.lockoutDateTime != null
                ? new Date(data.lockoutDateTime).toLocaleDateString()
                : "-"
            }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Preferred Otp Method</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{
              data?.preferredOtpMethod != null ? data.preferredOtpMethod : "-"
            }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Reset Date</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{
              data?.resetDate != null
                ? new Date(data.resetDate).toLocaleDateString()
                : "-"
            }}
          </p>
        </div>
        <!-- <div class="space-y-0">
          <h1 class="text-muted-foreground">Reset Key</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.resetKey != null ? data.resetKey : "-" }}
          </p>
        </div> -->
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Unsuccessful Login Attempts</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{
              data?.unsuccessfulLoginAttempts != null
                ? data.unsuccessfulLoginAttempts
                : "-"
            }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Verification Key</h1>
          <p class="border p-2 bg-muted rounded-md">
            {{ data?.verificationKey != null ? data.verificationKey : "-" }}
          </p>
        </div>
        <div class="space-y-0">
          <h1 class="text-muted-foreground">Roles</h1>
          <ul class="border py-3 px-6 bg-muted rounded-md">
            <li
              class="list-disc"
              v-for="(item, index) in data?.authorities"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="w-full col-span-full flex justify-end pt-4">
          <UiAlertDialog
        v-if="data"
        :open="openExistingUserModal"
        :onOpenChange="setOpenExistingUserModal"
      >
        <UiAlertDialogTrigger class="self-end">
          <UiButton class="w-full" @click="setOpenExistingUserModal(true)">
            Create new contract user for this customer
          </UiButton>
        </UiAlertDialogTrigger>
        <UiAlertDialogContent>
          <ContractsUsersNewUserForExistingCustomer 
            @close="setOpenExistingUserModal(false)"
            :contractProps="contractData" 
            :data="data" 
          />
        </UiAlertDialogContent>
      </UiAlertDialog>
        </div>
      </UiCard>
      
    </div>

    <UiCard
      v-else-if="data == null || (data == undefined && !isError)"
      class="w-full h-40 flex flex-col justify-center items-center text-sm"
    >
      <h1 class="text-muted-foreground">No user found</h1>
      <p class="text-muted-foreground">
        Search by phone number or email to get user details
      </p>
    </UiCard>

    <div class="w-full" v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
