<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newLocalizedUssdMenuNamesFormSchema } from "~/validations/newLocalizedUssdMenuNamesFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { LocalizedUssdMenu, UssdLanguage, UssdMenuList } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const {
  getUssdLocalizedMenuById,
  isLoading,
  isSubmitting,
  updateUssdLocalizedMenu,
  updateUssdLocalizedMenuStatus,
} = useUssdLocalizedMenus();
const { getUssdMenus, isLoading: isLoadingUssdMenus } = useUssdMenus();
const { getUssdLanguages, isLoading: isLoadingUssdLanguages } =
  useUssdLanguages();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const ussdLocalizedMenuId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<LocalizedUssdMenu>();
const ussdMenus = ref<UssdMenuList[]>([]);
const ussdLanguages = ref<UssdLanguage[]>([]);

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
ussdLocalizedMenuId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newLocalizedUssdMenuNamesFormSchema,
});

const getUssdLocalizedMenuByIdData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value = await getUssdLocalizedMenuById(ussdLocalizedMenuId.value);
    form.setValues({
      id: data.value?.id,
      ...data.value,
      menuLanguageId: data.value?.menuLanguageId?.id,
      status: data.value?.status === "Visible" ? true : false,
    });
  } catch (err) {
    console.error("Error fetching ussd localized menu:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

await useAsyncData("ussdLocalizedMenuByIdData", async () => {
  await getUssdLocalizedMenuByIdData();
});

const getUssdMenusData = async () => {
  try {
    isLoading.value = true;
    ussdMenus.value = await getUssdMenus();
  } catch (err: any) {
    console.error("Error fetching ussd menus:", err.message);
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
  await getUssdMenusData();
  await getUssdLanguagesData();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      ...values,
      status: values.status ? "Visible" : "Disable",
    };
    const response = await updateUssdLocalizedMenu(values.id, newValues); // Call your API function to fetch profile
    await getUssdLocalizedMenuByIdData();
    // navigateTo(`/ussdLocalizedMenus/${data.value.id}`);
    toast({
      title: "Ussd Localized Menu Updated",
      description: "Ussd Localized Menu updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating ussd localized menu:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

const updatingUssdLocalizedMenuStatus = async (
  menuId: string,
  status: boolean
) => {
  try {
    const statusValue = status ? "Visible" : "Disable";
    const response = await updateUssdLocalizedMenuStatus(menuId, statusValue);
    toast({
      title: "Ussd localized menu status updated",
      description: "Ussd localized menu status updated successfully",
    });
    await getUssdLocalizedMenuByIdData();
  } catch (err) {
    console.error("Error updating ussd localized menu status:", err);
    toast({
      title: "Error updating ussd localized menu status",
      description: "Error updating ussd localized menu status",
    });
    isError.value = true;
  }
};
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiCard v-else-if="data && !isError" class="w-full p-6">
      <form @submit.prevent="onSubmit" class="space-y-6 flex flex-col">
        <!-- <div class="w-1/5 self-end flex flex-row gap-2 items-center"> -->
        <FormField v-slot="{ value, handleChange }" name="status">
          <FormItem
            class="flex flex-row items-end justify-between self-end rounded-xl border pb-2 px-4 w-fit gap-10"
          >
            <FormLabel class="text-base"> Status </FormLabel>
            <FormControl>
              <UiSwitch
                :disabled="!useHasPermissions('UPDATE_USSD_LOCALIZED_MENUS')"
                :checked="value"
                class="self-center"
                @update:checked="
                  (checked) => {
                    handleChange;
                    updatingUssdLocalizedMenuStatus(data?.id || '', checked);
                  }
                "
              />
            </FormControl>
          </FormItem>
        </FormField>
        <!-- </div> -->
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Ussd localized menu Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter ussd localized menu Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="menuLanguageId">
            <FormItem>
              <FormLabel> Ussd Menu </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select a ussd menu" />
                  </UiSelectTrigger>
                </FormControl>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="item in ussdMenus"
                      :value="item.id || ''"
                    >
                      {{ item.menuName }}
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
              <FormLabel>Localized Message </FormLabel>
              <FormControl>
                <UiTextarea
                  type="text"
                  placeholder="Enter localized menu message"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <UiPermissionGuard :permission="PermissionConstants.UPDATE_USSD_LOCALIZED_MENU">
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
      <UiNoResultFound title="Sorry, No ussd language found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
