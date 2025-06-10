<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { getIdFromPath, splitPath } from "~/lib/utils";
import type { ChargeRule } from "~/types";
import { columns as tableColumns } from "~/components/chargeRules/columns"; // Renamed to avoid conflict

const { getChargeById, getChargeRulesByChargeId } = useCharges();
const { pageNumber } = usePagesInfoStore();

const loading = ref(false);
const isError = ref(false);
const data = ref<ChargeRule[]>([]);
const chargeId = ref<string>("");
const route = useRoute();
chargeId.value = getIdFromPath();

const fetchChargeRulesData = async () => {
  if (!chargeId.value) return;

  try {
    loading.value = true;
    const response = await getChargeRulesByChargeId(chargeId.value);
    data.value = response ||  [];
  } catch (err) {
    console.error("Error fetching charge rules:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};


onMounted(async () => {
  if (chargeId.value) {
    await fetchChargeRulesData();
  }
});

const refetch = async () => {
  await fetchChargeRulesData();
};


// Provide the refetch function
provide('refetchChargeRules', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
</script>

<template>
  <div v-if="loading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-4 flex flex-col space-y-10 mx-auto"
  >
    <UiPermissionGuard permission="CREATE_CHARGE_RULE">
      <NuxtLink
        class="w-fit self-end"
        @click="
          navigateTo({
            path: route.path,
            query: {
              activeTab: 'newChargeRule',
            },
          })
        "
      >
        <UiButton>
          <Icon name="material-symbols:add" size="24" class="mr-2"></Icon>
          Add New Charge Rule
        </UiButton>
      </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data" :loading="loading">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by rule type"
              :model-value="(table?.getColumn('ruleType')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('ruleType')
                  ?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
  </div>

  <div v-else-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
