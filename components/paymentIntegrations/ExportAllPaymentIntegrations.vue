<script setup lang="ts">
import axios from "axios";
import { toast } from "../ui/toast";
import type { AxiosProgressEvent } from "axios";

const isError = ref(false);
const openExportModal = ref(false);
const isDownloading = ref(false);
const isImporting = ref(false);
const importProgress = ref(0); // Progress percentage (0-100)


const setOpenExportModal = (value: boolean) => {
  openExportModal.value = value;
};

async function exportAllIntegrationHandler() {
  isDownloading.value = true;
  isError.value = false;
  isImporting.value = true;
  isError.value = false;
  importProgress.value = 0;
  try {
    const runtimeConfig = useRuntimeConfig();
    const { getHeaders } = useApi();

    const response = await axios.get(
      `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-integrations/export-all`,
      {
        headers: {
          ...getHeaders(true),
          'Content-Type': 'multipart/form-data'
        },
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total && progressEvent.loaded) {
            importProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          }
        },
        responseType: 'blob'
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    const filename = "exported_all_payment_integrations.json";

    const blob = response.data;
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "All Payment Integrations exported successfully",
    });
  } catch (err) {
    isError.value = true;
    toast({
      title: "Error exporting all payment integrations",
      description: err instanceof Error ? err.message : "Unknown error",
      variant: "destructive",
    });
  } finally {
    isDownloading.value = false;
    isImporting.value = false;
    setOpenExportModal(false);
  }
}

</script>

<template>
  <UiButton
    @click="setOpenExportModal(true)"
    :disabled="isDownloading"
    type="submit"
  >
    <Icon
      name="svg-spinners:8-dots-rotate"
      v-if="isDownloading"
      class="mr-2 h-4 w-4 animate-spin"
    ></Icon>

    Export All Payment Integration
  </UiButton>

  <UiAlertDialog :open="openExportModal" :onOpenChange="setOpenExportModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiProgress
          class="rounded-full"
          v-if="isImporting"
          :model-value="isImporting ? importProgress : 0"
          :max="100"
        />
        <div v-if="isImporting" class="text-center mt-2">
          {{ importProgress }}%
        </div>
        <UiAlertDialogTitle
          >This will export all payement integrations. Are you absolutely
          sure?</UiAlertDialogTitle
        >
        <UiAlertDialogDescription>
          This action cannot be undone. This will export all the payment integration
          data and download it to your file system.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenExportModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="exportAllIntegrationHandler()">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isDownloading"
            :disabled="isDownloading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
