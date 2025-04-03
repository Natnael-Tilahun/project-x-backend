<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newOfficeFormSchema } from "~/validations/newOfficeFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Office } from "~/types";
import { dateFormatter } from "~/lib/utils";
const route = useRoute();
const { getOfficeById, updateOffice, isLoading, isSubmitting, getOffices } =
  useOffice();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const merchantId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<Office>();
const offices = ref<Office[]>([]);

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
merchantId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newOfficeFormSchema,
});

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getOfficeById(merchantId.value);
  console.log(
    "office.value data: ",
  data.value
  );
  offices.value = await getOffices();
  console.log("Offices: ", offices.value);
  form.setValues(
    {...data.value,
  openingDate: data.value.openingDate
        ? dateFormatter(data.value.openingDate)
        : ""
});
} catch (err) {
  console.error("Error fetching office:", err);
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
      ...values,
      openingDate: new Date().toISOString(),
      parent: values.parent
    }
    console.log("newValues: ", newValues);
    data.value = await updateOffice(values.id, newValues); // Call your API function to fetch profile
    navigateTo(`/offices/${data.value.id}`);
    console.log("New office data; ", data.value);
    toast({
      title: "Office Created",
      description: "Office created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new office:", err);
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
              <FormLabel>Office Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter office Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Office Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter office Name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="code">
            <FormItem>
              <FormLabel>Office Code </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter office code"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="state">
            <FormItem>
              <FormLabel> State</FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter state"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="organizationRegion">
            <FormItem>
              <FormLabel> Organization Region </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter organization region"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="districtName">
            <FormItem>
              <FormLabel> District Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter district name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Description </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter description"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="hierarchy">
            <FormItem>
              <FormLabel>Hierarchy</FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter hierarchy"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="openingDate">
            <FormItem>
              <FormLabel> Opening Date </FormLabel>
              <FormControl>
                <UiInput
                  type="date"
                  placeholder="Enter opening date"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="parent.id">
            <FormItem class="w-full">
              <FormLabel> Parent </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select a parent office" />
                  </UiSelectTrigger>
                </FormControl>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem v-for="item in offices" :value="item.id">
                      {{ item.name }}
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
      <UiNoResultFound title="Sorry, No office found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
