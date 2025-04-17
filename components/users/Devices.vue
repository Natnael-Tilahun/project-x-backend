<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { getIdFromPath } from "~/lib/utils";
import type { Device } from "~/types";

const { getUserDevices, suspendDevicesByDeviceId, restoreDevicesByDeviceId, isLoading } = useUsers();

const data = ref<Device[]>();
const loading = ref(isLoading.value);
const isError = ref(false);
const accountsData = ref<any>();
const coreCustomerId = ref<string>();
const tooltipText = ref<string>("Copy to clipboard");
const tooltipOpen = ref<boolean>(true);
const selectedDevices = ref<Device[]>([]);
const selectedDeviceId = ref<string>("");
const showDeviceDetails = ref(false);
const userId = ref<string>();
const route = useRoute();
// Update the interface to match the actual data structure
userId.value = getIdFromPath(route.fullPath);
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};
const selectedDeviceSuspended = ref(false);
const deviceId = ref<string>("");

const displayApiDataOnLabel = (data: any) => {
  if (data == null || data == "") {
    return "-";
  }
  if (data == false) {
    return "false";
  }
  if (data == true) {
    return "true";
  }
  return data; // Default case if customerActivated is undefined or any other value
};

const copyToClipboard = (data: any) => {
  navigator.clipboard.writeText(data);
  tooltipText.value = "Copied to clipboard";
  tooltipOpen.value = true;
  setTimeout(() => {
    tooltipOpen.value = false;
    tooltipText.value = "Copy to clipboard";
  }, 2000); // Reset the tooltip text after 2 seconds
};

const handleDeviceSelect = (device: Device) => {
  const index = selectedDevices.value.findIndex(
    (a) => a.deviceId === device.deviceId
  );

  if (index === -1) {
    selectedDevices.value.push(device);
  } else {
    selectedDevices.value.splice(index, 1);
  }
};

const isDeviceSelected = (device: Device) => {
  return selectedDevices.value.some(
    (a) => a.deviceId === device.deviceId
  );
};

const fetchDevices = async () => {
  try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getUserDevices(userId.value as string); // Call your API function to fetch roles
  console.log("Devices data: ", data.value);
} catch (err) {
  console.error("Error fetching devices:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}
};

const manageDevice = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    if (selectedDeviceSuspended.value) {
      await restoreDevicesByDeviceId(userId.value as string, deviceId.value);
    } else {
      await suspendDevicesByDeviceId(userId.value as string, deviceId.value);
    }
    fetchDevices();
    toast({
      title: selectedDeviceSuspended.value ? "Device restored" : "Device suspended",
      description: selectedDeviceSuspended.value ? "The device has been restored" : "The device has been suspended",
      variant: "default",
    });
  } catch (err) {
    console.error("Error suspending device:", err);
    toast({
      title: "Error suspending device",
      description: "An error occurred while suspending the device",
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
    setOpenEditModal(false);
  }
};

onMounted(() => {
  fetchDevices();
});
</script>

<template>
  <div class="flex flex-col space-y-8">

    <UiCard
      class="grid lg:grid-cols-4 gap-4 md:gap-8 w-full p-6"
      v-if="loading"
    >
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
      <UiSkeleton class="h-16 w-full" />
    </UiCard>

    <UiCard
      v-if="data && data.length > 0 && !loading && !isError"
      class="w-full flex flex-col gap-4 p-6"
    >
      <!-- <div class="p-6"> -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Associated Devices</h2>
        <p class="text-sm text-muted-foreground">
          {{ selectedDevices.length }} selected
        </p>
      </div>

      <UiAccordion type="single" collapsible v-model:value="openItems">
        <UiAccordionItem
          v-for="(device, index) in data"
          :key="device.deviceId"
          :value="`item-${index + 1}`"
          class="border rounded-lg mb-4 data-[state=open]:bg-muted/50"
        >
          <div
            class="flex items-center p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            :class="{ 'bg-muted/50': isDeviceSelected(device) }"
            @click.stop="handleDeviceSelect(device)"
          >
            <div class="flex items-center gap-4 w-full">
              <!-- <UiCheckbox
                :checked="isDeviceSelected(device)"
                @click.stop="handleDeviceSelect(device)"
                class="h-5 w-5"
              /> -->
              <div class="flex-1 grid grid-cols-7 gap-4">
                <div class="space-y-2">
                  <p class="text-sm text-muted-foreground">Device ID</p>
                  <p class="font-medium text-nowrap text-ellipsis overflow-hidden text-base">{{ device.deviceId }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Device Name</p>
                  <p class="font-medium text-nowrap text-ellipsis overflow-hidden text-base">{{ device.deviceName }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Device Type</p>
                  <p class="font-medium text-nowrap text-ellipsis overflow-hidden text-sm">{{ device.deviceType }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">OS Version</p>
                  <p class="font-medium">
                    {{ device.osVersion }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Active</p>
                  <UiBadge class="font-medium" :class="{ 'bg-green-500': device.active, 'bg-red-500': !device.active }">
                    {{ device.active ? 'Active' : 'Inactive' }}
                  </UiBadge>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Suspended</p>
                  <UiBadge class="font-medium" :class="{ 'bg-red-500': device.suspended, 'bg-green-500': !device.suspended }">
                    {{ device.suspended ? 'Suspended' : 'Not Suspended' }}
                  </UiBadge>
                </div>
                <UiPermissionGuard :permission=" device.suspended ? 'RESTORE_USER_DEVICE' : 'SUSPEND_USER_DEVICE'" >
                <div class="flex items-start">
                  <UiButton  @click=" () => {deviceId = device.id ?? ''; selectedDeviceSuspended = device.suspended ?? false; setOpenEditModal(true)}" size="sm" class="w-fit self-center px-8" :class="{ 'bg-green-500': device.suspended, 'bg-red-500': !device.suspended }" >{{ device.suspended ? 'Restore' : 'Suspend' }}</UiButton>
                </div>
                </UiPermissionGuard>
              </div>
              <UiAccordionTrigger class="ml-auto" />
            </div>
          </div>

          <UiAccordionContent class="px-4 pb-4">
            <div
              class="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-4 border-t"
            >
              <div>
                <p class="text-sm text-muted-foreground">Device ID</p>
                <p class="font-medium">{{ device.deviceId || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Device Name</p>
                <p class="font-medium">{{ device.deviceName || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Device Type</p>
                <p class="font-medium">
                  {{ device.deviceType || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">OS Version</p>
                <p class="font-medium">
                  {{ device.osVersion || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Country</p>
                <p class="font-medium">
                  {{ device.country || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">City</p>
                <p class="font-medium">
                  {{ device.city || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">State</p>
                <p class="font-medium">
                  {{ device.state || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Time Zone</p>
                <p class="font-medium">
                  {{ device.timeZone || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">ISP</p>
                <p class="font-medium">
                  {{ device.isp || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">IP Address</p>
                <p class="font-medium">
                  {{ device.ipAddress || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Locale</p>
                <p class="font-medium">
                  {{ device.locale || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">User Agent</p>
                <p class="font-medium">
                  {{ device.userAgent || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Request Source</p>
                <p class="font-medium">
                  {{ device.requestSource || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">App Version</p>
                <p class="font-medium">
                  {{ device.appVersion || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Platform</p>
                <p class="font-medium">
                  {{ device.platform || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">OS Family</p>
                <p class="font-medium">
                  {{ device.osFamily || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Device Family</p>
                <p class="font-medium">
                  {{ device.deviceFamily || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">User Agent Family</p>
                <p class="font-medium">
                  {{ device.userAgentFamily || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Created By</p>
                <p class="font-medium">
                  {{ device.createdBy || '-' }}
                </p>
              </div>

              <div>
                <p class="text-sm text-muted-foreground">Created Date</p>
                <p class="font-medium">
                  {{ device.createdDate ? new Date(device.createdDate).toLocaleDateString() : '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Last Modified By</p>
                <p class="font-medium">
                  {{ device.lastModifiedBy || '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Last Modified Date</p>
                <p class="font-medium">
                  {{ device.lastModifiedDate ? new Date(device.lastModifiedDate).toLocaleDateString() : '-' }}
                </p>
              </div>
            </div>
          </UiAccordionContent>
        </UiAccordionItem>
      </UiAccordion>
      <!-- </div> -->
      <!-- <UiButton class="w-fit self-end px-8">UnLink</UiButton> -->
    </UiCard>

    <UiCard
      v-else-if="data && data.length === 0 && !loading && !isError"
      class="w-full p-6 text-center"
    >
      <p class="text-muted-foreground">No devices found for this user</p>
    </UiCard>
    <div v-if="isError && !loading">
    <ErrorMessage :retry="fetchDevices" title="Something went wrong." />
  </div>
  </div>

  <UiAlertDialog :open="openEditModal" :onOpenChange="setOpenEditModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This will {{ selectedDeviceSuspended ? 'restore' : 'suspend' }} the device.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="manageDevice()">
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
