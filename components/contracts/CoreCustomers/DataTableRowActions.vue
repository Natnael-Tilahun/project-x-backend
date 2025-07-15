<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "@/components/ui/toast";
import { getIdFromPath } from "~/lib/utils";
import { PermissionConstants } from "~/constants/permissions";
import type { ContractCoreCustomer } from "~/types";

const { deleteContractCoreCustomer,getContractCoreCustomers, isLoading } = useContractsCoreCustomers();

const loading = ref(isLoading.value);
const isError = ref(false);
const contractId = ref<string>("");
contractId.value = getIdFromPath();
const data = ref<ContractCoreCustomer[]>([]); 

const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  refetch: () => Promise<void>; // Accept refetch as a prop
}

const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(['contractCoreCustomerDeleted']); // Added 'languageDeleted'

function viewContractCoreCustomerDetail(contractId: string, coreCustomerId:string) {
  navigateTo(`/contracts/${contractId}?activeTab=contractCoreCustomerDetails&&coreCustomerId=${coreCustomerId}`);
  navigator.clipboard.writeText(contractId);
}

async function deleteContractCoreCustomers(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteContractCoreCustomer(id); // Call your API function to fetch roles
    console.log("Contract Core Customer deleted successfully");
    toast({
      title: "Contract Core Customer deleted successfully",
    });
    // Reload the window after deleting the role
    await props.refetch()
  } catch (err) {
    console.error("Error deleting contract core customer:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
    setOpenEditModal(false);
  }
}

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const contracts = await getContractCoreCustomers(contractId.value, 0, 100000000);
    data.value = contracts ? contracts : [];
  } catch (err: any) {
    console.error("Error fetching contract core customers:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton
        variant="ghost"
        class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
      >
        <Icon name="majesticons:dots-horizontal" class="h-4 w-4"></Icon>
        <span class="sr-only">Open menu</span>
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent align="end" class="w-[160px]">
  <UiPermissionGuard :permission="PermissionConstants.READ_CONTRACT_CORE_CUSTOMER" >
      <UiDropdownMenuItem @click="viewContractCoreCustomerDetail(row.original.contract.id, row.original.id)"
        >View and Edit</UiDropdownMenuItem
      >
      <UiDropdownMenuSeparator />
      </UiPermissionGuard>
  <UiPermissionGuard :permission="PermissionConstants.DELETE_CONTRACT_CORE_CUSTOMER" >
      <UiDropdownMenuItem @click="setOpenEditModal(true)" class="text-red-600" :disabled="data.length <= 1">
        Delete
        <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
      </UiDropdownMenuItem>
      </UiPermissionGuard>
    </UiDropdownMenuContent>
  </UiDropdownMenu>

  <UiAlertDialog :open="openEditModal" :onOpenChange="setOpenEditModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently delete the
          contract and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deleteContractCoreCustomers(row.original.id)">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isLoading"
            :disabled="isLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
