<script lang="ts" setup>
const openItems = ref(["item-1"]);

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

const route = useRoute();
const { getMenuById, getMenus, updateMenu, isLoading, isSubmitting } =
  useMenus();
const { getPaymentIntegrations } = usePaymentIntegrations();

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
    allPaymentIntegrations.value = await getPaymentIntegrations();
    selectedDynamicPaymentMenus.value = data.value?.dynamicPaymentMenus || [];
  } catch (err) {
    console.error("Error fetching payment integrations:", err);
  }
};

const getMenusData = async () => {
  try {
    allMenus.value = await getMenus();
    selectedChildren.value = data.value?.children || [];
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
    navigateTo(`/menuCategories/menuDetails/${data.value.id}`);
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
          <FormField v-slot="{ componentField }" name="iconPath">
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
          </FormField>
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
                      class="w-full text-sm text-left border h-10 flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
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
                    <div
                      variant="outline"
                      role="combobox"
                      class="w-full text-sm text-left border h-10 flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
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
                    </div>
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

<style lang="css" scoped></style>
