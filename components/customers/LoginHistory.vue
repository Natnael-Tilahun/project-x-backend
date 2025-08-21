<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { formatDistanceToNow } from "date-fns";
import { ref } from "vue";
import { DeviceStatus } from "~/global-types";
import { getIdFromPath } from "~/lib/utils";
import type { Device, LoginHistory } from "~/types";

const {
  getCustomerDevices,
  getCustomerLoginHistory,
} = useCustomers();

const deviceData = ref<Device[]>();
const loginHistoryData = ref<LoginHistory[]>();
const loading = ref(false);
const isError = ref(false);
const selectedDevice = ref<Device>()
const customerId = ref<string>();
const route = useRoute();
// Update the interface to match the actual data structure
customerId.value = getIdFromPath();
const deviceId = ref<string>("");

const handleDeviceSelect = (deviceId: string) => {
  selectedDevice.value = deviceData.value?.filter(device => device.deviceId == deviceId)[0]
};

const isDeviceSelected = (device: string) => {
  return selectedDevice.value?.deviceId === deviceId;
};

const fetchDevices = async () => {
  try {
    loading.value = true;
    deviceData.value = await getCustomerDevices(customerId.value as string); // Call your API function to fetch roles
  } catch (err) {
    console.error("Error fetching devices:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const fetchLoginHistories = async () => {
  try {
    loading.value = true;
    const response = await getCustomerLoginHistory(customerId.value as string, {
      page: 0,
      size: 20,
      sort: ["lastModifiedDate,desc"]
    }); // Call your API function to fetch roles
    loginHistoryData.value = response
  } catch (err) {
    console.error("Error fetching lgoin histories:", err);
    isError.value = true;
  } finally {
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
        <UiAccordionItem v-for="(history, index) in loginHistoryData" :key="history.deviceId" :value="`item-${index + 1}`"
          class="border rounded-lg mb-4 data-[state=open]:bg-muted/50">
          <div class="flex items-center px-4 hover:bg-muted/50 cursor-pointer transition-colors"
            :class="{ 'bg-muted/50': isDeviceSelected(history?.deviceId) }"
            @click.stop="handleDeviceSelect(history?.deviceId)">

            <div class="w-full" ref="parent">
              <UiAccordionTrigger
                class="hover:no-underline grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-center w-full">
                <!-- Equal width columns -->
                <div class="flex flex-col gap-1 items-start min-w-0">
                  <p class="text-sm text-muted-foreground">Device ID</p>
                  <p class="font-medium text-sm text-left">
                    {{ history.deviceId || "-" }}
                  </p>
                </div>
                <div class="flex flex-col gap-1 items-start min-w-0">
                  <p class="text-sm text-muted-foreground">Login From</p>
                  <p class="font-medium text-sm text-left ">
                    {{ history.userAgent || "-" }}
                  </p>
                </div>
                <div class="flex flex-col gap-1 items-start min-w-0">
                  <p class="text-sm text-muted-foreground">Last Login Time</p>
                  <p class="font-medium text-sm text-left">
                    {{
                      history?.lastModifiedDate
                        ? new Date(history.lastModifiedDate).toLocaleString('en-US', {
                          // weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })
                        : "-"
                    }}
                    ( {{ formatDistanceToNow(new Date(history?.lastModifiedDate), { addSuffix: true }) }} )
                  </p>
                </div>
                <div class="flex flex-col gap-1 items-start min-w-0">
                  <p class="text-sm text-muted-foreground">Login Expired Time</p>
                  <p class="font-medium text-sm text-left">
                    {{
                      history?.lastModifiedDate
                        ? new Date(history.lastModifiedDate).toLocaleString('en-US', {
                          // weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })
                        : "-"
                    }}
                    ( {{ formatDistanceToNow(new Date(history?.lastModifiedDate), { addSuffix: true }) }} )
                  </p>
                </div>
              </UiAccordionTrigger>
            </div>
          </div>

          <UiAccordionContent class="px-0 pb-4">
            <div  class="grid grid-cols-2 md:grid-cols-4 gap-y-4 px-4 py-4 border-t">
              <div>
                <p class="text-sm text-muted-foreground">Device ID</p>
                <p class="font-medium text-wrap">
                  {{ history?.deviceId || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Country</p>
                <p class="font-medium w-full break-words whitespace-normal">
                  {{ history.country || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">City</p>
                <p class="font-medium">
                  {{ history.city || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">State</p>
                <p class="font-medium">
                  {{ history.state || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Time Zone</p>
                <p class="font-medium">
                  {{ history.timeZone || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">ISP</p>
                <p class="font-medium">
                  {{ history.isp || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">IP Address</p>
                <p class="font-medium">
                  {{ history.ipAddress || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Locale</p>
                <p class="font-medium">
                  {{ history.locale || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Created Date</p>
                <p class="font-medium">
                  {{
                      history?.createdDate
                        ? new Date(history.createdDate).toLocaleString('en-US', {
                          // weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })
                        : "-"
                    }}
                    ( {{ formatDistanceToNow(new Date(history?.createdDate), { addSuffix: true }) }} )
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Last Modified Date</p>
                <p class="font-medium">
                  {{
                      history?.lastModifiedDate
                        ? new Date(history.lastModifiedDate).toLocaleString('en-US', {
                          // weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })
                        : "-"
                    }}
                    ( {{ formatDistanceToNow(new Date(history?.lastModifiedDate), { addSuffix: true }) }} )
                </p>
              </div>
 
              <div>
                <p class="text-sm text-muted-foreground">Used</p>
                <p class="font-medium">
                  {{ history.used || "-" }}
                </p>
              </div>
            </div>
          </UiAccordionContent>
        </UiAccordionItem>
      </UiAccordion>
    </UiCard>

    <UiCard v-else-if="loginHistoryData && loginHistoryData.length === 0 && !loading && !isError"
      class="w-full p-6 text-center">
      <p class="text-muted-foreground">No login history found for this customer</p>
    </UiCard>
    <div v-if="isError && !loading">
      <ErrorMessage :retry="fetchDevices" title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
