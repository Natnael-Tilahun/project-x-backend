<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue';
import type { Permission, ContractAccount } from '~/types';
import { useUserAccounts } from '~/composables/useUserAccounts';
import { useToast } from '~/components/ui/toast';

const props = defineProps<{
  open: boolean;
  contractAccount: ContractAccount | null;
  selectedPermissions: string[];  // Permission codes
  availablePermissions: Permission[];
  permissionId: string;
  isUserAccount?: boolean; // Flag to indicate if this is an existing user account
}>();

const emit = defineEmits(['update:open', 'refetch']);

// Get the user accounts composable and toast
const { updateUserAccountPermissions } = useUserAccounts();
const { toast } = useToast();

// Track loading state
const isSaving = ref(false);

// Create a reactive reference to selected permissions (using codes)
const localSelectedPermissions = ref<string[]>([]);

// Reset local permissions when dialog opens or inputs change
// Enhanced to ensure it catches all updates
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    console.log("Dialog opened with selected permissions:", props.selectedPermissions);
    localSelectedPermissions.value = [...(props.selectedPermissions || [])];
  }
}, { immediate: true });

// Also specifically watch selectedPermissions
watch(() => props.selectedPermissions, (newPermissions) => {
  if (props.open) {
    console.log("Selected permissions changed to:", newPermissions);
    localSelectedPermissions.value = [...(newPermissions || [])];
  }
}, { immediate: true });

// Initialize permissions on mount
onMounted(() => {
  if (props.selectedPermissions) {
    localSelectedPermissions.value = [...props.selectedPermissions];
    console.log("Initialized permissions on mount:", localSelectedPermissions.value);
  }
});

// Computed property to check if all permissions are selected
const allSelected = computed(() => {
  if (!props.availablePermissions || props.availablePermissions.length === 0) return false;
  
  const availableCodes = props.availablePermissions
    .filter(p => p.code)
    .map(p => p.code as string);
    
  return availableCodes.every(code => localSelectedPermissions.value.includes(code));
});

// Debugging computed to show current permission state
const debugState = computed(() => {
  return {
    selectedInProps: props.selectedPermissions,
    selectedLocally: localSelectedPermissions.value,
    availableCodes: props.availablePermissions.map(p => p.code)
  };
});

// Explicitly handle checkbox click
const handleCheckboxClick = (permissionCode: string, event: Event) => {
  event.stopPropagation(); // Prevent double triggering
  togglePermission(permissionCode);
};

// Row click handler
const handleRowClick = (permissionCode: string) => {
  togglePermission(permissionCode);
};

// Toggle a permission using code
const togglePermission = (permissionCode: string) => {
  if (!permissionCode) return;
  
  const index = localSelectedPermissions.value.findIndex(code => code === permissionCode);
  
  if (index !== -1) {
    // Create a new array without this permission
    localSelectedPermissions.value = localSelectedPermissions.value.filter(code => code !== permissionCode);
  } else {
    // Create a new array with this permission added
    localSelectedPermissions.value = [...localSelectedPermissions.value, permissionCode];
  }
  
  console.log("Permission toggled:", permissionCode);
  console.log("Updated selections:", localSelectedPermissions.value);
};

// Select all permissions (using codes)
const selectAll = () => {
  localSelectedPermissions.value = props.availablePermissions
    .filter(p => p.code)
    .map(p => p.code as string);
    
  console.log("Selected all permissions:", localSelectedPermissions.value);
};

// Deselect all permissions
const deselectAll = () => {
  localSelectedPermissions.value = [];
  console.log("Deselected all permissions");
};

// Check if a permission is selected (using code)
const isPermissionSelected = (permissionCode: string) => {
  if (!permissionCode) return false;
  return localSelectedPermissions.value.includes(permissionCode);
};

// Close without saving
const closeDialog = () => {
  emit('update:open', false);
};

// Save and close
const saveAndClose = async () => {
  try {
    isSaving.value = true;
    console.log("Saving permissions:", {
      id: props.permissionId,
      permissions: localSelectedPermissions.value
    });
    
    // If this is a user account (not a contract account), update via API
    if (props.isUserAccount) {
      const permissionsData = {
        permissionCodes: localSelectedPermissions.value  // Using codes now
      };
      
      await updateUserAccountPermissions(props.permissionId, permissionsData);
      
      toast({
        title: "Permissions Updated",
        description: "Account permissions have been updated successfully"
      });
      emit('refetch');
      closeDialog();
    }
    
    // // Always emit the event to update parent component state
    // emit('savePermissions', {
    //   id: props.permissionId,
    //   permissions: [...localSelectedPermissions.value]
    // });


  } catch (error: any) {
    console.error("Error updating permissions:", error);
    toast({
      title: "Error",
      description: "Failed to update permissions: " + (error.message || "Unknown error"),
      variant: "destructive"
    });
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <UiAlertDialog :open="open" @update:open="$emit('update:open', $event)">
    <UiAlertDialogContent class="sm:max-w-[550px]">
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Manage Permissions</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          Set permissions for account {{ contractAccount?.account?.accountNumber }}
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      
      <div class="py-4 max-h-[60vh] overflow-auto">
        <div v-if="!availablePermissions || availablePermissions.length === 0" class="text-center py-8 text-muted-foreground">
          No permissions available for this account
        </div>
        
        <div v-else class="space-y-4">
          <div class="flex justify-between items-center mb-4">
            <p class="font-medium">Available Permissions</p>
            <div class="flex items-center gap-2">
              <p class="text-sm text-muted-foreground">
                {{ localSelectedPermissions.length }} of {{ availablePermissions.length }} selected
              </p>
              <div class="flex gap-2">
                <UiButton 
                  variant="outline" 
                  size="sm" 
                  @click="selectAll"
                  :disabled="allSelected"
                >
                  Select All
                </UiButton>
                <UiButton 
                  variant="outline" 
                  size="sm" 
                  @click="deselectAll"
                  :disabled="localSelectedPermissions.length === 0"
                >
                  Deselect All
                </UiButton>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              v-for="permission in availablePermissions" 
              :key="permission.code"
              class="flex items-start rounded-md p-3 hover:bg-muted/30 transition-colors cursor-pointer"
              @click="handleRowClick(permission.code || '')"
            >
              <div @click.stop="handleCheckboxClick(permission.code || '', $event)" class="mr-3">
                <UiCheckbox
                  :checked="isPermissionSelected(permission.code || '')"
                  class="h-4 w-4 mt-1"
                />
              </div>
              <div>
                <p class="font-medium text-sm">{{ permission.code }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ permission.description || 'No description available' }}</p>
                <!-- <p class="text-xs text-primary-foreground bg-primary px-2 py-0.5 rounded mt-1 inline-block">{{ permission.code }}</p> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="closeDialog">Cancel</UiAlertDialogCancel>
        <UiButton @click="saveAndClose" :disabled="isSaving">
          <UiSpinner v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
          {{ isSaving ? 'Saving...' : 'Save Permissions' }}
        </UiButton>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template> 