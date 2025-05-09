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

const { storeUssdMenusToCache, changeUssdMenusToCacheStatus, isLoading } =
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
};

const startRedisCache = async () => {
  try {
    isLoading.value = true;
    const status = {
      command: "START",
    };
    const response = await changeUssdMenusToCacheStatus(status);
    console.log("response", response);
    toast({
      title: "Redis Scheduler Started",
      description: "Redis scheduler started successfully",
    });
  } catch (err) {
    console.error("Error starting Redis Scheduler:", err);
    toast({
      title: "Error Starting Redis Scheduler",
      description: "Error starting Redis Scheduler",
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const stopRedisCache = async () => {
  try {
    isLoading.value = true;
    const status = {
      command: "STOP",
    };
    const response = await changeUssdMenusToCacheStatus(status);
    console.log("response", response);
    toast({
      title: "Redis Scheduler Stopped",
      description: "Redis scheduler stopped successfully",
    });
  } catch (err) {
    console.error("Error stopping Redis Scheduler:", err);
    toast({
      title: "Error Stopping Redis Scheduler",
      description: "Error stopping Redis Scheduler",
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">
        Ussd Menus Cache Management
      </h1>
      <p class="text-sm text-muted-foreground">Store all ussd menus to cache</p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full p-6 pb-20">
      <form class="grid grid-cols-2 gap-6 w-full">
        <FormField v-slot="{ value, handleChange }" name="storeAllUssdMenu">
          <FormItem
            class="flex flex-row items-end justify-between rounded-lg border pb-2 px-4 w-full gap-10 self-end"
          >
            <FormLabel class="text-base">
              Store All Ussd Menu to Cache
            </FormLabel>
            <FormControl>
              <UiSwitch
                :disabled="
                  !useHasPermissions('UPDATE_USSD_MENU_CACHE_MANAGEMENT')
                "
                :checked="storeAllUssdMenu"
                @update:checked="
                  (checked) => {
                    storeAllUssdMenu = checked;
                    storeUssdMenu();
                  }
                "
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="startRedisCache">
          <FormItem
            class="flex flex-row items-end justify-between rounded-lg border border-green-500 pb-2 px-4 w-full gap-10 self-end"
          >
            <FormLabel class="text-base"> Start Redis Scheduler </FormLabel>
            <FormControl>
              <UiSwitch
                :disabled="
                  !useHasPermissions('UPDATE_USSD_MENU_CACHE_MANAGEMENT')
                "
                class="data-[state=checked]:bg-green-500"
                :checked="value"
                @update:checked="
                  (checked) => {
                    handleChange;
                    startRedisCache();
                  }
                "
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="stopRedisCache">
          <FormItem
            class="flex flex-row items-end justify-between rounded-lg border border-red-500 pb-2 px-4 w-full gap-10 self-end"
          >
            <FormLabel class="text-base"> Stop Redis Scheduler </FormLabel>
            <FormControl>
              <UiSwitch
                :disabled="
                  !useHasPermissions('UPDATE_USSD_MENU_CACHE_MANAGEMENT')
                "
                class="data-[state=checked]:bg-red-500"
                :checked="value"
                @update:checked="
                  (checked) => {
                    handleChange;
                    stopRedisCache();
                  }
                "
              />
            </FormControl>
          </FormItem>
        </FormField>
      </form>
    </UiCard>
  </div>
</template>
