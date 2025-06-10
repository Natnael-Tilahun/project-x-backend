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
import { newStaffFormSchema } from "~/validations/newStaffFormSchema";
import type { Office, Role, Staff } from "~/types";

const { createNewStaff, isLoading } = useStaffs();
const { getOffices, isLoading: isLoadingOffices } = useOffice();
const { getStaffRoles, isLoading: isLoadingRoles } = useStaffRoles();
const { getStaffs, isLoading: isLoadingStaffs } = useStaffs();

const isError = ref(false);
const data = ref<Staff>();
const isSubmitting = ref(false);
const loading = ref(false);
const offices = ref<Office[]>([]);
const roles = ref<Role[]>([]);
const staffs = ref<Staff[]>([]);

const form = useForm({
  validationSchema: newStaffFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    console.log("values: ", values);
    const newValues = {
      ...values,
      assignmentDate: values.assignmentDate ? new Date(values.assignmentDate).toISOString() : null,
    }
    const response = await createNewStaff(newValues); // Call your API function to fetch profile
    data.value = response ? response : undefined;
    console.log("New staff data; ", data.value);
    toast({
      title: "Staff Created",
      description: "Staff created successfully",
    });
    navigateTo(`/staffs`);
  } catch (err: any) {
    console.error("Error creating new staff:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});

onBeforeUnmount(() => {
  isError.value = false;
  data.value = undefined;
  isSubmitting.value = false;
});

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    staffs.value = await getStaffs() ?? [];
    offices.value = await getOffices() ?? [];
    roles.value = await getStaffRoles() ?? [];
  } catch (err) {
    console.error("Error fetching datas:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};


onMounted(() => {
  fetchData();
})
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Staff</h1>
      <p class="text-sm text-muted-foreground">
        Create new staff by including First Name,external id, email, origanizational role type and phone number
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="firstname">
              <FormItem>
                <FormLabel>First Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter staff first name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="middlename">
              <FormItem>
                <FormLabel>Middle Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter staff middle name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="lastname">
              <FormItem>
                <FormLabel>Last Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter staff last name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="staffId">
              <FormItem>
                <FormLabel> Staff Id </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter staff id"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="emailAddress">
              <FormItem>
                <FormLabel> Email Address </FormLabel>
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
            <FormField v-slot="{ componentField }" name="mobileNo">
              <FormItem>
                <FormLabel> Phone Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter phone number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter staff user name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ value, handleChange }" name="assign">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel class="text-base"> Add Assignment </FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="value"
                    @update:checked="handleChange"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <UiCard v-if="form.values.assign" class="col-span-full grid md:grid-cols-2 p-6 gap-6">
            <h1 class="col-span-full font-bold text-lg w-full border-b-2 pb-2">Staff Assignment</h1>
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
                      <UiSelectItem class="w-full" v-for="item in offices" :value="item.id">
                        <div class="flex justify-between md:gap-4 gap-2 items-center">
                          <span class="text-left ">{{ item.name }}</span>
                          <span> - </span>
                          <span class="text-right ">  ( {{ item.code }} )</span>
                        </div>
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
            </UiCard>
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
