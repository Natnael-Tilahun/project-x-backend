<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PaginationType, MenuLayoutType } from "@/global-types";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { menuFormSchema } from "~/validations/menuFormSchema";
const { createNewMenu, getMenus, isLoading } = useMenus();
const { getPaymentIntegrations } = usePaymentIntegrations();

const isError = ref(false);
const data = ref<Menu>();
const isSubmitting = ref(false);
const allPaymentIntegrations = ref<PaymentIntegration[]>([]);
const allMenus = ref<Menu[]>([]);
const selectedDynamicPaymentMenus = ref<PaymentIntegration[]>([]);
const selectedChildren = ref<Menu[]>([]);

const form = useForm({
  validationSchema: menuFormSchema,
});

const getPaymentIntegrationData = async () => {
  try {
    allPaymentIntegrations.value = await getPaymentIntegrations();
    selectedDynamicPaymentMenus.value = data.value?.dynamicPaymentMenus || [];
    console.log("allPaymentIntegrations.value: ", allPaymentIntegrations.value);
  } catch (err) {
    console.error("Error fetching payment integrations:", err);
    isError.value = true;
  }
};

const getMenusData = async () => {
  try {
    allMenus.value = await getMenus();
    selectedChildren.value = data.value?.children || [];
  } catch (err) {
    console.error("Error fetching menus:", err);
    isError.value = true;
  }
};

onMounted(async () => {
  getPaymentIntegrationData();
  getMenusData();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  console.log("values: ", values);

  try {
    isSubmitting.value = true;
    isLoading.value = true;
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
    console.log("updatedValues: ", updatedValues);
    data.value = await createNewMenu(updatedValues); // Call your API function to fetch profile
    navigateTo(`/menuCategories/${data.value.id}`);
    console.log("New Menu data; ", data.value);
    toast({
      title: "Menu Created",
      description: "Menu created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new menu:", err.message);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Menu</h1>
      <p class="text-sm text-muted-foreground">
        Create new menu by including menu name, menu description, icon path,
        enabled, dynamic payment menus and children
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
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
                        class="w-full text-sm text-left border h-10 flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
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
                :disabled="isSubmitting"
                variant="outline"
                type="button"
                @click="$router.go(-1)"
              >
                Cancel
              </UiButton>
              <UiButton :disabled="isSubmitting" type="submit">
                <Icon
                  name="svg-spinners:8-dots-rotate"
                  v-if="isSubmitting"
                  class="mr-2 h-4 w-4 animate-spin"
                ></Icon>

                Submit
              </UiButton>
            </div>
          </div>
        </form>
      </div>
    </UiCard>
  </div>
</template>
