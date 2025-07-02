<script lang="ts" setup>
const openItems = ref("chargeDetails");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { chargeFormSchema } from "~/validations/chargeFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { ChargeType } from "@/global-types";
import type { Charge } from "~/types";
import { getIdFromPath } from "~/lib/utils";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const { getChargeById, updateCharge } = useCharges();

const chargeId = ref<string>("");
const loading = ref(false);
const isSubmitting = ref(false);
const activeTab = route.query.activeTab as string;
openItems.value = activeTab || "chargeDetails";
const isError = ref(false);
const data = ref<Charge>();

chargeId.value = getIdFromPath();

const form = useForm({
  validationSchema: chargeFormSchema,
});

const fetchChargeData = async () => {
  try {
    loading.value = true;
    data.value = await getChargeById(chargeId.value);
    form.setValues({
      ...data.value,
    });
  } catch (err) {
    console.error("Error fetching charge data:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchChargeData();
});

const refetch = async () => {
  await fetchChargeData();
};

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    const dataToUpdate = {
      ...values,
    };
    data.value = await updateCharge(chargeId.value, dataToUpdate); // Call your API function to fetch profile
    navigateTo(`/charges/${data.value.id}`);
    toast({
      title: "Charge Updated",
      description: "Charge updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating the charge:", err.message);
  } finally {
    isSubmitting.value = false;
  }
});

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    refetch();
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    }
  }
);
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiTabs v-else-if="!loading" v-model="openItems" class="w-full space-y-0">
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
        <UiPermissionGuard :permission="PermissionConstants.READ_CHARGE">
          <UiTabsTrigger
            value="chargeDetails"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'chargeDetails',
                },
              })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            Charge Details
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission="PermissionConstants.READ_CHARGE_RULE">
          <UiTabsTrigger
            value="chargeRules"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'chargeRules',
                },
              })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            Charge Rules
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission="PermissionConstants.CREATE_CHARGE_RULE">
          <UiTabsTrigger
            value="newChargeRule"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'newChargeRule',
                },
              })
            "
            :disabled="openItems != 'newChargeRule'"
            :class="openItems == 'newChargeRule' ? '' : 'hidden'"
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            New Charge Rule
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission="PermissionConstants.READ_CHARGE_RULE">
          <UiTabsTrigger
            value="chargeRuleDetails"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'chargeRuleDetails',
                },
              })
            "
            :disabled="openItems != 'chargeRuleDetails'"
            :class="openItems == 'chargeRuleDetails' ? '' : 'hidden'"
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            Charge Rule Details
          </UiTabsTrigger>
        </UiPermissionGuard>
      </UiTabsList>

      <UiPermissionGuard :permission="PermissionConstants.READ_CHARGE">
        <UiTabsContent
          value="chargeDetails"
          class="text-base bg-background p-6 rounded-lg"
        >
          <UiCard v-if="data && !isError" class="w-full p-6">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6">
                <FormField v-slot="{ componentField }" name="id">
                  <FormItem>
                    <FormLabel>Id </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        disabled
                        placeholder="Enter Id"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="chargeCode">
                  <FormItem>
                    <FormLabel>Charge Code </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter Charge Code"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="description">
                  <FormItem>
                    <FormLabel>Charge Description </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter charge description"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="type">
                  <FormItem>
                    <FormLabel> Chage Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue placeholder="Select a charge type" />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem
                            v-for="item in Object.values(ChargeType)"
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

                <FormField v-slot="{ componentField }" name="category">
              <FormItem class="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Category"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            
                <FormField v-slot="{ componentField }" name="categoryAccount">
                  <FormItem>
                    <FormLabel>Category Account </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter Category Account"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ value, handleChange }" name="isActive">
                  <FormItem>
                    <FormLabel> Is Active </FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="value"
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <UiPermissionGuard permission="UPDATE_CHARGES">
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

                      Update
                    </UiButton>
                  </div>
                </UiPermissionGuard>
              </div>
            </form>
          </UiCard>
          <div v-else-if="data == null || data == undefined">
            <UiNoResultFound title="Sorry, No application found." />
          </div>
          <div v-else-if="isError">
            <ErrorMessage :retry="refetch" title="Something went wrong." />
          </div>
        </UiTabsContent>
      </UiPermissionGuard>

      <UiPermissionGuard :permission="PermissionConstants.READ_CHARGE_RULE">
        <UiTabsContent
          value="chargeRules"
          class="text-base bg-background p-6 rounded-lg"
        >
          <ChargeRules :chargeId="chargeId" />
        </UiTabsContent>
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.CREATE_CHARGE_RULE">
        <UiTabsContent
          value="newChargeRule"
          class="text-base bg-background p-6 rounded-lg"
        >
          <ChargeRulesNewChargeRule :applicationId="chargeId" />
        </UiTabsContent>
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.READ_CHARGE_RULE">
        <UiTabsContent
          value="chargeRuleDetails"
          class="text-base bg-background p-6 rounded-lg"
        >
          <ChargeRulesDetails :applicationId="chargeId" />
        </UiTabsContent>
      </UiPermissionGuard>
    </UiTabs>
    <div v-else-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
