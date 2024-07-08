<script lang="ts" setup>
import { type CustomerEnroll } from "~/components/customerEnroll/columns";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";

const data = ref<CustomerEnroll[]>([]);
const router = useRouter();

const customerEnrollformSchema = toTypedSchema(
  z.object({
    service: z.string(),
    role: z.string(),
  })
);

async function getData(): Promise<CustomerEnroll[]> {
  // Fetch data from your API here.
  return [
    {
      customerId: "728ed52f",
      customerName: "Abebe Kebede",
    },
  ];
}

const isLoading = ref(false);

const form = useForm({
  validationSchema: customerEnrollformSchema,
});

const onSubmit = form.handleSubmit((values: any) => {
  console.log("Form submitted!", values);
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    router.back();
    // navigateTo("/customers/customerDetails");
  }, 3000);
});

onMounted(async () => {
  data.value = await getData();
});
</script>

<template>
  <div v-if="data.length > 0" class="p-5 flex flex-col space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="md:text-xl items-center text-gray-500">
        User: <span>Abebe Kebede</span>
      </h1>
      <UiButton variant="outline" class="p-6 rounded-lg"
        >Add Customer ID</UiButton
      >
    </div>
    <UiCard class="p-6">
      <form
        @submit="onSubmit"
        class="flex flex-col justify-between min-h-[300px]"
      >
        <UiTable>
          <UiTableHeader>
            <UiTableRow>
              <UiTableHead class=""> customerId </UiTableHead>
              <UiTableHead>customerName</UiTableHead>
              <UiTableHead>service</UiTableHead>
              <UiTableHead class=""> roll </UiTableHead>
            </UiTableRow>
          </UiTableHeader>
          <UiTableBody>
            <UiTableRow v-for="(d, index) of data" :key="index">
              <UiTableCell class="font-medium">
                {{ d.customerId }}
              </UiTableCell>
              <UiTableCell>{{ d.customerName }}</UiTableCell>
              <UiTableCell>
                <FormField v-slot="{ componentField }" name="service">
                  <FormItem>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue placeholder="Select a service" />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem value="Retail Banking">
                            Retail online banking
                          </UiSelectItem>
                          <UiSelectItem value="Wealth Online Banking">
                            Wealth Online Banking
                          </UiSelectItem>
                          <UiSelectItem
                            value="Retail and wealth online banking"
                          >
                            Retail and wealth online banking
                          </UiSelectItem>
                          <UiSelectItem value="Corporate Online Banking">
                            Corporate Online Banking
                          </UiSelectItem>
                          <UiSelectItem value="SME Online Banking">
                            SME Online Banking
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </UiTableCell>
              <UiTableCell class="">
                <FormField v-slot="{ componentField }" name="role">
                  <FormItem>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue placeholder="Select a role" />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem value="Administrator">
                            Administrator
                          </UiSelectItem>
                          <UiSelectItem value="Authorizer">
                            Authorizer
                          </UiSelectItem>
                          <UiSelectItem value="Creator"> Creator </UiSelectItem>
                          <UiSelectItem value="Viewer"> Viewer </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </UiTableCell>
            </UiTableRow>
          </UiTableBody>
        </UiTable>

        <div class="flex justify-between">
          <UiButton variant="outline" size="lg" class="">Cancel</UiButton>
          <UiButton size="lg" :disabled="isLoading" type="submit">
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>

            Enroll
          </UiButton>
        </div>
      </form>
    </UiCard>
  </div>
  <div v-else class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
</template>

<style lang="css" scoped></style>
