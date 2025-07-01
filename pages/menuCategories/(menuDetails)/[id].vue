<script lang="ts" setup>
const openItems = ref("menuDetails");
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
import type { Menu, PaymentIntegration } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const {
  getMenuById,
  getMenus,
  updateMenu,
  updateProductMenus,
  updateChildrenMenus,
  getChildrensByParentId,
  isLoading,
  isSubmitting,
} = useMenus();
const { getPaymentIntegrations } = usePaymentIntegrations();
const { uploadFile, getFile } = useDocuments(); // Get the upload function

const fullPath = ref(route.path);
const pathSegments = ref([]);
const menuId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const allPaymentIntegrations = ref<PaymentIntegration[]>([]);
const allMenus = ref<Menu[]>([]);
const allMenuChildrens = ref<Menu[]>([]);

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
const productMenuLoading = ref(false);
const childrenMenuLoading = ref(false);
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
    if (data.value?.iconPath && data.value.isImage) {
      await getUploadedImage(data.value?.iconPath);
    }
    selectedDynamicPaymentMenus.value = data.value?.dynamicPaymentMenus || [];
    // selectedChildren.value = data.value?.children || [];
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

const getMenuChildrensData = async () => {
  try {
    if(menuId.value){
      selectedChildren.value = await getChildrensByParentId(menuId.value);
    }
  } catch (err) {
    console.error("Error fetching menu childrens:", err);
  }
};

onMounted(() => {
  getMenuDetails();
  getPaymentIntegrationData();
  getMenusData();
  getMenuChildrensData()
});

const refetch = async () => {
  await getPaymentIntegrationData();
  await getMenuDetails();
  await getMenusData();
  await getMenuChildrensData()
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
    else if (typeof response === "string" && response?.startsWith("data:")) {
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

const updateProductMenu = async () => {
  try {
    productMenuLoading.value = true;
    const updatedValues = form.values.dynamicPaymentMenus.map((menu: any) => ({
      id: menu.id,
    }));
    await updateProductMenus(menuId.value, updatedValues);
    toast({
      title: "Product Menu Updated",
      description: "Product menu updated successfully",
    });
  } catch (err) {
    console.error("Error updating product menu:", err);
    toast({
      title: "Error",
      description: "Failed to update product menu",
      variant: "destructive",
    });
  } finally {
    productMenuLoading.value = false;
  }
};

const updateChildrenMenu = async () => {
  try {
    childrenMenuLoading.value = true;
    const updatedValues = {
      childIds: form.values.children.map((menu: any) => (menu.id))
    }
    await updateChildrenMenus(menuId.value, updatedValues);
    toast({
      title: "Children Menu Updated",
      description: "Children menu updated successfully",
    });
  } catch (err) {
    console.error("Error updating children menu:", err);
    toast({
      title: "Error",
      description: "Failed to update children menu",
      variant: "destructive",
    });
  } finally {
    childrenMenuLoading.value = false;
  }
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

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      refetch();
      openItems.value = newActiveTab as string; // Update the active tab when the query param
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
    <UiTabs
      v-else-if="data && !isError"
      v-model="openItems"
      class="w-full space-y-0"
    >
      <div
        class="w-full border rounded-lg flex justify-center items-center bg-background p-2 mb-4"
      >
        <h1 class="text-lg font-bold">{{ data.menuName }}</h1>
      </div>
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
        <UiTabsTrigger
          value="menuDetails"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'menuDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Menu Details
        </UiTabsTrigger>
        <UiTabsTrigger
          value="productMenus"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'productMenus',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Product Menus
        </UiTabsTrigger>
        <UiTabsTrigger
          value="childrenMenus"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'childrenMenus',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Children Menus
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent
        value="menuDetails"
        class="text-base bg-background rounded-lg"
      >
        <UiCard class="w-full p-6">
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
                        <UiSelectValue
                          placeholder="Select a menu layout type"
                        />
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
              <!-- <FormField
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
                                  .map(
                                    (integration) => integration.integrationName
                                  )
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
                                      (selected) =>
                                        selected.id === integration.id
                                    );

                                  if (isSelected) {
                                    selectedDynamicPaymentMenus =
                                      selectedDynamicPaymentMenus.filter(
                                        (selected) =>
                                          selected.id !== integration.id
                                      );
                                  } else {
                                    selectedDynamicPaymentMenus.push(
                                      integration
                                    );
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
                        <UiCommandInput
                          placeholder="Search children menus..."
                        />
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
              </FormField> -->
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
                        <UiSelectValue
                          placeholder="Select a system menu type"
                        />
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
  <UiPermissionGuard permission="UPDATE_INTEGRATION_MENUS" >
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
              </UiPermissionGuard>
            </div>
          </form>
        </UiCard>
      </UiTabsContent>
      <UiTabsContent
        value="productMenus"
        class="text-base bg-background rounded-lg h-full"
      >
        <UiCard class="w-full h-full p-6">
          <div class="flex flex-col gap-2">
            <FormField
              :model-value="data?.dynamicPaymentMenus"
              v-slot="{ componentField, errorMessage }"
              name="dynamicPaymentMenus"
            >
              <FormItem>
                <FormLabel>Select Product Menus</FormLabel>
                <UiPopover>
                  <UiPopoverTrigger asChild>
                    <FormControl>
                      <div
                        variant="outline"
                        role="combobox"
                        class="w-full text-sm text-left border flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
                        :class="{
                          'text-muted-foreground':
                            !selectedDynamicPaymentMenus?.length,
                        }"
                      >
                        {{
                          selectedDynamicPaymentMenus?.length
                            ? selectedDynamicPaymentMenus
                                .map(
                                  (integration) => integration.integrationName
                                )
                                .join(", ")
                            : "Select product menus or payment integrations"
                        }}
                        <Icon
                          name="material-symbols:unfold-more-rounded"
                          class="ml-2 h-4 w-4 shrink-0 opacity-50"
                        />
                      </div>
                    </FormControl>
                  </UiPopoverTrigger>
                  <UiPopoverContent class="w-full self-start p-0">
                    <UiCommand>
                      <UiCommandInput placeholder="Search product menus..." />
                      <UiCommandList>
                        <UiCommandEmpty>No product menus found.</UiCommandEmpty>
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
                                      (selected) =>
                                        selected.id !== integration.id
                                    );
                                } else {
                                  selectedDynamicPaymentMenus.push(integration);
                                }

                                form.setFieldValue(
                                  'dynamicPaymentMenus',
                                  selectedDynamicPaymentMenus.map(
                                    (integration) => integration
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

            <!-- Selected Products List -->
            <div v-if="selectedDynamicPaymentMenus.length > 0" class="mt-2">
              <h3 class="font-medium text-sm mb-2">Selected Products</h3>
              <div class="grid md:grid-cols-2 gap-2">
                <div
                  v-for="menu in selectedDynamicPaymentMenus"
                  :key="menu.id"
                  class="flex items-center justify-between px-2 py-1 border rounded-md"
                >
                  <span>{{ menu.integrationName }}</span>
                  <UiButton
                    variant="destructive"
                    size="sm"
                    @click="
                      selectedDynamicPaymentMenus =
                        selectedDynamicPaymentMenus.filter(
                          (item) => item.id !== menu.id
                        );
                      form.setFieldValue(
                        'dynamicPaymentMenus',
                        selectedDynamicPaymentMenus.map(
                          (integration) => integration
                        )
                      );
                    "
                  >
                    <Icon name="lucide:trash-2" class="h-4 w-4" />
                  </UiButton>
                </div>
              </div>
            </div>

    <UiPermissionGuard :permission=PermissionConstants.UPDATE_INTEGRATION_MENU >
            <div class="flex justify-end mt-10">
              <UiButton
                type="button"
                :disabled="productMenuLoading"
                @click="updateProductMenu"
              >
                <Icon
                  v-if="productMenuLoading"
                  name="svg-spinners:8-dots-rotate"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                Save Changes
              </UiButton>
            </div>
            </UiPermissionGuard>
          </div>
        </UiCard>
      </UiTabsContent>
      <UiTabsContent
        value="childrenMenus"
        class="text-base bg-background rounded-lg"
      >
        <UiCard class="w-full h-full p-6">
          <div class="flex flex-col gap-2">
            <FormField
              :model-value="data?.children"
              v-slot="{ componentField, errorMessage }"
              name="children"
            >
              <FormItem>
                <FormLabel>Select Children Menus</FormLabel>
                <UiPopover>
                  <UiPopoverTrigger asChild>
                    <FormControl>
                      <div
                        variant="outline"
                        role="combobox"
                        class="w-full text-sm text-left border flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
                        :class="{
                          'text-muted-foreground': !selectedChildren?.length,
                        }"
                      >
                        {{
                          selectedChildren?.length
                            ? selectedChildren
                                .map((integration) => integration.menuName)
                                .join(", ")
                            : "Select children menus"
                        }}
                        <Icon
                          name="material-symbols:unfold-more-rounded"
                          class="ml-2 h-4 w-4 shrink-0 opacity-50"
                        />
                      </div>
                    </FormControl>
                  </UiPopoverTrigger>
                  <UiPopoverContent class="w-full self-start p-0">
                    <UiCommand>
                      <UiCommandInput placeholder="Search children menus..." />
                      <UiCommandList>
                        <UiCommandEmpty
                          >No children menus found.</UiCommandEmpty
                        >
                        <UiCommandGroup>
                          <UiCommandItem
                            v-for="integration in allMenus"
                            :key="integration.id"
                            :value="integration.menuName"
                            @select="
                              () => {
                                const isSelected = selectedChildren.some(
                                  (selected) => selected.id === integration.id
                                );

                                if (isSelected) {
                                  selectedChildren = selectedChildren.filter(
                                    (selected) => selected.id !== integration.id
                                  );
                                } else {
                                  selectedChildren.push(integration);
                                }

                                form.setFieldValue(
                                  'children',
                                  selectedChildren.map(
                                    (integration) => integration
                                  )
                                );
                              }
                            "
                          >
                            {{ integration.menuName }}
                            <UiCheckbox
                              :checked="
                                selectedChildren.some(
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

            <!-- Selected Children Menus List -->
            <div v-if="selectedChildren.length > 0" class="mt-2">
              <h3 class="font-medium text-sm mb-2">Selected Children Menus</h3>
              <div class="grid md:grid-cols-2 gap-2">
                <div
                  v-for="menu in selectedChildren"
                  :key="menu.id"
                  class="flex items-center justify-between px-2 py-1 border rounded-md"
                >
                  <span>{{ menu.menuName }}</span>
                  <UiButton
                    variant="destructive"
                    size="sm"
                    @click="
                      selectedChildren = selectedChildren.filter(
                        (item) => item.id !== menu.id
                      );
                      form.setFieldValue(
                        'children',
                        selectedChildren.map((integration) => integration)
                      );
                    "
                  >
                    <Icon name="lucide:trash-2" class="h-4 w-4" />
                  </UiButton>
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-10">
              <UiButton
                type="button"
                :disabled="childrenMenuLoading"
                @click="updateChildrenMenu"
              >
                <Icon
                  v-if="childrenMenuLoading"
                  name="svg-spinners:8-dots-rotate"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                Save Changes
              </UiButton>
            </div>
          </div>
        </UiCard>
      </UiTabsContent>
    </UiTabs>
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
