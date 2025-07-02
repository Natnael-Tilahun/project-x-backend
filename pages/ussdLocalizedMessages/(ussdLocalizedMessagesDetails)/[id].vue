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
import type {
  DefaultMessage,
  LocalizedDefaultMessage,
  UssdLanguage,
} from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const {
  getUssdLocalizedDefaultMessageById,
  updateUssdLocalizedDefaultMessage,
  isLoading,
  isSubmitting,
  updateUssdLocalizedDefaultMessageStatus,
} = useUssdLocalizedDefaultMessage();
const { getUssdDefaultMessages, isLoading: isLoadingUssdDefaultMessages } =
  useUssdDefaultMessage();
const { getUssdLanguages, isLoading: isLoadingUssdLanguages } =
  useUssdLanguages();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const ussdLocalizedDefaultMessageId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<LocalizedDefaultMessage>({});
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

const getUssdLocalizedDefaultMessageByIdData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value = await getUssdLocalizedDefaultMessageById(
      ussdLocalizedDefaultMessageId.value
    );
    form.setValues({
      id: data.value?.id,
      ...data.value,
      defaultMessageId: data.value?.defaultMessageId?.id,
      languageId: data.value?.languageId,
      status: data.value?.status == "Visible" ? true : false,
    });
  } catch (err) {
    console.error("Error fetching ussd localized default message:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const getUssdDefaultMessagesData = async () => {
  try {
    isLoading.value = true;
    ussdDefaultMessages.value = await getUssdDefaultMessages();
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
  await getUssdLocalizedDefaultMessageByIdData();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      ...values,
      status: values.status ? "Visible" : "Disable",
    };
    data.value = await updateUssdLocalizedDefaultMessage(values.id, newValues); // Call your API function to fetch profile
    // navigateTo(`/ussdLocalizedMessages/${data.value.id}`);
    await getUssdLocalizedDefaultMessageByIdData();
    await getUssdDefaultMessagesData();
    await getUssdLanguagesData();
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

const updatingUssdLocalizedDefaultMessageStatus = async (
  menuId: string,
  status: boolean
) => {
  try {
    const statusValue = status ? "Visible" : "Disable";
    const response = await updateUssdLocalizedDefaultMessageStatus(
      menuId,
      statusValue
    );
    toast({
      title: "Ussd localized menu status updated",
      description: "Ussd localized menu status updated successfully",
    });
    await getUssdLocalizedDefaultMessageByIdData();
    await getUssdDefaultMessagesData();
    await getUssdLanguagesData();
  } catch (err) {
    console.error("Error updating ussd localized default message status:", err);
    toast({
      title: "Error updating ussd localized menu status",
      description: "Error updating ussd localized menu status",
    });
    isError.value = true;
  }
};

const refetch = async () => {
  isError.value = false
  await getUssdDefaultMessagesData();
  await getUssdLanguagesData();
  await getUssdLocalizedDefaultMessageByIdData();
}
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiCard v-else-if="data && !isError" class="w-full p-6">
      <form @submit.prevent="onSubmit" class="space-y-6 flex flex-col">
        <FormField v-slot="{ value, handleChange }" name="status">
          <FormItem
            class="flex flex-row items-end justify-between self-end rounded-xl border pb-2 px-4 w-fit gap-10"
          >
            <FormLabel class="text-base"> Statusd </FormLabel>
            <FormControl>
              <UiSwitch
                :disabled="
                  !useHasPermissions('UPDATE_USSD_LOCALIZED_DEFAULT_MESSAGES')
                "
                :checked="value"
                class="self-center"
                @update:checked="
                  (checked) => {
                    handleChange;
                    updatingUssdLocalizedDefaultMessageStatus(
                      data?.id || '',
                      checked
                    );
                  }
                "
              />
            </FormControl>
          </FormItem>
        </FormField>
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
          <FormField v-slot="{ componentField }" name="defaultMessageId">
            <FormItem>
              <FormLabel> Ussd Default Message </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue
                      placeholder="Select a ussd default message"
                    />
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
              <FormLabel>Ussd Localized Message </FormLabel>
              <FormControl>
                <UiTextarea
                  type="text"
                  placeholder="Enter ussd localized message"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- <FormField v-slot="{ componentField }" name="status">
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
            </FormField> -->

          <UiPermissionGuard
            :permission="PermissionConstants.UPDATE_USSD_LOCALIZED_DEFAULT_MESSAGE"
          >
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
    <div v-else-if="!loading && (data == null || data == undefined)" class="w-full">
      <UiNoResultFound title="Sorry, No localized message found." />
    </div>
    <div v-else-if="isError" class="w-full">
      <ErrorMessage :retry="refetch"  title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
