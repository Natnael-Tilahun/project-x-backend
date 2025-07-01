<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newBankingServiceFormSchema } from "~/validations/newBankingServiceFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { BankingService } from "~/types";
import { ServiceType } from "@/global-types";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const { getBankingServiceById, updateBankingService, isLoading, isSubmitting } =
  useBankingServices();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const bankingServiceId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);

const isError = ref(false);
const data = ref<BankingService>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
bankingServiceId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newBankingServiceFormSchema,
});

try {
  isLoading.value = true;
  loading.value = true;
    data.value = await getBankingServiceById(bankingServiceId.value);
  let a = {
        ...data.value,
  };
  form.setValues(a);
} catch (err) {
  console.error("Error fetching banking service:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    console.log("values: ", values);
    data.value = await updateBankingService(bankingServiceId.value, values); // Call your API function to fetch profile
    navigateTo(`/bankingServices/${data.value.id}`);
    console.log("New Banking Service data; ", data.value);
    toast({
      title: "Banking Service Created",
      description: "Banking Service created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new banking service:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiCard v-else-if="data && !isError" class="w-full p-6">
      <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Banking Service Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter banking service Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="serviceName">
            <FormItem>
              <FormLabel>Banking Service Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter banking service Name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="serviceType">
              <FormItem>
                <FormLabel> Service Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a service type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(ServiceType)"
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
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Banking Service Description </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter banking service Description"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
  <UiPermissionGuard :permission="PermissionConstants.UPDATE_BANKING_SERVICES" >
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
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No contract found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
