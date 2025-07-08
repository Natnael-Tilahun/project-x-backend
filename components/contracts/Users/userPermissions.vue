<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const props = defineProps<{
  permissions: Array<{ code: string; description?: string }>;
  selected: string[];
  modelValue?: string[];
}>();

const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const localSelected = ref<string[]>(props.modelValue ? [...props.modelValue] : [...(props.selected || [])]);

watch(
  () => props.modelValue,
  (val) => {
    if (val) localSelected.value = [...val];
  }
);

const togglePermission = (code: string) => {
  if (localSelected.value.includes(code)) {
    localSelected.value = localSelected.value.filter((c) => c !== code);
  } else {
    localSelected.value.push(code);
  }
};

const save = () => {
  emit("update:modelValue", [...localSelected.value]);
  open.value = false;
};

const selectAll = () => {
  localSelected.value = props.permissions.map((p) => p.code);
};
const unselectAll = () => {
  localSelected.value = [];
};
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger as="button">
      <Button type="button" variant="outline"
      class="font-medium cursor-pointer px-2 h-fit py-1 bg-[#8C2A7C]/15 text-primary hover:bg-[#8C2A7C]/20"

      size="sm">
      <Icon
                                            name="lucide:shield"
                                            class="h-4 w-4 mr-2"
                                          />
      Permissions</Button>
    </SheetTrigger>
    <SheetContent side="right" class=" min-w-[60%]">
      <SheetHeader>
        <SheetTitle>Select Permissions</SheetTitle>
        <SheetDescription>
          <div class="flex flex-col gap-4 mt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium">Permissions</span>
              <span class="text-xs text-muted-foreground">{{ localSelected.length }} of {{ permissions.length }} selected</span>
            </div>
            <div class="flex gap-2 mb-2">
              <Button variant="outline" size="sm" @click="selectAll">Select All</Button>
              <Button variant="outline" size="sm" @click="unselectAll">Unselect All</Button>
            </div>
            <div class="flex flex-col gap-2 max-h-72 overflow-y-auto">
              <FormField
                v-for="perm in permissions"
                :key="perm.code"
                :model-value="localSelected.includes(perm.code)"
                name="permission"
              >
                <FormItem class="flex items-center gap-2">
                  <FormControl>
                    <Checkbox :checked="localSelected.includes(perm.code)" @update:checked="() => togglePermission(perm.code)" />
                  </FormControl>
                  <FormLabel>{{ perm.code }}</FormLabel>
                </FormItem>
              </FormField>
            </div>
            <div class="flex justify-end mt-4">
              <Button @click="save" variant="default">Save</Button>
            </div>
          </div>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template> 