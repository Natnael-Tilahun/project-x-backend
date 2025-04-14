<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newUssdMenuNamesFormSchema } from "~/validations/newUssdMenuNamesFormSchema";
import type { UssdMenuList } from "~/types";

const { storeUssdMenusToCache, isLoading } =
  useUssdMenus();
const isError = ref(false);
const data = ref<UssdMenuList>();
const isSubmitting = ref(false);
const storeAllUssdMenu = ref(false);

const form = useForm({
  validationSchema: newUssdMenuNamesFormSchema,
});

const storeUssdMenu = async () => {
  console.log("storeUssdMenu", storeAllUssdMenu.value);
  try {
    isLoading.value = true;
    data.value = await storeUssdMenusToCache();
    toast({
      title: "Ussd Menu Stored to Cache",
      description: "Ussd Menu stored to cache successfully",
    }); 
  } catch (err) {
    console.error("Error fetching ussd menu:", err);
    toast({
      title: "Error Storing Ussd Menu to Cache",
      description: "Error storing ussd menu to cache",
      variant: "destructive",
    }); 
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}

const startRedisCache = async () => {
  console.log("startRedisCache", true);
}

const stopRedisCache = async () => {
  console.log("stopRedisCache", true);
}
// const onSubmit = form.handleSubmit(async (values: any) => {
//   console.log("values: ", values);

//   try {
//     isSubmitting.value = true;
//     isLoading.value = true;
//     const updatedValues = {
//       ...values,
//     };
//     console.log("updatedValues: ", updatedValues);
//     data.value = await createNewUssdMenu(updatedValues); // Call your API function to fetch profile
//     navigateTo(`/ussdMenus/${data.value.id}`);
//     console.log("New ussd menu data; ", data.value);
//     toast({
//       title: "Ussd Menu Created",
//       description: "Ussd Menu created successfully",
//     });
//   } catch (err: any) {
//     console.error("Error creating new ussd menu:", err.message);
//     isError.value = true;
//   } finally {
//     isLoading.value = false;
//     isSubmitting.value = false;
//   }
// });
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Ussd Menus Cache Management</h1>
      <p class="text-sm text-muted-foreground">
        Store all ussd menus to cache
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full p-6 pb-20">
        <form class="grid grid-cols-2 gap-6 w-full">
            <FormField v-slot="{ value, handleChange }" name="storeAllUssdMenu">
          <FormItem class="flex flex-row items-end justify-between rounded-lg border pb-2 px-4 w-full gap-10 self-end">
            <FormLabel class="text-base"> Store All Ussd Menu to Cache </FormLabel>
            <FormControl>
              <UiSwitch :checked="storeAllUssdMenu" @update:checked="
                (checked) => {
                  storeAllUssdMenu = checked;
                  storeUssdMenu();
                }
              " />
            </FormControl>
          </FormItem>
        </FormField>
<!--     
        <FormField v-slot="{ value, handleChange }" name="visible">
          <FormItem class="flex flex-row items-end justify-between rounded-lg border pb-2 px-4 w-full gap-10 self-end">
            <FormLabel class="text-base"> Start Redis Cache </FormLabel>
            <FormControl>
              <UiSwitch :checked="value" @update:checked="
                (checked) => {
                  handleChange;
                  startRedisCache();
                }
              " />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="visible">
          <FormItem class="flex flex-row items-end justify-between rounded-lg border pb-2 px-4 w-full gap-10 self-end">
            <FormLabel class="text-base"> Stop Redis Cache </FormLabel>
            <FormControl>
              <UiSwitch :checked="value" @update:checked="
                (checked) => {
                  handleChange;
                  stopRedisCache();
                }
              " />
            </FormControl>
          </FormItem>
        </FormField> -->

            <!-- <div class="col-span-full w-full py-4 flex justify-between">
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
            </div> -->
        </form>
    </UiCard>
  </div>
</template>
