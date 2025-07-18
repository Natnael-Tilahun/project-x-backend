<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newUssdDefaultMessagesFormSchema } from "~/validations/newUssdDefaultMessagesFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { DefaultMessage } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const {
  getUssdDefaultMessageById,
  updateUssdDefaultMessage,
  isLoading,
  isSubmitting,
} = useUssdDefaultMessage();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const ussdDefaultMessageId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<DefaultMessage>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
ussdDefaultMessageId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newUssdDefaultMessagesFormSchema,
});

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getUssdDefaultMessageById(ussdDefaultMessageId.value);
  form.setValues({
    id: data.value?.id,
    ...data.value,
  });
} catch (err) {
  console.error("Error fetching ussd default message:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}
}

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      ...values,
    };
    data.value = await updateUssdDefaultMessage(values.id, newValues); // Call your API function to fetch profile
    navigateTo(`/ussdDefaultMessages/${data.value.id}`);
    console.log("New ussd default message data; ", data.value);
    toast({
      title: "Ussd Default Message Updated",
      description: "Ussd Default Message updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating ussd default message:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

const refetch = async () => {
  isError.value = false
  await fetchData();
};

</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiCard v-else-if="data && !isError" class="w-full p-6">
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Ussd Default Message Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter ussd default message Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Ussd Default Message Title </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter ussd default message title"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="message">
            <FormItem>
              <FormLabel>Ussd Default Message Message </FormLabel>
              <FormControl>
                <UiTextarea
                  type="text"
                  placeholder="Enter ussd default message message"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <UiPermissionGuard :permission="PermissionConstants.UPDATE_USSD_DEFAULT_MESSAGE">
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
    <div v-else-if="data == null || data == undefined" class="w-full">
      <UiNoResultFound title="Sorry, No ussd language found." />
    </div>
    <div v-else-if="isError" class="w-full">
      <ErrorMessage  :retry="refetch"  title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
