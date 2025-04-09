<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newLocalizedUssdDefaultMessagesFormSchema } from "~/validations/newLocalizedUssdDefaultMessagesFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { DefaultMessage, LocalizedDefaultMessage, UssdLanguage } from "~/types";
import { LanguageRelatedStatus } from "~/global-types";

const route = useRoute();
  const { getUssdLocalizedDefaultMessageById, updateUssdLocalizedDefaultMessage, isLoading, isSubmitting, getUssdLocalizedDefaultMessages } =
  useUssdLocalizedDefaultMessage();
const { getUssdDefaultMessages, isLoading: isLoadingUssdDefaultMessages } =
  useUssdDefaultMessage();
const { getUssdLanguages, isLoading: isLoadingUssdLanguages } = useUssdLanguages();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const ussdLocalizedDefaultMessageId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<LocalizedDefaultMessage>();
const ussdDefaultMessages = ref<DefaultMessage[]>([]);
const ussdLanguages = ref<UssdLanguage[]>([]);

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
ussdLocalizedDefaultMessageId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newLocalizedUssdDefaultMessagesFormSchema,
});

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getUssdLocalizedDefaultMessageById(ussdLocalizedDefaultMessageId.value);
  console.log(
    "ussdLocalizedDefaultMessage.value data: ",
  data.value
  );
  form.setValues({
    id: data.value?.id,
    ...data.value,
  });
} catch (err) {
  console.error("Error fetching ussd localized default message:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}

const getUssdDefaultMessagesData = async () => {
  try {
    isLoading.value = true;
    ussdDefaultMessages.value = await getUssdDefaultMessages();
    console.log("ussdDefaultMessages: ", ussdDefaultMessages.value);
  } catch (err: any) {
    console.error("Error fetching ussd default messages:", err.message);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const getUssdLanguagesData = async () => {
  try {
    isLoadingUssdLanguages.value = true;
    ussdLanguages.value = await getUssdLanguages();
    console.log("ussdLanguages: ", ussdLanguages.value);
  } catch (err: any) {
    console.error("Error fetching ussd languages:", err.message);
    isError.value = true;
  } finally {
    isLoadingUssdLanguages.value = false;
  }
};

onMounted(async () => {
  await getUssdDefaultMessagesData();
  await getUssdLanguagesData();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
        ...values,
    }
    console.log("newValues: ", newValues);
    data.value = await updateUssdLocalizedDefaultMessage(values.id, newValues); // Call your API function to fetch profile
    navigateTo(`/ussdLocalizedMessages/${data.value.id}`);
    console.log("New ussd localized default message data; ", data.value);
    toast({
      title: "Ussd Localized Default Message Updated",
      description: "Ussd Localized Default Message updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating ussd localized default message:", err);
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
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Ussd localized default message Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter ussd localized default message Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="defaultMessageId.id">
              <FormItem>
                <FormLabel> Ussd Default Message </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a ussd default message" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in ussdDefaultMessages"
                        :value="item.id || ''"
                      >
                        {{ item.title }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="languageId">
              <FormItem>
                <FormLabel> Language </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a language" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in ussdLanguages"
                        :value="item.id || ''"
                      >
                        {{ item.languageName }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
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

          <FormField v-slot="{ componentField }" name="status">
              <FormItem>
                <FormLabel> Status </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a status" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(LanguageRelatedStatus)"
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
      <UiNoResultFound title="Sorry, No ussd language found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
