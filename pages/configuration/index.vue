<template>
  <div v-if="isLoading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div v-else-if="allConfiguration && configuration.length && !isError" class="w-full space-y-6">
    <div class="w-full space-y-4" v-if="allConfiguration && configuration.length">
      <div class="flex gap-4 items-center">
        <UiLabel class="text-base">Filter:</UiLabel>
        <UiInput type="text" v-model="filtered" class="form-control" />
      </div>
      <h3 class="text-lg font-medium">Spring configuration</h3>
      <UiTable class="border bg-background w-full">
        <UiTableHeader class="bg-slate-50 w-full">
          <UiTableRow>
            <UiTableHead class="w-40" @click="changeOrder('prefix')">Prefix</UiTableHead>
            <UiTableHead class="w-60" @click="changeOrder('properties')">Properties</UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow v-for="entry in filteredConfiguration" :key="entry.prefix">
            <UiTableCell>
              <span>{{ entry.prefix }}</span>
            </UiTableCell>
            <UiTableCell>
              <div class="row" v-for="key in keys(entry.properties)" :key="key">
                <div class="col-md-4">{{ key }}</div>
                <div class="col-md-8">
                  <span class="float-right break">{{ entry.properties[key] }}</span>
                </div>
              </div>
            </UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
      <div class="space-y-1" v-for="key in keys(allConfiguration)" :key="key">
        <h2 class="font-medium text-lg">
          {{ key }}
        </h2>
        <UiTable class="border bg-background w-full">
          <UiTableHeader class="bg-slate-50 w-full">
            <UiTableRow>
              <UiTableHead class="w-40">Property</UiTableHead>
              <UiTableHead class="w-60">Value</UiTableHead>
            </UiTableRow>
          </UiTableHeader>
          <UiTableBody>
            <UiTableRow v-for="item of allConfiguration[key]" :key="item.key">
              <UiTableCell class="break">{{ item.key }}</UiTableCell>
              <UiTableCell class="break">
                <span class="float-right badge-secondary break">{{ item.val }}</span>
              </UiTableCell>
            </UiTableRow>
          </UiTableBody>
        </UiTable>
      </div>
    </div>
    <div v-else>
      <span>No configuration data found.</span>
    </div>
  </div>
  <div v-else-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref } from 'vue';
import { useLoggers } from '~/composables/useLoggers';
import { orderAndFilterBy } from '~/computables';

const { getConfigprops, getEnv } = useLoggers();

const orderProp = ref('prefix');
const reverse = ref(false);
const allConfiguration: Ref<any> = ref({});
const configuration: Ref<any[]> = ref([]);
const filtered = ref('');
const isError = ref(false)
const isLoading = ref(false)

// Helper to extract the correct context and beans array (like your reference)
function extractConfigBeans(res: any): any[] {
  if (res.contexts !== undefined) {
    for (const key in res.contexts) {
      if (!key.startsWith('bootstrap')) {
        // Use the first non-bootstrap context
        return Object.values(res.contexts[key].beans);
      }
    }
  }
  // fallback: use workingjhipster context if present
  if (res.contexts && res.contexts.workingjhipster) {
    return Object.values(res.contexts.workingjhipster.beans);
  }
  return [];
}

const fetchConfigprops = async () => {
  try {
    isLoading.value = true;
    const configData = await getConfigprops();
    configuration.value = configData ? extractConfigBeans(configData) : [];
  } catch (err) {
    console.error("Error fetching Configprops:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const fetchEnv = async () => {
  try {
    isLoading.value = true;
    const envData = await getEnv();
    if (envData && envData.propertySources) {
      allConfiguration.value = envData.propertySources.reduce((acc, propertyObject) => {
        const name = propertyObject.name;
        const detailProperties = propertyObject.properties;
        const vals = [];
        for (const keyDetail in detailProperties) {
          if (Object.hasOwn(detailProperties, keyDetail)) {
            vals.push({ key: keyDetail, val: detailProperties[keyDetail].value });
          }
        }
        acc[name] = vals;
        return acc;
      }, {});
    } else {
      allConfiguration.value = {};
    }
  } catch (err) {
    console.error("Error fetching env:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Fetch configuration and env on mount
const init = async () => {
  const configData = await getConfigprops();
  configuration.value = configData ? extractConfigBeans(configData) : [];

  await fetchConfigprops()
  await fetchEnv()
};

const filteredConfiguration = computed(() =>
  orderAndFilterBy(configuration.value, {
    filterByTerm: filtered.value,
    orderByProp: orderProp.value,
    reverse: reverse.value,
  }),
);

const keys = (dict: any): string[] => (dict === undefined ? [] : Object.keys(dict));

const changeOrder = (prop: string): void => {
  orderProp.value = prop;
  reverse.value = !reverse.value;
};

onMounted(init);

const refetch = async () => {
  await init();
};

</script>
