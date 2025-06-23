<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { toast } from "~/components/ui/toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const { importMenus } = useMenus();

const isImporting = ref(false);
const isError = ref(false);
const fileInputKey = ref(0); // For resetting file input
const fileData = ref(null);
const selectedFile = ref<File | null>(null);
const openExportModal = ref(false);
const importProgress = ref(0); // Progress percentage (0-100)


const setOpenExportModal = (value: boolean) => {
  openExportModal.value = value;
};

// Define validation schema for the form
const validationSchema = {
  uploadFile: (value: File) => {
    if (!value) return 'File is required';
    if (value.type !== 'application/json') return 'Only JSON files are allowed';
    return true;
  }
};

const form = useForm({
  validationSchema,
});

// Add emits definition
const emit = defineEmits(["refresh", "closeImportDialog"]);

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  selectedFile.value = file; // Store the file

  try {
    const text = await file.text();
    const jsonData = JSON.parse(text);
    fileData.value = jsonData;
    form.setFieldValue('uploadFile', file);
  } catch (error) {
    console.error('Error reading file:', error);
    toast({
      title: "Error",
      description: "Invalid JSON file format",
      variant: "destructive"
    });
    // Reset the file input
    fileInputKey.value++;
  }
};

// Separate the import logic from the form validation
const doImport = async () => {
  if (!selectedFile.value) {
    toast({
      title: "Error",
      description: "Please select a valid JSON file",
      variant: "destructive"
    });
    return;
  }

  try {
    isImporting.value = true;
    isError.value = false;
    importProgress.value = 0;

    const formData = new FormData();
    formData.append('file', selectedFile.value);

    await importMenus(formData,
    {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        if (progressEvent.lengthComputable) {
          importProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      }
    }
    );

    toast({
      title: "Menus Imported",
      description: "Menus imported successfully",
    });

    form.resetForm();
    fileInputKey.value++;
    fileData.value = null;
    selectedFile.value = null;
    importProgress.value = 0;

    emit("refresh");
    emit("closeImportDialog")
    setOpenExportModal(false); // Close dialog after import
  } catch (err: any) {
    console.error("Error importing menus:", err);
    isError.value = true;
    toast({
      title: "Error",
      description: "Failed to import menus data",
      variant: "destructive"
    });
    isImporting.value = false;
  } finally {
    isImporting.value = false;
  }
};

// This runs validation and opens the dialog if valid
const handleImportClick = async () => {
  const isValid = await form.validate();
  if (isValid.valid) {
    setOpenExportModal(true);
  }
};
</script>

<template>
  <UiSheet>
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2">Import Menus</UiSheetTitle>
      <UiSheetDescription class="py-4 space-y-4">
        <div class="flex flex-col gap-6 items-center">
          <UiCard class="w-full p-6">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6 w-full">
                <FormField name="uploadFile">
                  <FormItem>
                    <FormLabel>Upload Menus Data (JSON)</FormLabel>
                    <FormControl>
                      <UiInput
                        :key="fileInputKey"
                        class="w-full"
                        type="file"
                        accept=".json"
                        @change="handleFileSelect"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <div class="col-span-full w-full py-4 flex justify-between">
                  <UiButton
                    :disabled="isImporting"
                    variant="outline"
                    type="button"
                    @click="emit('closeImportDialog')"
                  >
                    Cancel
                  </UiButton>
                  <UiButton
                    type="button"
                    :disabled="isImporting"
                    @click="handleImportClick"
                  >
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="isImporting"
                      class="mr-2 h-4 w-4 animate-spin"
                    />
                    Import
                  </UiButton>
                </div>
              </div>
            </form>
          </UiCard>
        </div>
      </UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>

  <UiAlertDialog :open="openExportModal" :onOpenChange="setOpenExportModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader class="relative">

     <div v-if="isImporting" class="absolute top-[0%] flex flex-col justify-center w-full h-full">
        <UiProgress
          class="rounded-full w-full bg-gray-200"
          :model-value="isImporting ? importProgress : 0"
          :max="100"
        />
        <div  class="text-center mt-2">
          {{ importProgress }}%
        </div>
        </div>        <UiAlertDialogTitle
          >This will import the menus. Are you absolutely
          sure?</UiAlertDialogTitle
        >
        <UiAlertDialogDescription>
          This action cannot be undone. This will import the menus
          data and save it to the menus.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenExportModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="doImport" :disabled="isImporting">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isImporting"
            :disabled="isImporting"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<style lang="css" scoped></style>
