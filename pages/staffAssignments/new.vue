<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ref, onBeforeUnmount } from "vue";
import { toast } from "~/components/ui/toast";
import { newStaffAssignmentsFormSchema } from "~/validations/newStaffAssignmentsFormSchema";
import type { Office, Staff, StaffAssignment, Role } from "~/types";
const { createNewStaffAssignment, isLoading } = useStaffAssignments();
const { getOffices, isLoading: isLoadingOffices } = useOffice();
const { getStaffRoles, isLoading: isLoadingRoles } = useStaffRoles();
const { getStaffs, isLoading: isLoadingStaffs } = useStaffs();

const isError = ref(false);
const data = ref<StaffAssignment>();
const isSubmitting = ref(false);
const loading = ref(false);
const offices = ref<Office[]>([]);
const roles = ref<Role[]>([]);
const staffs = ref<Staff[]>([]);

const form = useForm({
  validationSchema: newStaffAssignmentsFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const newValues = {
      ...values,
      assignmentDate: new Date(values.assignmentDate).toISOString(),
      // endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
    };
    console.log("newValues: ", newValues);
    const response = await createNewStaffAssignment(newValues); // Call your API function to fetch profile
    data.value = response;
    console.log("New staff assignment data; ", data.value);
    toast({
      title: "Staff assignment Created",
      description: "Staff assignment created successfully",
    });
    navigateTo(`/staffAssignments/d7670f39-9554-4de6-83cf-7a28f774bafa?activeTab=staffAssignments`);
  } catch (err: any) {
    console.error("Error creating new staff assignment:", err.message);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    staffs.value = await getStaffs();
    offices.value = await getOffices();
    roles.value = await getStaffRoles();
  } catch (err) {
    console.error("Error fetching datas:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

onBeforeUnmount(() => {
  isError.value = false;
  data.value = undefined;
  isSubmitting.value = false;
});

onMounted(() => {
  fetchData();
})
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">
        Create New Staff Assignment
      </h1>
      <p class="text-sm text-muted-foreground">
        Create new staff assignment by including staff Name, branch, role, start
        date and end date
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
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
                      <UiSelectItem v-for="item in staffs" :value="item.id || ''">
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

            <FormField v-slot="{ componentField }" name="supervisorStaffId">
              <FormItem class="w-full">
                <FormLabel> Supervisor </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a supervisor" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem v-for="item in staffs" :value="item.id || ''">
                        {{ item.firstname }} {{ item.lastname }}
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
                    placeholder="Enter assignment date"
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
