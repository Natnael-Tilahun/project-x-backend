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

const { importIntegration } = useIntegrations();

const submitting = ref(false);
const isError = ref(false);
const fileInputKey = ref(0); // For resetting file input
const fileData = ref(null);

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
  
  try {
    // Read the file content
    const text = await file.text();
    const jsonData = JSON.parse(text);
    fileData.value = jsonData;
    
    // Set the file in the form
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

const onSubmit = form.handleSubmit(async (values: any) => {
  if (!fileData.value) {
    toast({
      title: "Error",
      description: "Please select a valid JSON file",
      variant: "destructive"
    });
    return;
  }

  try {
    submitting.value = true;
    isError.value = false;

    console.log("file data: ", fileData.value)

    // Here you would typically send the fileData.value to your API
    // const updatedApiIntegration = await importIntegration(
    //   fileData.value
    // );

    toast({
      title: "Api Integration Imported",
      description: "Api integration imported successfully",
    });

    // Reset form and file input
    form.resetForm();
    fileInputKey.value++;
    fileData.value = null;

    // Emit refresh event after successful update
    emit("refresh");
  } catch (err: any) {
    console.error("Error importing api integration:", err);
    isError.value = true;
    toast({
      title: "Error",
      description: "Failed to import integration data",
      variant: "destructive"
    });
  } finally {
    submitting.value = false;
  }
});
</script>

<template>
  <UiSheet>
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2">Import Api Integration</UiSheetTitle>
      <UiSheetDescription class="py-4 space-y-4">
        <div class="flex flex-col gap-6 items-center">
          <UiCard class="w-full p-6">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6 w-full">
                <FormField name="uploadFile">
                  <FormItem>
                    <FormLabel>Upload Integration Data (JSON)</FormLabel>
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
                    :disabled="submitting"
                    variant="outline"
                    type="button"
                    @click="emit('closeImportDialog')"
                  >
                    Cancel
                  </UiButton>
                  <UiButton :disabled="submitting" type="submit">
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="submitting"
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
</template>

<style lang="css" scoped></style>
