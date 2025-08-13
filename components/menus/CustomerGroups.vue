<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { toast } from "~/components/ui/toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { CustomerGroup, CustomerGroupMember } from "~/types";
import { getIdFromPath } from "~/lib/utils";

const route = useRoute();

// Composables
const { getCustomerGroups } = useCustomerGroups();
const {
  getCustomerGroupByMenuId,
  createCustomerGroupByMenuId,
  deleteCustomerGroupByMenuId,
} = useMenus();

// State
const menuId = ref<string>(getIdFromPath(route.path));
const groupsData = ref<CustomerGroup[]>([]);
const selectedGroups = ref<string[]>([]); // assigned group IDs
const isError = ref(false);
const loading = ref(false);
const isSubmitting = ref(false);

// Modals
const openAddGroupModal = ref(false);
const setOpenAddGroupModal = (value: boolean) => (openAddGroupModal.value = value);

const openDeleteGroupModal = ref(false);
const setOpenDeleteGroupModal = (value: boolean) =>
  (openDeleteGroupModal.value = value);

// Fetch all groups
const fetchGroupsData = async () => {
  try {
    loading.value = true;
    const response = await getCustomerGroups(0, 100000);
    groupsData.value =
      (response
        ?.slice()
        ?.sort((a, b) =>
          (a.groupCode || "").toLowerCase().localeCompare((b.groupCode || "").toLowerCase())
        ) || [])
        // Normalize id to string to ensure comparisons work
        .map((g: any) => ({ ...g, id: g?.id != null ? String(g.id) : g?.id }));
  } catch (err) {
    console.error("Error fetching groups:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

// Fetch groups already assigned to this menu
const fetchMenuGroups = async () => {
  try {
    loading.value = true;
    const response = await getCustomerGroupByMenuId(menuId.value);
    // Normalize possible shapes into an array
    const raw: any = response as any;
    const arr: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.content)
      ? raw.content
      : Array.isArray(raw?.groups)
      ? raw.groups
      : raw
      ? [raw]
      : [];

    selectedGroups.value = arr
      .map((m: any) => {
        if (typeof m === "string" || typeof m === "number") return String(m);
        if (m?.group?.id != null) return String(m.group.id);
        if (m?.id != null && (m?.groupName || m?.groupCode)) return String(m.id); // when API returns CustomerGroup directly
        if (m?.groupId != null) return String(m.groupId);
        return null;
      })
      .filter((id: any): id is string => Boolean(id));
  } catch (err) {
    console.error("Error fetching menu groups:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchGroupsData();
  await fetchMenuGroups();
});

const refetch = async () => {
  isError.value = false;
  await fetchGroupsData();
  await fetchMenuGroups();
};

// Selection state
const selectedToAdd = ref<string[]>([]);
const selectedToDelete = ref<string[]>([]);

// Bulk select helpers
const selectAllAvailable = () => {
  selectedToAdd.value = groupsData.value
    .filter((g) => !selectedGroups.value.includes(g.id as string))
    .map((g) => g.id as string);
};
const unselectAllAvailable = () => {
  selectedToAdd.value = [];
};

const selectAllAssigned = () => {
  selectedToDelete.value = selectedGroups.value.slice();
};
const unselectAllAssigned = () => {
  selectedToDelete.value = [];
};

// Actions
const addSelectedGroups = async () => {
  if (selectedToAdd.value.length === 0) return;
  try {
    isSubmitting.value = true;
    await createCustomerGroupByMenuId(menuId.value, {
      groupIds: selectedToAdd.value,
    });
    toast({
      title: "Groups Added",
      description: "Selected groups have been assigned to the menu.",
    });
    await fetchMenuGroups();
    selectedToAdd.value = [];
    setOpenAddGroupModal(false);
  } catch (err) {
    console.error("Error adding groups:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const deleteSelectedGroups = async () => {
  if (selectedToDelete.value.length === 0) return;
  try {
    isSubmitting.value = true;
    await deleteCustomerGroupByMenuId(menuId.value, {
      groupIds: selectedToDelete.value,
    });
    toast({
      title: "Groups Removed",
      description: "Selected groups have been removed from the menu.",
    });
    await fetchMenuGroups();
    selectedToDelete.value = [];
    setOpenDeleteGroupModal(false);
  } catch (err) {
    console.error("Error deleting groups:", err);
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

    <div v-else-if="groupsData.length > 0 && !isError" class="w-full h-full" style="min-height: 400px;">
      <div class="flex gap-8 h-full w-full">
        <!-- Left: Available Groups -->
        <div class="w-full  h-full min-h-96 flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <p class="font-medium">Available Groups</p>
            <p class="text-sm text-muted-foreground">
              {{ selectedToAdd.length }} of
              {{ groupsData.filter(g => !selectedGroups.includes(g.id as string)).length }}
              groups
            </p>
          </div>

          <div class="flex items-center gap-2 mb-2">
            <UiButton
              variant="outline"
              size="sm"
              @click="selectAllAvailable"
              :disabled="!groupsData.filter(g => !selectedGroups.includes(g.id as string)).length"
            >
              Select All
            </UiButton>
            <UiButton
              variant="outline"
              size="sm"
              @click="unselectAllAvailable"
              :disabled="!selectedToAdd.length"
            >
              Unselect All
            </UiButton>
            <UiButton
              class="ml-auto w-fit bg-green-600"
              :disabled="selectedToAdd.length === 0 || isSubmitting"
              @click="setOpenAddGroupModal(true)"
            >
              <Icon
                name="heroicons:plus-circle"
                v-if="!isSubmitting"
                class="mr-2 h-4 w-4"
              />
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="isSubmitting"
                class="mr-2 h-4 w-4 animate-spin"
              />
              Add {{ selectedToAdd.length ? `(${selectedToAdd.length})` : '' }}
            </UiButton>
          </div>

          <UiCard class="p-4 gap-2 flex-1 flex flex-col overflow-y-auto">
            <FormField
              v-for="group in groupsData"
              :key="group.id"
              :model-value="selectedToAdd.includes(group.id as string)"
              name="availableGroups"
            >
            <div class="flex w-full justify-between items-center border p-2 rounded-lg">
              <FormItem class="flex items-center gap-2">
                <FormControl>
                  <UiCheckbox
                  class="self-end"
                    :checked="selectedToAdd.includes(group.id as string)"
                    :disabled="selectedGroups.includes(group.id as string)"
                    @update:checked="checked => {
                      if (checked) {
                        selectedToAdd.push(group.id as string)
                      } else {
                        selectedToAdd = selectedToAdd.filter(id => id !== (group.id as string))
                      }
                    }"
                  />
                </FormControl>
                <FormLabel :class="{'text-gray-400': selectedGroups.includes(group.id as string)}">
                  {{ group.groupName }} <span class="text-muted-foreground">({{ group.groupCode }})</span>
                </FormLabel>
              </FormItem>
              <NuxtLink   
                class="text-sm text-primary cursor-pointer"
                @click="
                  navigateTo({
                    path: `/customerGroups/${group.id}`,
                  })
                ">
                  View Group
                </NuxtLink>
              </div>
            </FormField>
          </UiCard>

          <UiButton
            class="mt-4 w-full bg-green-600"
            :disabled="selectedToAdd.length === 0 || isSubmitting"
            @click="setOpenAddGroupModal(true)"
          >
            <Icon name="heroicons:plus-circle" v-if="!isSubmitting" class="mr-2 h-4 w-4" />
            <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Add {{ selectedToAdd.length ? `(${selectedToAdd.length})` : '' }}
          </UiButton>
        </div>

        <!-- Middle: Bi-directional Arrow -->
        <div class="flex flex-col items-center justify-center gap-2 w-1/2 h-full self-center">
          <Icon name="heroicons:arrow-right" :class="selectedToAdd.length != 0 && 'text-primary'" class="h-10 w-10 text-gray-400" />
          <Icon name="heroicons:arrow-left" :class="selectedToDelete.length != 0 && 'text-primary'" class="h-10 w-10 text-gray-400" />
        </div>

        <!-- Right: Assigned Groups -->
        <div class="w-full min-h-min flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <p class="font-medium">Assigned Groups</p>
            <p class="text-sm text-muted-foreground">
              {{ selectedToDelete.length }} of {{ selectedGroups.length }} selected
            </p>
          </div>

          <div class="flex items-center gap-2 mb-2">
            <UiButton
              variant="outline"
              size="sm"
              @click="selectAllAssigned"
              :disabled="!selectedGroups.length"
            >
              Select All
            </UiButton>
            <UiButton
              variant="outline"
              size="sm"
              @click="unselectAllAssigned"
              :disabled="!selectedToDelete.length"
            >
              Unselect All
            </UiButton>
            <UiButton
              size="sm"
              class="w-fit ml-auto bg-red-600 text-white"
              :disabled="selectedToDelete.length === 0 || isSubmitting"
              @click="setOpenDeleteGroupModal(true)"
            >
              <Icon name="heroicons:trash" v-if="!isSubmitting" class="mr-2 h-4 w-4" />
              <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              Delete {{ selectedToDelete.length ? `(${selectedToDelete.length})` : '' }}
            </UiButton>
          </div>

          <UiCard class="p-4 gap-2 flex-1 flex flex-col overflow-y-auto ">
            <template v-if="selectedGroups.length > 0">
              <FormField
                v-for="group in groupsData.filter(g => selectedGroups.includes(g.id as string))"
                :key="group.id"
                :model-value="selectedToDelete.includes(group.id as string)"
                name="selectedGroups"
              >
              <div class="flex w-full justify-between items-center border p-2 rounded-lg">

                <FormItem class="flex items-center gap-2">
                  <FormControl>
                    <UiCheckbox
                    class="self-end"
                      :checked="selectedToDelete.includes(group.id as string)"
                      @update:checked="checked => {
                        if (checked) {
                          selectedToDelete.push(group.id as string)
                        } else {
                          selectedToDelete = selectedToDelete.filter(id => id !== (group.id as string))
                        }
                      }"
                    />
                  </FormControl>
                  <FormLabel>
                    {{ group.groupName }} <span class="text-muted-foreground">({{ group.groupCode }})</span>
                  </FormLabel>
                </FormItem>
                <NuxtLink   
                class="text-sm text-primary cursor-pointer"
                @click="
                  navigateTo({
                    path: `/customerGroups/${group.id}`,
                  })
                ">
                  View Group
                </NuxtLink>
              </div>

              </FormField>
            </template>
            <template v-else>
              <div class="text-center text-gray-400 py-8">
                No assigned groups to remove.
              </div>
            </template>
          </UiCard>

          <UiButton
            class="mt-4 w-full bg-red-600 text-white"
            :disabled="selectedToDelete.length === 0 || isSubmitting"
            @click="setOpenDeleteGroupModal(true)"
          >
            <Icon name="heroicons:trash" v-if="!isSubmitting" class="mr-2 h-4 w-4" />
            <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Delete {{ selectedToDelete.length ? `(${selectedToDelete.length})` : '' }}
          </UiButton>
        </div>
      </div>
    </div>

    <div class="w-full p-6" v-else-if="groupsData.length == 0">
      <UiNoResultFound title="Sorry, no groups found." />
    </div>

    <div v-if="isError" class="w-full">
      <ErrorMessage title="Something went wrong." :retry="refetch" />
    </div>
  </UiCard>

  <!-- Confirm delete -->
  <UiAlertDialog :open="openDeleteGroupModal" :onOpenChange="setOpenDeleteGroupModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. Selected groups will be removed from the menu.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenDeleteGroupModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction class="bg-red-500" @click="deleteSelectedGroups()">
          <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>

  <!-- Confirm add -->
  <UiAlertDialog :open="openAddGroupModal" :onOpenChange="setOpenAddGroupModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action will assign the selected groups to the menu.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenAddGroupModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction class="bg-green-500" @click="addSelectedGroups()">
          <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<style lang="css" scoped></style>