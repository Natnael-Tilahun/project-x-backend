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
import { newServiceDefinitionRoleFormSchema } from "~/validations/newServiceDefinitionRoleFormSchema";
import type { ServiceDefinition, ServiceDefinitionRole, Role } from "~/types";

const { createNewServiceDefinitionRole, isLoading } =
  useServiceDefinitionsRoles();

const isError = ref(false);
const data = ref<ServiceDefinitionRole>();
const isSubmitting = ref(false);
const serviceDefinition = ref<ServiceDefinition>();
const route = useRoute();

const props = defineProps<{
  serviceDefinitionProps?: ServiceDefinition;
}>();

if (props?.serviceDefinitionProps) {
  serviceDefinition.value = props?.serviceDefinitionProps;
}
const form = useForm({
  validationSchema: newServiceDefinitionRoleFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const newValues = {
      ...values,
      serviceDefinitionId: serviceDefinition.value?.id,
    };
    data.value = await createNewServiceDefinitionRole(newValues); // Call your API function to fetch profile
    navigateTo({
      path: route.path,
      query: {
        activeTab: "serviceDefinitionRoleDetails",
        serviceDefinitionRoleId: data.value?.id,
      },
    });
    toast({
      title: "Service Definition Role Created",
      description: "Service Definition Role created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new service definition role:", err.message);
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
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8 p-6">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">
        Create New Service Definition Role
      </h1>
      <p class="text-sm text-muted-foreground">
        Create new service definition role by including service definition and
        role
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid gap-6">
            <FormField v-slot="{ componentField }" name="roleName">
              <FormItem>
                <FormLabel>Role Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter service definition role name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="roleDescription">
              <FormItem>
                <FormLabel>Role Description </FormLabel>
                <FormControl>
                  <UiTextarea
                    type="text"
                    placeholder="Enter service definition role description"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.isDefault"
              v-slot="{ value, handleChange }"
              name="isDefault"
            >
              <FormItem>
                <FormLabel> Is Default </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
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
