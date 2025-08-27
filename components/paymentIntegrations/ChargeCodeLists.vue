<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toast } from "~/components/ui/toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Charge } from "~/types";
import { getIdFromPath } from "~/lib/utils";
import { usePaymentIntegrations } from "~/composables/usePaymentIntegrations";
import { useCharges } from "~/composables/useCharges";

const route = useRoute();

// Composables
const { getCharges } = useCharges();
const {
  getChargeCodeListsByIntegrationId,
  createChargeCodeListByIntegrationId,
  deleteChargeCodeListByIntegrationId,
} = usePaymentIntegrations();

// State
const integrationId = ref<string>(getIdFromPath(route.path));
const chargesData = ref<Charge[]>([]);
const selectedChargeCodes = ref<string[]>([]); // assigned charge codes
const isError = ref(false);
const loading = ref(false);
const isSubmitting = ref(false);

// Modals
const openAddModal = ref(false);
const setOpenAddModal = (value: boolean) => (openAddModal.value = value);

const openDeleteModal = ref(false);
const setOpenDeleteModal = (value: boolean) =>
  (openDeleteModal.value = value);

// Fetch all charges
const fetchChargesData = async () => {
  try {
    loading.value = true;
    const response = await getCharges(0, 100000);
    chargesData.value =
      (response
        ?.slice()
        ?.sort((a, b) =>
          (a.chargeCode || "").toLowerCase().localeCompare((b.chargeCode || "").toLowerCase())
        ) || []);
  } catch (err) {
    console.error("Error fetching charges:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

// Fetch charge codes already assigned to this integration
const fetchIntegrationChargeCodes = async () => {
  try {
    loading.value = true;
    const response = await getChargeCodeListsByIntegrationId(integrationId.value);
    selectedChargeCodes.value = response || [];
  } catch (err) {
    console.error("Error fetching integration charge codes:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchChargesData();
  await fetchIntegrationChargeCodes();
});

const refetch = async () => {
  isError.value = false;
  await fetchChargesData();
  await fetchIntegrationChargeCodes();
};

// Selection state
const selectedToAdd = ref<string[]>([]);
const selectedToDelete = ref<string[]>([]);

// Bulk select helpers
const selectAllAvailable = () => {
  selectedToAdd.value = chargesData.value
    .filter((c) => !selectedChargeCodes.value.includes(c.chargeCode as string))
    .map((c) => c.chargeCode as string);
};
const unselectAllAvailable = () => {
  selectedToAdd.value = [];
};

const selectAllAssigned = () => {
  selectedToDelete.value = selectedChargeCodes.value.slice();
};
const unselectAllAssigned = () => {
  selectedToDelete.value = [];
};

// Actions
const addSelected = async () => {
  if (selectedToAdd.value.length === 0) return;
  try {
    isSubmitting.value = true;
    await createChargeCodeListByIntegrationId(integrationId.value, {
      chargeCodes: selectedToAdd.value,
    });
    toast({
      title: "Charge Codes Added",
      description: "Selected charge codes have been assigned to the payment integration.",
    });
    await fetchIntegrationChargeCodes();
    selectedToAdd.value = [];
    setOpenAddModal(false);
  } catch (err) {
    console.error("Error adding charge codes:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const deleteSelected = async () => {
  if (selectedToDelete.value.length === 0) return;
  try {
    isSubmitting.value = true;
    await deleteChargeCodeListByIntegrationId(integrationId.value, {
      chargeCodes: selectedToDelete.value,
    });
    toast({
      title: "Charge Codes Removed",
      description: "Selected charge codes have been removed from the payment integration.",
    });
    await fetchIntegrationChargeCodes();
    selectedToDelete.value = [];
    setOpenDeleteModal(false);
  } catch (err) {
    console.error("Error deleting charge codes:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <UiCard class="flex flex-col gap-6 items-center p-6 h-full">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>

    <div v-else-if="chargesData.length > 0 && !isError" class="w-full h-full" style="min-height: 400px;">
      <div class="flex gap-8 h-full w-full">
        <!-- Left: Available -->
        <div class="w-full  max-h-[700px] min-h-96 flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <p class="font-medium">Available Charge Codes</p>
            <p class="text-sm text-muted-foreground">
              {{ selectedToAdd.length }} of
              {{chargesData.filter(c => !selectedChargeCodes.includes(c.chargeCode as string)).length}}
              selected
            </p>
          </div>

          <div class="flex items-center gap-2 mb-2">
            <UiButton variant="outline" size="sm" @click="selectAllAvailable"
              :disabled="!chargesData.filter(c => !selectedChargeCodes.includes(c.chargeCode as string)).length">
              Select All
            </UiButton>
            <UiButton variant="outline" size="sm" @click="unselectAllAvailable" :disabled="!selectedToAdd.length">
              Unselect All
            </UiButton>
            <UiButton class="ml-auto w-fit bg-green-600" :disabled="selectedToAdd.length === 0 || isSubmitting"
              @click="setOpenAddModal(true)">
              <Icon name="heroicons:plus-circle" v-if="!isSubmitting" class="mr-2 h-4 w-4" />
              <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              Add {{ selectedToAdd.length ? `(${selectedToAdd.length})` : '' }}
            </UiButton>
          </div>

          <UiCard class="p-4 gap-2 flex-1 flex flex-col overflow-y-auto">
            <FormField v-for="charge in chargesData" :key="charge.id"
              :model-value="selectedToAdd.includes(charge.chargeCode as string)" name="availableChargeCodes">
              <div class="flex w-full justify-between items-center border p-2 rounded-lg">
                <FormItem class="w-full flex items-center gap-2">
                  <FormControl>
                    <UiCheckbox class="self-end" :checked="selectedToAdd.includes(charge.chargeCode as string)"
                      :disabled="selectedChargeCodes.includes(charge.chargeCode as string)" @update:checked="checked => {
                        if (checked) {
                          selectedToAdd.push(charge.chargeCode as string)
                        } else {
                          selectedToAdd = selectedToAdd.filter(id => id !== (charge.chargeCode as string))
                        }
                      }" />
                  </FormControl>
                  <FormLabel class="w-full "
                    :class="{ 'text-gray-400': selectedChargeCodes.includes(charge.chargeCode as string) }">
                    <div class="flex items-center w-full gap-2 justify-between">
                      <div class="flex items-center gap-2">
                        <p>{{ charge.chargeCode }} </p>
                        <p class="text-muted-foreground">({{ charge.category }})</p>
                      </div>
                      <div class="truncate text-muted-foreground self-end w-full text-right font-normal">{{ charge.description }}</div>
                    </div>
                  </FormLabel>
                </FormItem>
              </div>
            </FormField>
          </UiCard>

          <UiButton class="mt-4 w-full bg-green-600" :disabled="selectedToAdd.length === 0 || isSubmitting"
            @click="setOpenAddModal(true)">
            <Icon name="heroicons:plus-circle" v-if="!isSubmitting" class="mr-2 h-4 w-4" />
            <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Add {{ selectedToAdd.length ? `(${selectedToAdd.length})` : '' }}
          </UiButton>
        </div>

        <!-- Middle: Bi-directional Arrow -->
        <div class="flex flex-col items-center justify-center gap-2 w-1/2 h-full self-center">
          <Icon name="heroicons:arrow-right" :class="selectedToAdd.length != 0 && 'text-primary'"
            class="h-10 w-10 text-gray-400" />
          <Icon name="heroicons:arrow-left" :class="selectedToDelete.length != 0 && 'text-primary'"
            class="h-10 w-10 text-gray-400" />
        </div>

        <!-- Right: Assigned -->
        <div class="w-full min-h-min flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <p class="font-medium">Assigned Charge Codes</p>
            <p class="text-sm text-muted-foreground">
              {{ selectedToDelete.length }} of {{ selectedChargeCodes.length }} selected
            </p>
          </div>

          <div class="flex items-center gap-2 mb-2">
            <UiButton variant="outline" size="sm" @click="selectAllAssigned" :disabled="!selectedChargeCodes.length">
              Select All
            </UiButton>
            <UiButton variant="outline" size="sm" @click="unselectAllAssigned" :disabled="!selectedToDelete.length">
              Unselect All
            </UiButton>
            <UiButton size="sm" class="w-fit ml-auto bg-red-600 text-white"
              :disabled="selectedToDelete.length === 0 || isSubmitting" @click="setOpenDeleteModal(true)">
              <Icon name="heroicons:trash" v-if="!isSubmitting" class="mr-2 h-4 w-4" />
              <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              Delete {{ selectedToDelete.length ? `(${selectedToDelete.length})` : '' }}
            </UiButton>
          </div>

          <UiCard class="p-4 gap-2 flex-1 flex flex-col overflow-y-auto ">
            <template v-if="selectedChargeCodes.length > 0">
              <FormField v-for="chargeCode in selectedChargeCodes" :key="chargeCode"
                :model-value="selectedToDelete.includes(chargeCode)" name="selectedChargeCodes">
                <div class="flex w-full justify-between items-center border p-2 rounded-lg">

                  <FormItem class="flex items-center gap-2 w-full">
                    <FormControl>
                      <UiCheckbox class="self-end" :checked="selectedToDelete.includes(chargeCode)" @update:checked="checked => {
                        if (checked) {
                          selectedToDelete.push(chargeCode)
                        } else {
                          selectedToDelete = selectedToDelete.filter(id => id !== chargeCode)
                        }
                      }" />
                    </FormControl>
                    <FormLabel class="w-full">
                      <div class="flex items-center w-full gap-2 justify-between">
                      <div class="flex items-center gap-2">
                        <p>{{ chargeCode }} </p>
                        <p class="text-muted-foreground">({{chargesData.find(c => c.chargeCode === chargeCode)?.category}})</p>
                      </div>
                      <p class="truncate text-muted-foreground font-normal self-end w-full text-right">{{chargesData.find(c => c.chargeCode === chargeCode)?.description}}</p>
                    </div>
                    </FormLabel>
                  </FormItem>
                </div>

              </FormField>
            </template>
            <template v-else>
              <div class="text-center text-gray-400 py-8">
                No assigned charge codes to remove.
              </div>
            </template>
          </UiCard>

          <UiButton class="mt-4 w-full bg-red-600 text-white" :disabled="selectedToDelete.length === 0 || isSubmitting"
            @click="setOpenDeleteModal(true)">
            <Icon name="heroicons:trash" v-if="!isSubmitting" class="mr-2 h-4 w-4" />
            <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Delete {{ selectedToDelete.length ? `(${selectedToDelete.length})` : '' }}
          </UiButton>
        </div>
      </div>
    </div>

    <div class="w-full p-6" v-else-if="chargesData.length == 0">
      <UiNoResultFound title="Sorry, no charge codes found." />
    </div>

    <div v-if="isError" class="w-full">
      <ErrorMessage title="Something went wrong." :retry="refetch" />
    </div>
  </UiCard>

  <!-- Confirm delete -->
  <UiAlertDialog :open="openDeleteModal" :onOpenChange="setOpenDeleteModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. Selected charge codes will be removed from the payment integration.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenDeleteModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction class="bg-red-500" @click="deleteSelected()">
          <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>

  <!-- Confirm add -->
  <UiAlertDialog :open="openAddModal" :onOpenChange="setOpenAddModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action will assign the selected charge codes to the payment integration.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenAddModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction class="bg-green-500" @click="addSelected()">
          <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<style lang="css" scoped></style>
