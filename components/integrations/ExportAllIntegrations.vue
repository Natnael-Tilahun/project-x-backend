<script setup lang="ts">
import { toast } from "../ui/toast";
const isError = ref(false);
const openExportModal = ref(false);
const isDownloading = ref(false);


const setOpenExportModal = (value: boolean) => {
  openExportModal.value = value;
};

async function exportAllIntegrationHandler() {
  isDownloading.value = true;
  isError.value = false;
  try {
    const runtimeConfig = useRuntimeConfig();
    const { getHeaders } = useApi();

    const response = await fetch(
      `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/api-integrations/export-all`,
      {
        method: "GET",
        headers: getHeaders(true),
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    const filename = "exported_all_integrations.json";

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "All Integrations exported successfully",
    });
  } catch (err) {
    isError.value = true;
    toast({
      title: "Error exporting all integrations",
      description: err instanceof Error ? err.message : "Unknown error",
      variant: "destructive",
    });
  } finally {
    isDownloading.value = false;
    setOpenExportModal(false);
  }
}

</script>

<template>
  <UiButton
    @click="setOpenExportModal(true)"
    class="self-end"
    :disabled="isDownloading"
    type="submit"
  >
    <Icon
      name="svg-spinners:8-dots-rotate"
      v-if="isDownloading"
      class="mr-2 h-4 w-4 animate-spin"
    ></Icon>

    Export All Integration
  </UiButton>

  <UiAlertDialog :open="openExportModal" :onOpenChange="setOpenExportModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle
          >This will export all integrations. Are you absolutely
          sure?</UiAlertDialogTitle
        >
        <UiAlertDialogDescription>
          This action cannot be undone. This will export all the integration
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
