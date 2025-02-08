<script lang="ts" setup>
const openItems = ref(["item-1"]);
import { watch, onBeforeUnmount } from "vue"; // Import watch and onBeforeUnmount from Vue
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { menuFormSchema } from "~/validations/menuFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { MenuLayoutType, PaginationType, SystemMenuType } from "@/global-types";
import { useDocuments } from "~/composables/useDocuments";
import IconPicker from "~/components/IconPicker.vue";

const route = useRoute();
const { getMenuById, getMenus, updateMenu, isLoading, isSubmitting } =
  useMenus();
const { getPaymentIntegrations } = usePaymentIntegrations();
const { uploadFile, getFile } = useDocuments(); // Get the upload function

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const menuId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const allPaymentIntegrations = ref<PaymentIntegration[]>([]);
const allMenus = ref<Menu[]>([]);
const selectedDynamicPaymentMenus = ref<PaymentIntegration[]>([]);
const selectedChildren = ref<Menu[]>([]);
const isError = ref(false);
const data = ref<Menu>();
// Add this ref for the preview
const imagePreview = ref(null);
const selectedFile = ref(null);
const uploadLoading = ref(false);

// Add a ref for the file input
const fileInput = ref(null);

const fileInputKey = ref(0); // Add this ref for forcing input recreation

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
menuId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: menuFormSchema,
});

const getMenuDetails = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value = await getMenuById(menuId.value);
    console.log("muenu data.value: ", data.value);
    if (data.value?.iconPath && data.value.isImage) {
      await getUploadedImage(data.value?.iconPath);
    }
    selectedDynamicPaymentMenus.value = data.value?.dynamicPaymentMenus || [];
    selectedChildren.value = data.value?.children || [];
    form.setValues(data.value);
  } catch (err) {
    console.error("Error fetching menu:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const getPaymentIntegrationData = async () => {
  try {
    allPaymentIntegrations.value = await getPaymentIntegrations(0, 1000);
  } catch (err) {
    console.error("Error fetching payment integrations:", err);
  }
};

const getMenusData = async () => {
  try {
    allMenus.value = await getMenus(0, 1000);
  } catch (err) {
    console.error("Error fetching menus:", err);
  }
};

// onMounted(async () => {
//   getPaymentIntegrationData();
//   getMenusData();
// });

await useAsyncData("paymentIntegrations", () => {
  getMenuDetails();
  getPaymentIntegrationData();
  getMenusData();
});

const refetch = async () => {
  await getPaymentIntegrationData();
  await getMenuDetails();
  await getMenusData();
};

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const updatedValues = {
      ...values,
      dynamicPaymentMenus:
        Array.isArray(values.dynamicPaymentMenus) &&
        typeof values.dynamicPaymentMenus[0] === "string"
          ? values.dynamicPaymentMenus.map((menu: string) => ({ id: menu }))
          : values.dynamicPaymentMenus,
      children:
        Array.isArray(values.children) && typeof values.children[0] === "string"
          ? values.children.map((menu: string) => ({ id: menu }))
          : values.children,
    };
    data.value = await updateMenu(values.id, updatedValues); // Call your API function to fetch profile
    navigateTo(`/menuCategories/${data.value.id}`);
    toast({
      title: "Menu Updated",
      description: "Menu updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating menu:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

// Modified file selection handler
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Add upload handler
const handleUpload = async () => {
  if (!selectedFile.value) {
    toast({
      title: "No file selected",
      description: "Please select an image to upload",
      variant: "destructive",
    });
    return;
  }

  try {
    uploadLoading.value = true;
    const response = await uploadFile(selectedFile.value, menuId.value, "MENU");
    console.log("response: ", response);
    // Update the form's iconPath with the uploaded file's ID/path
    form.setFieldValue("iconPath", response.id); // Adjust according to your API response structure
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });

    // Clear the file input
    selectedFile.value = null;
  } catch (error) {
    console.error("Error uploading file:", error);
    toast({
      title: "Error",
      description: "Failed to upload image",
      variant: "destructive",
    });
  } finally {
    uploadLoading.value = false;
  }
};

const getUploadedImage = async (iconPath) => {
  try {
    const response = await getFile(iconPath, "MENU");

    // Handle blob response
    if (response instanceof Blob) {
      imagePreview.value = URL.createObjectURL(response);
    }
    // Handle base64 response
    else if (typeof response === "string" && response.startsWith("data:")) {
      imagePreview.value = response;
    }
    // Handle raw base64 (without data URI prefix)
    else if (typeof response === "string") {
      imagePreview.value = `data:image/jpeg;base64,${response}`;
    }
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

// Modify remove handler to also revoke object URL if it exists
const handleRemoveImage = () => {
  if (imagePreview.value?.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = null;
  selectedFile.value = null;
  fileInputKey.value++;
  form.setFieldValue("iconPath", ""); // Adjust according to your API response structure
};

// Clean up object URL when component is unmounted
onBeforeUnmount(() => {
  if (imagePreview.value?.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreview.value);
  }
});

// Call getUploadedImage when component mounts or when data changes
watch(
  () => data.value?.iconPath,
  (newIconPath) => {
    if (newIconPath) {
      getUploadedImage(newIconPath);
    }
  }
);
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div
      v-if="loading"
      class="py-10 flex justify-center w-full h-60 md:h-[500px] items-center"
    >
      <UiLoading />
    </div>
    <UiCard v-else-if="data && !isError" class="w-full p-6">
      <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Menu Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter menu Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="menuName">
            <FormItem>
              <FormLabel>Menu Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter menu name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="menuDescription">
            <FormItem>
              <FormLabel>Menu Description </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter menu description"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- <FormField v-slot="{ componentField }" name="iconPath">
            <FormItem>
              <FormLabel> Icon Path </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter icon path"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField> -->

          <!-- <div class="col-span-2 w-full">
              <FormField
                :model-value="data?.iconPath"
                v-slot="{ componentField }"
                name="iconPath"
              >
                <FormItem>
                  <FormLabel> Icon Path </FormLabel>
                  <FormControl>
                    <UiInput
                      v-bind="componentField"
                      type="text"
                      placeholder="Enter icon path"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div> -->
          
          
          <div
            v-if="form.values.isImage"
            class="w-full gap-2 grid grid-cols-5"
          >
            <div class="col-span-2 w-full">
              <FormField
                :model-value="data?.iconPath"
                v-slot="{ componentField }"
                name="iconPath"
              >
                <FormItem>
                  <FormLabel> Icon Path </FormLabel>
                  <FormControl>
                    <UiInput
                      v-bind="componentField"
                      type="text"
                      placeholder="Enter icon path"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="col-span-3 flex gap-2 w-full">
              <div>
                <FormField name="uploadIcon">
                  <FormItem>
                    <FormLabel> Upload Icon </FormLabel>
                    <FormControl>
                      <UiInput
                        :key="fileInputKey"
                        class="w-full"
                        type="file"
                        accept="image/*"
                        @change="handleFileSelect"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <!-- Image Preview with Remove Button -->
                <div v-if="imagePreview" class="mt-2 relative group">
                  <button
                    @click="handleRemoveImage"
                    class="group-hover:flex hidden absolute top-2 right-2 bg-red-500 rounded-lg p-1 items-center justify-center shadow-sm"
                  >
                    <Icon name="lucide:x" class="h-6 w-6 text-white" />
                  </button>
                  <img
                    :src="imagePreview"
                    alt="Preview"
                    class="w-full h-60 object-contain rounded-md border"
                  />
                </div>
              </div>
              <UiButton
                size="sm"
                type="button"
                class="self-en mt-7"
                :disabled="!selectedFile || uploadLoading"
                @click="handleUpload"
              >
                <Icon
                  v-if="uploadLoading"
                  name="svg-spinners:8-dots-rotate"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                Upload
              </UiButton>
            </div>
          </div>

          <div v-else class="w-full">
            <FormField v-slot="{ field }" name="iconPath">
              <FormItem>
                <FormLabel>Icon Path</FormLabel>
                <FormControl>
                  <IconPicker
                    :model-value="field.value"
                    @update:modelValue="field.onChange"
                    @select="field.onChange"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField v-slot="{ componentField }" name="defaultLanguageCode">
            <FormItem>
              <FormLabel> Default Language Code </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter default language code"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="menuLayoutType">
            <FormItem>
              <FormLabel> Menu Layout Type </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select a menu layout type" />
                  </UiSelectTrigger>
                </FormControl>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="item in Object.values(MenuLayoutType)"
                      :value="item"
                    >
                      {{ item }}
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="gridNumberOfColumns">
            <FormItem>
              <FormLabel> Grid Number Of Columns </FormLabel>
              <FormControl>
                <UiInput
                  type="number"
                  placeholder="Enter grid number of columns"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="sortOrder">
            <FormItem>
              <FormLabel> Sort Order </FormLabel>
              <FormControl>
                <UiInput
                  type="number"
                  placeholder="Enter sort order"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="paginationType">
            <FormItem>
              <FormLabel> Pagination Type </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select a Pagination type" />
                  </UiSelectTrigger>
                </FormControl>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="item in Object.values(PaginationType)"
                      :value="item"
                    >
                      {{ item }}
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="paginationSize">
            <FormItem>
              <FormLabel> Pagination Size </FormLabel>
              <FormControl>
                <UiInput
                  type="number"
                  placeholder="Enter pagination size"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.dynamicPaymentMenus"
            v-slot="{ componentField, errorMessage }"
            name="dynamicPaymentMenus"
          >
            <FormItem>
              <FormLabel> Product Menus </FormLabel>
              <UiPopover>
                <UiPopoverTrigger asChild>
                  <FormControl>
                    <div
                      variant="outline"
                      role="combobox"
                      class="w-full text-sm text-left border h-14 flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
                      :class="{
                        'text-muted-foreground':
                          !selectedDynamicPaymentMenus?.length,
                      }"
                    >
                      {{
                        selectedDynamicPaymentMenus?.length
                          ? selectedDynamicPaymentMenus
                              .map((integration) => integration.integrationName)
                              .join(", ")
                          : "Select product menus or payment integrations"
                      }}
                      <Icon
                        name="material-symbols:unfold-more-rounded"
                        class="ml-2 h-4 w-4 shrink-0 opacity-50"
                      ></Icon>
                    </div>
                  </FormControl>
                </UiPopoverTrigger>
                <UiPopoverContent class="w-[200px] p-0">
                  <UiCommand>
                    <UiCommandInput
                      placeholder="Search product menus or payment integrations..."
                    />
                    <UiCommandList>
                      <UiCommandEmpty>
                        No product menus or payment integrations found.
                      </UiCommandEmpty>
                      <UiCommandGroup>
                        <UiCommandItem
                          v-for="integration in allPaymentIntegrations"
                          :key="integration.id"
                          :value="integration.integrationName"
                          @select="
                            () => {
                              const isSelected =
                                selectedDynamicPaymentMenus.some(
                                  (selected) => selected.id === integration.id
                                );

                              if (isSelected) {
                                selectedDynamicPaymentMenus =
                                  selectedDynamicPaymentMenus.filter(
                                    (selected) => selected.id !== integration.id
                                  );
                              } else {
                                selectedDynamicPaymentMenus.push(integration);
                              }

                              // Update the form value with the array of menu IDs
                              form.setFieldValue(
                                'dynamicPaymentMenus',
                                selectedDynamicPaymentMenus.map(
                                  (integration) => integration.id
                                )
                              );
                            }
                          "
                        >
                          {{ integration.integrationName }}
                          <UiCheckbox
                            :checked="
                              selectedDynamicPaymentMenus.some(
                                (selected) => selected.id === integration.id
                              )
                            "
                            class="ml-auto"
                          />
                        </UiCommandItem>
                      </UiCommandGroup>
                    </UiCommandList>
                  </UiCommand>
                </UiPopoverContent>
              </UiPopover>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.children"
            v-slot="{ componentField }"
            name="children"
          >
            <FormItem>
              <FormLabel> Children Menu </FormLabel>
              <UiPopover>
                <UiPopoverTrigger asChild>
                  <FormControl>
                    <p
                      variant="outline"
                      role="combobox"
                      class="w-full h-16 text-sm text-left border flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
                      :class="{
                        'text-muted-foreground': !selectedChildren?.length,
                      }"
                    >
                      {{
                        selectedChildren?.length
                          ? selectedChildren
                              .map((menu) => menu.menuName)
                              .join(", ")
                          : "Select children menus"
                      }}
                      <Icon
                        name="material-symbols:unfold-more-rounded"
                        class="ml-2 h-4 w-4 shrink-0 opacity-50"
                      ></Icon>
                    </p>
                  </FormControl>
                </UiPopoverTrigger>
                <UiPopoverContent class="w-[200px] p-0">
                  <UiCommand>
                    <UiCommandInput placeholder="Search children menus..." />
                    <UiCommandList>
                      <UiCommandEmpty>
                        No children menus found.
                      </UiCommandEmpty>
                      <UiCommandGroup>
                        <UiCommandItem
                          v-for="menu in allMenus"
                          :key="menu.id"
                          :value="menu.menuName"
                          @select="
                            () => {
                              const isSelected = selectedChildren.some(
                                (selected) => selected.id === menu.id
                              );

                              if (isSelected) {
                                selectedChildren = selectedChildren.filter(
                                  (selected) => selected.id !== menu.id
                                );
                              } else {
                                selectedChildren.push(menu);
                              }

                              // Update the form value with the array of menu IDs
                              form.setFieldValue(
                                'children',
                                selectedChildren.map((menu) => menu.id)
                              );
                            }
                          "
                        >
                          {{ menu.menuName }}
                          <UiCheckbox
                            :checked="
                              selectedChildren.some(
                                (selected) => selected.id === menu.id
                              )
                            "
                            class="ml-auto"
                          />
                        </UiCommandItem>
                      </UiCommandGroup>
                    </UiCommandList>
                  </UiCommand>
                </UiPopoverContent>
              </UiPopover>
              <FormMessage>{{ errorMessage }}</FormMessage>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-if="form.values.isSystemMenu"
            v-slot="{ componentField }"
            name="systemMenuType"
          >
            <FormItem>
              <FormLabel> System Menu Type </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select a system menu type" />
                  </UiSelectTrigger>
                </FormControl>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="item in Object.values(SystemMenuType)"
                      :value="item"
                    >
                      {{ item }}
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.enabled"
            v-slot="{ value, handleChange }"
            name="enabled"
          >
            <FormItem>
              <FormLabel> Enabled </FormLabel>
              <FormControl>
                <UiSwitch :checked="value" @update:checked="handleChange" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.isImage"
            v-slot="{ value, handleChange }"
            name="isImage"
          >
            <FormItem>
              <FormLabel> Is Image </FormLabel>
              <FormControl>
                <UiSwitch :checked="value" @update:checked="handleChange" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.isSuperParent"
            v-slot="{ value, handleChange }"
            name="isSuperParent"
          >
            <FormItem>
              <FormLabel> Is Super Parent </FormLabel>
              <FormControl>
                <UiSwitch :checked="value" @update:checked="handleChange" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.isSystemMenu"
            v-slot="{ value, handleChange }"
            name="isSystemMenu"
          >
            <FormItem>
              <FormLabel> Is System Menu </FormLabel>
              <FormControl>
                <UiSwitch :checked="value" @update:checked="handleChange" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="col-span-full w-full py-4 flex justify-between">
            <UiButton
              :disabled="submitting"
              variant="outline"
              type="button"
              @click="$router.go(-1)"
            >
              Cancel
            </UiButton>
            <UiButton :disabled="submitting" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="submitting"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Update
            </UiButton>
          </div>
        </div>
      </form>
    </UiCard>
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound class="w-full" title="Sorry, No menu found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage
        :retry="refetch"
        class="w-full"
        title="Something went wrong."
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
.absolute > .icon-picker {
  max-height: 100%;
  width: 100%;
  overflow-y: auto;
}

.absolute > .icon-picker::-webkit-scrollbar {
  width: 6px;
}

.absolute > .icon-picker::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.absolute > .icon-picker::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.absolute > .icon-picker::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
