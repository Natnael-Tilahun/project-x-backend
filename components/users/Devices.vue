<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { DeviceStatus } from "~/global-types";
import { getIdFromPath } from "~/lib/utils";
import type { Device } from "~/types";

const {
  getUserDevices,
  suspendDevicesByDeviceId,
  restoreDevicesByDeviceId,
  isLoading,
} = useUsers();

const data = ref<Device[]>();
const loading = ref(isLoading.value);
const isError = ref(false);
const selectedDevices = ref<Device[]>([]);
const customerId = ref<string>();
const route = useRoute();
// Update the interface to match the actual data structure
customerId.value = getIdFromPath(route.fullPath);
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};
const selectedDeviceSuspended = ref("");
const deviceId = ref<string>("");

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
  return selectedDevices.value.some((a) => a.deviceId === device.deviceId);
};

const fetchDevices = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value = await getUserDevices(customerId.value as string); // Call your API function to fetch roles
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
    if (selectedDeviceSuspended.value == DeviceStatus.SUSPENDED) {
      await restoreDevicesByDeviceId(
        customerId.value as string,
        deviceId.value
      );
    } else {
      await suspendDevicesByDeviceId(
        customerId.value as string,
        deviceId.value
      );
    }
    fetchDevices();
    toast({
      title: selectedDeviceSuspended.value == DeviceStatus.SUSPENDED
        ? "Device restored"
        : "Device suspended",
      description: selectedDeviceSuspended.value == DeviceStatus.SUSPENDED
        ? "The device has been restored"
        : "The device has been suspended",
      variant: "default",
    });
  } catch (err) {
    console.error("Error suspending device:", err);
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
            class="flex items-center px-6 hover:bg-muted/50 cursor-pointer transition-colors"
            :class="{ 'bg-muted/50': isDeviceSelected(device) }"
            @click.stop="handleDeviceSelect(device)"
          >
          <div class="w-full" ref="parent">
            <UiAccordionTrigger 
            class="hover:no-underline grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center w-full">
                <div class="flex flex-col gap-1 items-start">
                  <p class="text-sm text-muted-foreground">Device ID</p>
                  <p
                    class="font-medium text-sm text-left"
                  >
                    {{ device.deviceId }}
                  </p>
                </div>
                <div class="flex flex-col gap-1 items-center">
                  <p class="text-sm text-muted-foreground">Device Name</p>
                  <p
                    class="font-medium text-sm"
                  >
                    {{ device.deviceName }}
                  </p>
                </div>
                <div class="flex flex-col gap-1 items-center">
                  <p class="text-sm text-muted-foreground">Device Type</p>
                  <p
                    class="font-medium text-sm"
                  >
                    {{ device.deviceType }}
                  </p>
                </div>
                <div class="flex flex-col gap-1 items-center">
                  <p class="text-sm text-muted-foreground">OS Version</p>
                  <p class="font-medium text-sm">
                    {{ device.osVersion }}
                  </p>
                </div>
                <div class="flex flex-col gap-1 items-center">
                  <p class="text-sm text-muted-foreground">Status</p>
                  <UiBadge
                    class="font-medium"
                    :class="{
                      'bg-red-500': device.deviceStatus === DeviceStatus.SUSPENDED,
                      'bg-green-500': device.deviceStatus === DeviceStatus.ACTIVE,
                      'bg-orange-500': device.deviceStatus === DeviceStatus.INACTIVE,
                      'bg-gray-300': device.deviceStatus === DeviceStatus.UNENEOLLED || device.deviceStatus === DeviceStatus.NEW || device.deviceStatus === DeviceStatus.PENDING || device.deviceStatus === DeviceStatus.NONE,
                    }"
                  >
                    {{ device.deviceStatus }}
                  </UiBadge>
                </div>
                <UiPermissionGuard
                  :permission="
                    device.deviceStatus === DeviceStatus.SUSPENDED
                      ? 'RESTORE_CUSTOMER_DEVICE'
                      : 'SUSPEND_CUSTOMER_DEVICE'
                  "
                >
                  <div class="flex items-start">
                    <UiButton
                      @click.stop="
                        () => {
                          deviceId = device.id ?? '';
                          selectedDeviceSuspended = device.deviceStatus || '';
                          setOpenEditModal(true);
                        }
                      "
                      size="sm"
                      class="w-fit self-center px-4"
                      :class="{
                        'bg-green-500': device.deviceStatus === DeviceStatus.SUSPENDED,
                        'bg-red-500': device.deviceStatus === DeviceStatus.ACTIVE || device.deviceStatus === DeviceStatus.INACTIVE || device.deviceStatus === DeviceStatus.UNENEOLLED || device.deviceStatus === DeviceStatus.NEW || device.deviceStatus === DeviceStatus.PENDING || device.deviceStatus === DeviceStatus.NONE,
                      }"
                      >{{ device.deviceStatus === DeviceStatus.SUSPENDED ? "Restore" : "Suspend" }}
                    </UiButton>
                  </div>
                </UiPermissionGuard>
            </UiAccordionTrigger>
            </div>
          </div>

          <UiAccordionContent class="px-0 pb-4">
            <div
              class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 px-8 py-4 border-t"
            >
              <div>
                <p class="text-sm text-muted-foreground">Device ID</p>
                <p class="font-medium text-wrap">
                  {{ device.deviceId || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">ID</p>
                <p class="font-medium text-wrap">
                  {{ device.id || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Device Name</p>
                <p class="font-medium w-full break-words whitespace-normal">
                  {{ device.deviceName || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Device Type</p>
                <p class="font-medium">
                  {{ device.deviceType || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">OS Version</p>
                <p class="font-medium">
                  {{ device.osVersion || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Country</p>
                <p class="font-medium">
                  {{ device.country || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">City</p>
                <p class="font-medium">
                  {{ device.city || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">State</p>
                <p class="font-medium">
                  {{ device.state || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Time Zone</p>
                <p class="font-medium">
                  {{ device.timeZone || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">ISP</p>
                <p class="font-medium">
                  {{ device.isp || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">IP Address</p>
                <p class="font-medium">
                  {{ device.ipAddress || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Locale</p>
                <p class="font-medium">
                  {{ device.locale || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">User Agent</p>
                <p class="font-medium">
                  {{ device.userAgent || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Request Source</p>
                <p class="font-medium">
                  {{ device.requestSource || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">App Version</p>
                <p class="font-medium">
                  {{ device.appVersion || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Platform</p>
                <p class="font-medium">
                  {{ device.platform || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">OS Family</p>
                <p class="font-medium">
                  {{ device.osFamily || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Device Family</p>
                <p class="font-medium">
                  {{ device.deviceFamily || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">User Agent Family</p>
                <p class="font-medium">
                  {{ device.userAgentFamily || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Created By</p>
                <p class="font-medium">
                  {{ device.createdBy || "-" }}
                </p>
              </div>

              <div>
                <p class="text-sm text-muted-foreground">Initial Login Date</p>
                <p class="font-medium">
                  {{
                    device.createdDate
                      ? new Date(device.createdDate).toLocaleDateString()
                      : "-"
                  }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Last Modified By</p>
                <p class="font-medium">
                  {{ device.lastModifiedBy || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Last Login Date</p>
                <p class="font-medium">
                  {{
                    device.lastModifiedDate
                      ? new Date(device.lastModifiedDate).toLocaleDateString()
                      : "-"
                  }}
                </p>
              </div>

              <div>
                <p class="text-sm text-muted-foreground">Application Name</p>
                <p class="font-medium">
                  {{ device.applicationName || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Application Id</p>
                <p class="font-medium text-wrap">
                  {{ device.applicationId || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">
                  application Version Id
                </p>
                <p class="font-medium text-wrap">
                  {{ device.applicationVersionId || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Package Name</p>
                <p class="font-medium text-wrap">
                  {{ device.packageName || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Version Number</p>
                <p class="font-medium">
                  {{ device.versionNumber || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Build Number</p>
                <p class="font-medium">
                  {{ device.buildNumber || "-" }}
                </p>
              </div>
              <div class="flex-col items-start w-full flex-wrap">
                <p class="text-sm text-muted-foreground">Build Signature</p>
                <p class="font-medium w-full break-words whitespace-normal">
                  {{ device.buildSignature || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Installer Store</p>
                <p class="font-medium text-wrap">
                  {{ device.installerStore || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Install Time</p>
                <p class="font-medium">
                  {{ device.installTime || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Last Update Time</p>
                <p class="font-medium">
                  {{ device.lastUpdateTime || "-" }}
                </p>
              </div>
            </div>
          </UiAccordionContent>
        </UiAccordionItem>
      </UiAccordion>
    </UiCard>

    <UiCard
      v-else-if="data && data.length === 0 && !loading && !isError"
      class="w-full p-6 text-center"
    >
      <p class="text-muted-foreground">No devices found for this customer</p>
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
          This will {{ selectedDeviceSuspended == DeviceStatus.SUSPENDED ? "restore" : "suspend" }} the
          device.
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
