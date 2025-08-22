<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { PermissionConstants } from "~/constants/permissions";
import type { AccountCategory } from "~/types";

const route = useRoute();
const { getAccountCategoryByCode, isLoading, isSubmitting } =
  useAccountCategory();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const bankingServiceId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);

const isError = ref(false);
const data = ref<AccountCategory>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
bankingServiceId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: "",
});

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getAccountCategoryByCode(bankingServiceId.value);
  let a = {
        ...data.value,
  };
  form.setValues(a);
} catch (err) {
  console.error("Error fetching account category:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}

</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiCard v-else-if="data && !isError" class="w-full p-6">
      <form @submit="">
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="categoryCode">
            <FormItem>
              <FormLabel>Account Category Code </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter account category code"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="shortName">
            <FormItem>
              <FormLabel>Account Category Short Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter account category short name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Banking Service Description </FormLabel>
              <FormControl>
                <UiTextarea
                  placeholder="Enter banking service Description"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </form>
    </UiCard>
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No account category found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
