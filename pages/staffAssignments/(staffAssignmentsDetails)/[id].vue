<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import {newStaffAssignmentsFormSchema } from "~/validations/newStaffAssignmentsFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { StaffAssignment, Staff, Office, Role } from "~/types";
import { dateFormatter } from "~/lib/utils";
const route = useRoute();
const { getStaffAssignmentById, updateStaffAssignment, isLoading, isSubmitting } =
  useStaffAssignments();
const { getStaffs } = useStaffs();
const { getOffices } = useOffice();
const { getStaffRoles } = useStaffRoles();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const merchantId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<StaffAssignment>();
const staffs = ref<Staff[]>([]);
const offices = ref<Office[]>([]);
const roles = ref<Role[]>([]);

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
merchantId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newStaffAssignmentsFormSchema,
});


const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      ...values,
      // supervisorId: values.supervisor?.id ? values.supervisor : null,
      assignmentDate: new Date(values.assignmentDate).toISOString(),
    };
    data.value = await updateStaffAssignment(values.id, newValues); // Call your API function to fetch profile
    navigateTo(`/staffAssignments/${data.value.id}`);
    console.log("New staff assignment data; ", data.value);
    toast({
      title: "Staff assignment Created",
      description: "Staff assignment created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new staff assignment:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

const fetchStaffAssignmentData = async () => {
  try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getStaffAssignmentById(merchantId.value);
  staffs.value = await getStaffs();
  offices.value = await getOffices();
  roles.value = await getStaffRoles();
  let a = {
    ...data.value,
    staffId: data.value?.staff?.id,
    newRoleId: data.value?.role?.name,
    newOfficeId: data.value?.office?.id,
    supervisorStaffId: data.value?.supervisor?.id,
    assignmentDate : data.value.startDate
        ? dateFormatter(data.value.startDate)
        : "",
  };
  form.setValues(a);
} catch (err) {
  console.error("Error fetching staff assignments:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}
}

onMounted(() => {
  fetchStaffAssignmentData();
})



</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>

    <UiCard  v-else-if="data && !isError" class="w-full p-6">
      <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Staff Assignment Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter staff assignment Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="staffId">
              <FormItem class="w-full">
                <FormLabel> Staff </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a staff" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem v-for="item in staffs" :value="item.id">
                        {{ item.firstname }} {{ item.lastname }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="newOfficeId">
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
                      <UiSelectItem v-for="item in offices" :value="item.id">
                        {{ item.name }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="newRoleId">
              <FormItem class="w-full">
                <FormLabel> Role </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a role" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem v-for="item in roles" :value="item.name">
                        {{ item.name }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>


          <FormField v-slot="{ componentField }" name="assignmentDate">
            <FormItem>
              <FormLabel> Assignment Date </FormLabel>
              <FormControl>
                <UiInput
                  type="date"
                  placeholder="Enter start date"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
              v-slot="{ componentField }"
              name="remarks"
            >
              <FormItem class="w-full">
                <FormLabel> Remarks </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter remarks"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

          <UiPermissionGuard permission="UPDATE_STAFF_ASSIGNMENTS" >
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
      <UiNoResultFound title="Sorry, No staff assignment found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
