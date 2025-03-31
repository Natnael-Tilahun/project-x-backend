<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import {newStaffFormSchema } from "~/validations/newStaffFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Staff, Office } from "~/types";
import { dateFormatter } from "~/lib/utils";
const route = useRoute();
const { getStaffById, updateStaff, isLoading, isSubmitting } =
  useStaffs();
const { getOffices } = useOffice();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const merchantId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<Staff>();
const offices = ref<Office[]>([]);

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
merchantId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newStaffFormSchema,
});

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getStaffById(merchantId.value);
  let a = {
    ...data.value,
   joiningDate : data.value.joiningDate
        ? dateFormatter(data.value.joiningDate)
        : ""
  };
  form.setValues(a);
} catch (err) {
  console.error("Error fetching staff:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    data.value = await updateStaff(values.id, values); // Call your API function to fetch profile
    navigateTo(`/staffs/${data.value.id}`);
    console.log("New staff data; ", data.value);
    toast({
      title: "Staff Created",
      description: "Staff created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new staff:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

const fetchOfficesData = async () => {
  try {
    loading.value = true;
    offices.value = await getOffices();
    console.log("Offices: ", offices.value);
  } catch (err) {
    console.error("Error fetching offices:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchOfficesData();
});

const refetch = async () => {
  await fetchOfficesData();
};
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
              <FormLabel>Staff Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter staff Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="firstName">
            <FormItem>
              <FormLabel>First Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter first name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lastName">
            <FormItem>
              <FormLabel>Last Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter last name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="displayName">
            <FormItem>
              <FormLabel> Display Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter display name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="mobileNo">
            <FormItem>
              <FormLabel> Mobile Number </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter mobile number"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="externalId">
            <FormItem>
              <FormLabel> External Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter external id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="emailAddress">
            <FormItem>
              <FormLabel>Email Address </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter email address"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="organisationalRoleType">
            <FormItem>
              <FormLabel> Organisational Role Type </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter organisational Role Type"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="organisationalRoleParentStaff">
            <FormItem>
              <FormLabel> Organisational Role Parent Staff </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter organisational Role Parent Staff"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="joiningDate">
            <FormItem>
              <FormLabel> Joining Date </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter joining date"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="office">
              <FormItem class="w-full">
                <FormLabel> Office </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select an office" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in offices"
                        :value="item.id"
                      >
                        {{ item.name }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>
          <FormField v-slot="{ value, handleChange }" name="loanOfficer">
                <FormItem>
                  <FormLabel> Loan Officer </FormLabel>
                  <FormControl>
                    <UiSwitch :checked="value" @update:checked="handleChange" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
          </FormField>
          <FormField v-slot="{ value, handleChange }" name="active">
                <FormItem>
                  <FormLabel> Active </FormLabel>
                  <FormControl>
                    <UiSwitch :checked="value" @update:checked="handleChange" />
                  </FormControl>
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
      <UiNoResultFound title="Sorry, No staff found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
