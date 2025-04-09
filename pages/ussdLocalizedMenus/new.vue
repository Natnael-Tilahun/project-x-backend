<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ref, onMounted } from "vue";
import { toast } from "~/components/ui/toast";
  import { newLocalizedUssdMenuNamesFormSchema } from "~/validations/newLocalizedUssdMenuNamesFormSchema";
import type { UssdMenuList, UssdLanguage, LocalizedUssdMenu } from "~/types";
import { LanguageRelatedStatus } from "~/global-types";

const {  isLoading, getUssdMenus } =
  useUssdMenus();
const { getUssdLanguages, isLoading: isLoadingUssdLanguages } = useUssdLanguages();
const {createNewUssdLocalizedMenu, isLoading: isLoadingUssdLocalizedMenu } =
  useUssdLocalizedMenus();

const isError = ref(false);
const data = ref<LocalizedUssdMenu>();
const isSubmitting = ref(false);
const ussdMenus = ref<UssdMenuList[]>([]);
const ussdLanguages = ref<UssdLanguage[]>([]);

const form = useForm({
  validationSchema: newLocalizedUssdMenuNamesFormSchema,
});

const getUssdMenusData = async () => {
  try {
    isLoading.value = true;
    ussdMenus.value = await getUssdMenus();
    console.log("ussdMenus: ", ussdMenus.value);
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
    console.log("ussdLanguages: ", ussdLanguages.value);
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
  console.log("values: ", values);

  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const newUssdLocalizedMenu = {
      ...values,
    };
    console.log("newUssdLocalizedMenu: ", newUssdLocalizedMenu);
    data.value = await createNewUssdLocalizedMenu(newUssdLocalizedMenu); // Call your API function to fetch profile
    navigateTo(`/ussdLocalizedMenus/${data.value.id}`);
    console.log("New ussd localized menu data; ", data.value);
    toast({
      title: "Ussd Localized Menu Created",
      description: "Ussd Localized Menu created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new ussd localized menu:", err.message);
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
      <h1 class="md:text-2xl text-lg font-medium">Create New Ussd Menu</h1>
      <p class="text-sm text-muted-foreground">
        Create new ussd menu by including menu name, message, status
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
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
            <!-- <FormField v-slot="{ componentField }" name="title">
              <FormItem>
                <FormLabel>Title </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter title"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->
            <FormField v-slot="{ componentField }" name="message">
              <FormItem>
                <FormLabel>Message </FormLabel>
                <FormControl>
                  <UiTextarea
                    type="text"
                    placeholder="Enter message"
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
