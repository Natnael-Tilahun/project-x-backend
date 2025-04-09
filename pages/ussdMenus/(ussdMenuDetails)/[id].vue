<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newUssdMenuNamesFormSchema } from "~/validations/newUssdMenuNamesFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { UssdMenuList } from "~/types";

const route = useRoute();
const { getUssdMenuById, updateUssdMenuName, isLoading, isSubmitting } =
  useUssdMenus();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const ussdMenuId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<UssdMenuList>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
ussdMenuId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newUssdMenuNamesFormSchema,
});

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getUssdMenuById(ussdMenuId.value);
  form.setValues({
    ...data.value,
  });
} catch (err) {
  console.error("Error fetching ussd menu:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
        id: data.value?.id,
       ...values
    }
    data.value = await updateUssdMenuName(newValues); // Call your API function to fetch profile
    navigateTo(`/ussdMenus/${data.value.id}`);
    toast({
      title: "Ussd Menu Updated",
      description: "Ussd Menu updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating ussd menu:", err);
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
              <FormLabel>Ussd Menu Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter ussd menu Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="menuName">
            <FormItem>
              <FormLabel>Ussd Menu Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter ussd menu name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- <FormField v-slot="{ componentField }" name="visible">
            <FormItem>
              <FormLabel>Ussd Menu Visible </FormLabel>
              <FormControl>
                <UiTextarea
                  type="text"
                  placeholder="Enter ussd menu visible"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="displayOrder">
            <FormItem>
              <FormLabel>Ussd Menu Display Order </FormLabel>
              <FormControl>
                <UiTextarea
                  type="text"
                  placeholder="Enter ussd menu display order"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField> -->
    
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
