<template>
    <div v-if="isLoading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div v-else-if="healthData && !isError" class="w-full space-y-6">
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 id="health-page-heading" class="text-2xl font-medium" data-cy="healthPageHeading">Health</h1>
      <UiButton class="btn btn-primary float-right" @click="refresh" :disabled="isLoading">
        <Icon name="svg-spinners:8-dots-rotate" v-if="isLoading" class="mr-2 h-4 w-4 animate-spin"></Icon>
        <Icon v-else name="majesticons:refresh" class="h-6 w-6 mr-2"></Icon>
        <span>Refresh</span>
      </UiButton>
    </div>
    <div class="table-responsive">
      <UiTable id="healthCheck" class="border rounded-xl table-striped" aria-describedby="Health check">
        <UiTableHeader class="bg-blue-100 rounded-xl">
          <UiTableRow>
            <UiTableHead scope="col">Service</UiTableHead>
            <UiTableHead class="text-center" scope="col">Status</UiTableHead>
            <UiTableHead class="text-center" scope="col">Details</UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow v-for="health in healthData" :key="health.name">
            <UiTableCell>
              <span>{{ getBaseName(health.name) }}</span>
              {{ getSubSystemName(health.name) }}
            </UiTableCell>
            <UiTableCell class="text-center">
              <UiBadge :class="getBadgeClass(health.status)">
                {{ health.status }}
              </UiBadge>
            </UiTableCell>
            <UiTableCell class="flex justify-center ">
              <Icon v-if="health.details || health.error" name="material-symbols:visibility-rounded"
                class="absolute flex  items-center w-6 h-6 cursor-pointer text-primary"
                @click="showHealth(health)" />
            </UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
    </div>
  </div>
</div>
  <div v-else-if="isError">
    <ErrorMessage :retry="refresh" title="Something went wrong." />
  </div>
  <UiAlertDialog :open="openEditModal" :onOpenChange="setOpenEditModal">
    <UiAlertDialogContent class="max-w-5xl overflow-x-auto">
      <UiAlertDialogHeader>
        <UiAlertDialogTitle class="text-2xl border-b">{{ getBaseName(currentHealth.name) }}</UiAlertDialogTitle>
        <UiAlertDialogDescription class="w-full">
          <div class="space-y-" v-if="currentHealth && currentHealth.details">
            <h5 class="text-lg font-medium">Properties</h5>
            <div class="table-responsive">
              <UiTable class="w-full border" aria-describedby="Health">
                <UiTableHeader class="bg-blue-100 rounded-xl">
                  <UiTableRow>
                    <UiTableHead class="text-left" scope="col">Name</UiTableHead>
                    <UiTableHead class="text-left" scope="col">Value</UiTableHead>
                  </UiTableRow>
                </UiTableHeader>
                <UiTableBody>
                  <UiTableRow v-for="(value, key) in currentHealth.details" :key="key">
                    <UiTableCell class="text-left">{{ key }}</UiTableCell>
                    <UiTableCell class="text-left">{{ readableValue(value) }}</UiTableCell>
                  </UiTableRow>
                </UiTableBody>
              </UiTable>
            </div>
          </div>
          <div v-else class="border p-6 text-center rounded-lg">
            <h1>No details for this health</h1>
          </div>
          <div class="space-y-4" v-if="currentHealth && currentHealth.error">
            <h4>Error</h4>
            <pre>{{ currentHealth.error }}</pre>
          </div>
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Close
        </UiAlertDialogCancel>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLoggers } from '~/composables/useLoggers';

const { getHealth } = useLoggers();

const healthData = ref<any[]>([]);
const currentHealth = ref<any>(null);
const isLoading = ref(false)
const openEditModal = ref(false);
const isError = ref(false)

const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};
// --- Health transformation logic (from HealthService) ---
function getBaseName(name: string): string {
  if (name) {
    const split = name.split('.');
    return split[0];
  }
  return '';
}

function getSubSystemName(name: string): string {
  if (name) {
    const split = name.split('.');
    split.splice(0, 1);
    const remainder = split.join('.');
    return remainder ? ` - ${remainder}` : '';
  }
  return '';
}

function getBadgeClass(statusState: string) {
  return statusState === 'UP' ? 'bg-green-500' : 'bg-red-500';
}

function addHealthObject(result: any[], isLeaf: boolean, healthObject: any, name: string) {
  const healthData = {
    name,
    details: undefined as any,
    error: undefined as any,
    status: healthObject.status
  };

  const details: Record<string, any> = {};
  let hasDetails = false;

  for (const key in healthObject) {
    if (Object.hasOwn(healthObject, key)) {
      const value = healthObject[key];
      if (key === 'status' || key === 'error') {
        healthData[key] = value;
      } else {
        if (!isHealthObject(value)) {
          details[key] = value;
          hasDetails = true;
        }
      }
    }
  }

  if (hasDetails) {
    healthData.details = details;
  }

  if (isLeaf || hasDetails || healthData.error) {
    result.push(healthData);
  }
  return healthData;
}

function flattenHealthData(result: any[], path: string | null, data: any): any[] {
  for (const key in data) {
    if (Object.hasOwn(data, key)) {
      const value = data[key];
      if (isHealthObject(value)) {
        if (hasSubSystem(value)) {
          addHealthObject(result, false, value, getModuleName(path, key));
          flattenHealthData(result, getModuleName(path, key), value);
        } else {
          addHealthObject(result, true, value, getModuleName(path, key));
        }
      }
    }
  }
  return result;
}

function getModuleName(path: string | null, name: string) {
  if (path && name) {
    return path + '.' + name;
  } else if (path) {
    return path;
  } else if (name) {
    return name;
  }
  return '';
}

function hasSubSystem(healthObject: any): boolean {
  let result = false;
  for (const key in healthObject) {
    if (Object.hasOwn(healthObject, key)) {
      const value = healthObject[key];
      if (value && value.status) {
        result = true;
      }
    }
  }
  return result;
}

function isHealthObject(healthObject: any): boolean {
  let result = false;
  for (const key in healthObject) {
    if (Object.hasOwn(healthObject, key)) {
      if (key === 'status') {
        result = true;
      }
    }
  }
  return result;
}

function transformHealthData(data: any): any[] {
  const response: any[] = [];
  flattenHealthData(response, null, data.components);
  return response;
}
// --- End health transformation logic ---

async function refresh() {
  isLoading.value = true;
  try {
    const res = await getHealth();
    if (res && res.components) {
      healthData.value = transformHealthData(res);
    } else {
      healthData.value = [];
    }
  } catch (error: any) {
    if (error?.status === 503 && error?.error?.components) {
      healthData.value = transformHealthData(error.error);
    } else {
      healthData.value = [];
    }
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}

function showHealth(health: any) {
  currentHealth.value = health;
  setOpenEditModal(true)
}

onMounted(() => {
  refresh();
});

function readableValue(value: any): string {
  if (currentHealth.value?.name === 'diskSpace') {
    const val = value / 1073741824;
    if (val > 1) {
      return `${val.toFixed(2)} GB`;
    }
    return `${(value / 1048576).toFixed(2)} MB`;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value?.toString?.() ?? '';
}
</script>
