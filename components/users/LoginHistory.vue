<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { formatDistanceToNow } from "date-fns";
import { ref } from "vue";
import { DeviceStatus } from "~/global-types";
import { getIdFromPath } from "~/lib/utils";
import type { Device, LoginHistory } from "~/types";

const {
  getUserDevices,
  getUsersLoginHistory,
  isLoading,
} = useUsers();

const deviceData = ref<Device[]>();
const loginHistoryData = ref<LoginHistory[]>();
const loading = ref(isLoading.value);
const isError = ref(false);
const selectedDevice = ref<Device>()
const customerId = ref<string>();
const route = useRoute();
// Update the interface to match the actual data structure
customerId.value = getIdFromPath(route.path);
const deviceId = ref<string>("");

const handleDeviceSelect = (deviceId: string) => {
  selectedDevice.value = deviceData.value?.filter(device => device.deviceId == deviceId)[0]
};

const isDeviceSelected = (device: string) => {
  return selectedDevice.value?.deviceId === deviceId;
};

const fetchDevices = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    deviceData.value = await getUserDevices(customerId.value as string); // Call your API function to fetch roles
  } catch (err) {
    console.error("Error fetching devices:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const fetchLoginHistories = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    loginHistoryData.value = await getUsersLoginHistory(customerId.value as string,
    {
      page: 0,
      size: 20,
      sort: ["lastModifiedDate,desc"]
    }
    ); // Call your API function to fetch roles
  } catch (err) {
    console.error("Error fetching lgoin histories:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

onMounted(() => {
  fetchDevices();
  fetchLoginHistories()
});

</script>

<template>
  <div class="flex flex-col space-y-8">
    <UiCard class="grid lg:grid-cols-4 gap-4 md:gap-8 w-full p-6" v-if="loading">
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

    <UiCard v-if="loginHistoryData && loginHistoryData.length > 0 && !loading && !isError"
      class="w-full flex flex-col gap-4 p-6">
      <!-- <div class="p-6"> -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Login Histories</h2>
      </div>

      <UiAccordion type="single" collapsible v-model:value="openItems">
        <UiAccordionItem v-for="(device, index) in loginHistoryData" :key="device.deviceId" :value="`item-${index + 1}`"
          class="border rounded-lg mb-4 data-[state=open]:bg-muted/50">
          <div class="flex items-center px-4 hover:bg-muted/50 cursor-pointer transition-colors"
            :class="{ 'bg-muted/50': isDeviceSelected(device?.deviceId) }"
            @click.stop="handleDeviceSelect(device?.deviceId)">
            <div class="w-full">
              <UiAccordionTrigger
                class="hover:no-underline grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-center w-full">
                <!-- Equal width columns -->
                <div class="flex flex-col gap-1 items-start min-w-0">
                  <p class="text-sm text-muted-foreground">Device ID</p>
                  <p class="font-medium truncate text-sm text-left">
                    {{ device.deviceId || "-" }}
                  </p>
                </div>
                <div class="flex flex-col gap-1 items-start min-w-0 ">
                  <p class="text-sm text-muted-foreground">Login From</p>
                  <p class="font-medium text-sm text-left ">
                    {{ device.userAgent || "-" }}
                  </p>
                </div>
                <div class="flex flex-col gap-1 items-start min-w-0">
                  <p class="text-sm text-muted-foreground">Last Login Time</p>
                  <p class="font-medium text-sm text-left">
                    {{ device?.lastModifiedDate
                      ? new Date(device.lastModifiedDate).toLocaleString('en-US', {
                        // weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      })
                    : "-" }}
                                        ( {{ formatDistanceToNow(new Date(device?.lastModifiedDate), { addSuffix: true }) }} )

                  </p>
                </div>
                <div class="flex flex-col gap-1 items-start min-w-0">
                  <p class="text-sm text-muted-foreground">Login Expired Time</p>
                  <p class="font-medium text-sm text-left">
                    {{ device?.expires
                      ? new Date(device.expires).toLocaleString('en-US', {
                        // weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      })
                    : "-" }}
                  </p>
                </div>
              </UiAccordionTrigger>
            </div>
          </div>

          <UiAccordionContent class="px-0 pb-4">
            <div v-if="selectedDevice" class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 px-8 py-4 border-t">
              <div>
                <p class="text-sm text-muted-foreground">Device ID</p>
                <p class="font-medium text-wrap">
                  {{ selectedDevice?.deviceId || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">ID</p>
                <p class="font-medium text-wrap">
                  {{ selectedDevice.id || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Device Name</p>
                <p class="font-medium w-full break-words whitespace-normal">
                  {{ selectedDevice.deviceName || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Device Type</p>
                <p class="font-medium">
                  {{ selectedDevice.deviceType || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">OS Version</p>
                <p class="font-medium">
                  {{ selectedDevice.osVersion || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Country</p>
                <p class="font-medium">
                  {{ selectedDevice.country || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">City</p>
                <p class="font-medium">
                  {{ selectedDevice.city || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">State</p>
                <p class="font-medium">
                  {{ selectedDevice.state || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Time Zone</p>
                <p class="font-medium">
                  {{ selectedDevice.timeZone || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">ISP</p>
                <p class="font-medium">
                  {{ selectedDevice.isp || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">IP Address</p>
                <p class="font-medium">
                  {{ selectedDevice.ipAddress || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Locale</p>
                <p class="font-medium">
                  {{ selectedDevice.locale || "-" }}
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
                  {{ selectedDevice.requestSource || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">App Version</p>
                <p class="font-medium">
                  {{ selectedDevice.appVersion || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Platform</p>
                <p class="font-medium">
                  {{ selectedDevice.platform || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">OS Family</p>
                <p class="font-medium">
                  {{ selectedDevice.osFamily || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Device Family</p>
                <p class="font-medium">
                  {{ selectedDevice.deviceFamily || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">User Agent Family</p>
                <p class="font-medium">
                  {{ selectedDevice.userAgentFamily || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Created By</p>
                <p class="font-medium">
                  {{ selectedDevice.createdBy || "-" }}
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
                  {{ selectedDevice.lastModifiedBy || "-" }}
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
                  {{ selectedDevice.applicationName || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Application Id</p>
                <p class="font-medium text-wrap">
                  {{ selectedDevice.applicationId || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">
                  application Version Id
                </p>
                <p class="font-medium text-wrap">
                  {{ selectedDevice.applicationVersionId || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Package Name</p>
                <p class="font-medium text-wrap">
                  {{ selectedDevice.packageName || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Version Number</p>
                <p class="font-medium">
                  {{ selectedDevice.versionNumber || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Build Number</p>
                <p class="font-medium">
                  {{ selectedDevice.buildNumber || "-" }}
                </p>
              </div>
              <div class="flex-col items-start w-full flex-wrap">
                <p class="text-sm text-muted-foreground">Build Signature</p>
                <p class="font-medium w-full break-words whitespace-normal">
                  {{ selectedDevice.buildSignature || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Installer Store</p>
                <p class="font-medium text-wrap">
                  {{ selectedDevice.installerStore || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Install Time</p>
                <p class="font-medium">
                  {{ selectedDevice.installTime || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Last Update Time</p>
                <p class="font-medium">
                  {{ selectedDevice.lastUpdateTime || "-" }}
                </p>
              </div>
            </div>
            <div class="p-4 text-center border-t text-muted-foreground" v-else>
              No device detail to be shown
            </div>
          </UiAccordionContent>
        </UiAccordionItem>
      </UiAccordion>
    </UiCard>

    <UiCard v-else-if="loginHistoryData && loginHistoryData.length === 0 && !loading && !isError"
      class="w-full p-6 text-center">
      <p class="text-muted-foreground">No login history found for this staff</p>
    </UiCard>
    <div v-if="isError && !loading">
      <ErrorMessage :retry="fetchDevices" title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
