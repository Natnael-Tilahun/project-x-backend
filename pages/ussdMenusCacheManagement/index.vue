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
import { PermissionConstants } from "~/constants/permissions";

const { storeUssdMenusToCache, changeUssdMenusToCacheStatus, isLoading, cacheThirdPartyMenuListToRedis, removeAllCacheOnMemoryAndOnRedisDb } =
  useUssdMenus();
const isError = ref(false);
const data = ref<UssdMenuList>();

const form = useForm({
  validationSchema: newUssdMenuNamesFormSchema,
});

const storeUssdMenu = async () => {
  try {
    isLoading.value = true;
    const response = await storeUssdMenusToCache();
    console.log(response);
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

const cacheThirdPartyMenuListToRedisHandler = async () => {
  try {
    isLoading.value = true;
    const response = await cacheThirdPartyMenuListToRedis();
    toast({
      title: "Third Party Menu List Stored to Cache",
      description: "Third Party Menu List stored to cache successfully",
    });
  } catch (err) {
    console.error("Error fetching third party menu list:", err);
    toast({
      title: "Error Storing Third Party Menu List to Cache",
      description: "Error storing third party menu list to cache",
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const removeAllCacheOnMemoryAndOnRedisDbHandler = async () => {
  try {
    isLoading.value = true;
    const response = await removeAllCacheOnMemoryAndOnRedisDb();
    toast({
      title: "All Cache Removed",
      description: "All cache removed successfully",
    });
  } catch (err) {
    console.error("Error removing all cache:", err);
    toast({
      title: "Error Removing All Cache",
      description: "Error removing all cache",
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
      <form class="grid md:grid-cols-2 gap-6 w-full">
        <div class="flex flex-row justify-between border p-2 rounded-lg items-center gap-2 border-green-500">
          <UiLabel class="text-base">
            Store All Ussd Menu to Cache
          </UiLabel>
          <UiButton class="w-fit self-end px-5 bg-green-500" size="sm" :disabled="!useHasPermissions(PermissionConstants.UPDATE_USSD_MENU_CACHE_MANAGEMENT) || isLoading
            " @click="storeUssdMenu()">
            <Icon name="svg-spinners:8-dots-rotate" v-if="isLoading" class="mr-2 h-4 w-4 animate-spin"></Icon>
            Store All Ussd Menu to Cache
          </UiButton>
        </div>

        <div class="flex flex-row justify-between border p-2 rounded-lg items-center gap-2 border-green-500">
          <UiLabel class="text-base">
            Start Redis Scheduler
          </UiLabel>
          <UiButton class="w-fit self-end px-5 bg-green-500" size="sm" :disabled="!useHasPermissions(PermissionConstants.UPDATE_USSD_MENU_CACHE_MANAGEMENT) || isLoading
            " @click="startRedisCache()">
            <Icon name="svg-spinners:8-dots-rotate" v-if="isLoading" class="mr-2 h-4 w-4 animate-spin"></Icon>
            Start Redis Scheduler
          </UiButton>
        </div>

        <div class="flex flex-row justify-between border p-2 rounded-lg items-center gap-2 border-red-500">
          <UiLabel class="text-base">
            Stop Redis Scheduler
          </UiLabel>
          <UiButton class="w-fit self-end px-5 bg-red-500" size="sm" :disabled="!useHasPermissions(PermissionConstants.UPDATE_USSD_MENU_CACHE_MANAGEMENT) || isLoading
            " @click="stopRedisCache()">
            <Icon name="svg-spinners:8-dots-rotate" v-if="isLoading" class="mr-2 h-4 w-4 animate-spin"></Icon>
            Stop Redis Scheduler
          </UiButton>
        </div>

        <div class="flex flex-row justify-between border p-2 rounded-lg items-center gap-2 border-green-500">
          <UiLabel class="text-base">
            Cache Third Party Menu List to Redis
          </UiLabel>
          <UiButton class="w-fit self-end px-5 bg-green-500" size="sm" :disabled="!useHasPermissions(PermissionConstants.UPDATE_USSD_MENU_CACHE_MANAGEMENT) || isLoading
            " @click="cacheThirdPartyMenuListToRedisHandler()">
            <Icon name="svg-spinners:8-dots-rotate" v-if="isLoading" class="mr-2 h-4 w-4 animate-spin"></Icon>
            Cache Third Party Menu List to Redis
          </UiButton>
        </div>

        <div class="flex flex-row justify-between border p-2 rounded-lg items-center gap-2 border-red-500">
          <UiLabel class="text-base">
            Remove All Cache on Memory and on Redis Db
          </UiLabel>
          <UiButton class="w-fit self-end px-5 bg-red-500" size="sm" :disabled="!useHasPermissions(PermissionConstants.UPDATE_USSD_MENU_CACHE_MANAGEMENT) || isLoading
            " @click="removeAllCacheOnMemoryAndOnRedisDbHandler()">
            <Icon name="svg-spinners:8-dots-rotate" v-if="isLoading" class="mr-2 h-4 w-4 animate-spin"></Icon>
            Remove All Cache on Memory and on Redis Db
          </UiButton>
        </div>
      </form>
    </UiCard>
  </div>
</template>
