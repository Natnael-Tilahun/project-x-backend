<!-- components/paymentIntegrations/PaymentIntegrationTemplateEditor.vue -->
<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import TemplateValidator from "~/components/TemplateValidator.vue";


const props = defineProps({
  modelValue: { type: String, default: null },
  paymentIntegration: { type: Object, default: null }, // TODO: Replace any with a proper type
});

const emit = defineEmits(["update:modelValue"]);

const payload = ref(props.modelValue || "");
watch(
  () => props.modelValue,
  (v) => {
    if (v !== payload.value) payload.value = v || "";
  }
);
watch(payload, (v) => emit("update:modelValue", v));

const isValidatorOpen = ref(false);

const groupedVariables = computed(() => {
  if (!props.paymentIntegration) return {};

  const pi = props.paymentIntegration;
  const allOperations = pi.paymentOperations || [];

  const groups: Record<string, string[]> = {};

  for (const operation of allOperations) {
    // 1. Fields from form
    const fields = operation.form?.fields?.map((f: any) => f.name).filter(Boolean) || [];
    if (fields.length > 0) {
      groups['Fields'] = [...(groups['Fields'] || []), ...fields];
    }

    // 2. API Request Mappings
    const mappings = operation.apiRequestMappingsRegistry?.map((m: any) => m.apiRequestInputName).filter(Boolean) || [];
    if (mappings.length > 0) {
      groups['API Request Mappings'] = [...(groups['API Request Mappings'] || []), ...mappings];
    }

    // 3. API Request Mappings Registry Options
    if (operation.apiRequestMappingsRegistryOptions) {
      for (const key in operation.apiRequestMappingsRegistryOptions) {
        const categoryName = key.endsWith('.') ? key.slice(0, -1) : key;
        const variables = operation.apiRequestMappingsRegistryOptions[key];
        if (Array.isArray(variables) && variables.length > 0) {
          groups[categoryName] = [...(groups[categoryName] || []), ...variables];
        }
      }
    }
  }

  // Deduplicate variables within each group
  for (const key in groups) {
    groups[key] = Array.from(new Set(groups[key]));
  }

  return groups;
});

const CATEGORY_ORDER = [
  'Fields',
  'API Request Mappings',
  '$paymentFormInput',
  '$transaction',
  '$debitedAccount',
  '$creditedAccount',
  '$currentCustomer',
  '$enquiryFormInput',
  '$enquiryApiResponse'
];

const categoryLabels: Record<string, string> = {
  'Fields': 'Form Fields',
  'API Request Mappings': 'API Request Mappings',
  '$paymentFormInput': 'Payment Form Input',
  '$transaction': 'Transaction',
  '$debitedAccount': 'Debited Account',
  '$creditedAccount': 'Credited Account',
  '$currentCustomer': 'Current Customer',
  '$enquiryFormInput': 'Enquiry Form Input',
  '$enquiryApiResponse': 'Enquiry API Response'
};

const orderedCategories = computed(() => CATEGORY_ORDER);
const getGroup = (k: string) => groupedVariables.value[k] || [];
const labelFor = (k: string) => categoryLabels[k] || k;
const orderedGroups = computed(() =>
  orderedCategories.value.map((k) => ({ key: k, items: getGroup(k) }))
    .filter((g) => Array.isArray(g.items) && g.items.length > 0)
);

const formatVariable = (variable: string, groupKey: string): string => {
  const prefixCategories = [
    '$paymentFormInput',
    '$transaction',
    '$debitedAccount',
    '$creditedAccount',
    '$currentCustomer',
    '$enquiryFormInput',
    '$enquiryApiResponse'
  ];

  if (prefixCategories.includes(groupKey)) {
    const prefix = groupKey.startsWith('$') ? groupKey.substring(1) : groupKey;
    return `${prefix}.${variable}`;
  }

  return variable;
};

const allAvailableVariables = computed(() => {
  const allVars: string[] = [];
  for (const group of orderedGroups.value) {
    for (const item of group.items) {
      allVars.push(formatVariable(item, group.key));
    }
  }
  return Array.from(new Set(allVars));
});

const editor = ref<HTMLTextAreaElement | null>(null);

// Copy states
const copiedVariable = ref<string | null>(null);
const isPayloadCopied = ref(false);

// Suggestions
const showSuggestions = ref(false);
const suggestionPosition = ref({ top: 0, left: 0 });
const currentPartial = ref("");
const selectedSuggestionIndex = ref(0);
const filteredSuggestions = computed(() => {
  if (!currentPartial.value) return allAvailableVariables.value;
  return allAvailableVariables.value.filter((v) =>
    v.toLowerCase().startsWith(currentPartial.value.toLowerCase())
  );
});

// Validation
const variableRegex = /\$\{(.*?)\}/g;
const usedVariables = computed(() => {
  const text = payload.value || "";
  const matches = [...text.matchAll(variableRegex)];
  const variables = matches.map((m) => (m[1] || "").trim()).filter(Boolean);
  return Array.from(new Set(variables));
});
const invalidVariables = computed(() => {
  const availableSet = new Set(allAvailableVariables.value || []);
  return usedVariables.value.filter(v => !availableSet.has(v));
});

// Methods
const copyVariable = (variable: string, groupKey: string) => {
  const formattedVar = formatVariable(variable, groupKey);
  const textToCopy = '${' + formattedVar + '}';
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      copiedVariable.value = formattedVar;
      setTimeout(() => (copiedVariable.value = null), 2000);
    })
    .catch(() => { });
};

const copyPayload = () => {
  if (!payload.value) return;
  navigator.clipboard
    .writeText(payload.value)
    .then(() => {
      isPayloadCopied.value = true;
      setTimeout(() => (isPayloadCopied.value = false), 2000);
    })
    .catch(() => { });
};

const insertVariableAtCursor = (variable: string, groupKey: string) => {
  const textarea = editor.value;
  if (!textarea) return;
  const textToInsert = '${' + formatVariable(variable, groupKey) + '}';
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;
  payload.value =
    payload.value.substring(0, startPos) +
    textToInsert +
    payload.value.substring(endPos);
  nextTick(() => {
    const newCursorPos = startPos + textToInsert.length;
    textarea.focus();
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  });
};

// Autocomplete helpers
const calculateCursorPosition = () => {
  const textarea = editor.value;
  if (!textarea) return { top: 0, left: 0 };
  const textUpToCursor = textarea.value.substring(0, textarea.selectionStart);
  const style = window.getComputedStyle(textarea);
  [...(style as any)].forEach((key: string) =>
    textarea.style.setProperty(key, style.getPropertyValue(key), "important")
  );
  textarea.innerHTML = `${textUpToCursor.replace(/\n/g, "<br/>")}<span id="cursor-pos"></span>`;
  const cursorPosSpan = textarea.querySelector("#cursor-pos") as HTMLElement | null;
  const lineHeightStr = style.lineHeight;
  let lineHeight = parseFloat(lineHeightStr);
  if (!lineHeight || Number.isNaN(lineHeight)) {
    const fontSize = parseFloat(style.fontSize || '16');
    lineHeight = fontSize * 1.2;
  }
  return {
    top: (cursorPosSpan?.offsetTop || 0) - textarea.scrollTop + lineHeight,
    left: (cursorPosSpan?.offsetLeft || 0) - textarea.scrollLeft + 2,
  };
};

const hideSuggestions = () => {
  showSuggestions.value = false;
  currentPartial.value = "";
};

const insertVariableFromSuggestion = (variable: string) => {
  const textarea = editor.value;
  if (!textarea) return;
  const textToInsert = '${' + variable + '}';
  const textUpToCursor = textarea.value.substring(0, textarea.selectionStart);
  const braceIndex = textUpToCursor.lastIndexOf("${ ");
  const dollarIndex = textUpToCursor.lastIndexOf("$");
  const triggerIndex = Math.max(braceIndex, dollarIndex);

  if (triggerIndex !== -1) {
    const before = textarea.value.substring(0, triggerIndex);
    const after = textarea.value.substring(textarea.selectionEnd);
    payload.value = `${before}${textToInsert}${after}`;
    nextTick(() => {
      const newCursorPos = before.length + textToInsert.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  } else {
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    payload.value =
      payload.value.substring(0, startPos) +
      textToInsert +
      payload.value.substring(endPos);
    nextTick(() => {
      const newCursorPos = startPos + textToInsert.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  }
  hideSuggestions();
};

const selectNextSuggestion = () => {
  if (!showSuggestions.value || filteredSuggestions.value.length === 0) return;
  selectedSuggestionIndex.value =
    (selectedSuggestionIndex.value + 1) %
    filteredSuggestions.value.length;
};

const selectPrevSuggestion = () => {
  if (!showSuggestions.value || filteredSuggestions.value.length === 0) return;
  selectedSuggestionIndex.value =
    (selectedSuggestionIndex.value - 1 + filteredSuggestions.value.length) %
    filteredSuggestions.value.length;
};

const confirmSuggestion = () => {
  if (!showSuggestions.value || filteredSuggestions.value.length === 0) return;
  insertVariableFromSuggestion(filteredSuggestions.value[selectedSuggestionIndex.value]);
};

const handleInput = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  const textUpToCursor = textarea.value.substring(0, textarea.selectionStart);
  const match = textUpToCursor.match(/(?:\$\{|\$)([\w.]*)$/);
  if (match) {
    currentPartial.value = match[1];
    suggestionPosition.value = calculateCursorPosition();
    showSuggestions.value = true;
    selectedSuggestionIndex.value = 0;
  } else {
    hideSuggestions();
  }
};

onMounted(() => {
  window.addEventListener("click", (e: MouseEvent) => {
    if (editor.value && e.target !== editor.value) hideSuggestions();
  });
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Left: Editor -->
    <div class="relative">
      <div class="relative">
        <textarea ref="editor" :value="payload" @input="(e: any) => { payload = e?.target?.value; handleInput(e); }"
          @keydown.enter.prevent="confirmSuggestion" @keydown.tab.prevent="confirmSuggestion"
          @keydown.esc="hideSuggestions" spellcheck="false"
          class="w-full max-h-72 h-44 overflow-y-auto p-3 border rounded-lg shadow-inner focus:outline-none resize-y"></textarea>

        <!-- Suggestions -->
        <div v-if="showSuggestions"
          class="absolute bg-background border rounded-md shadow-md z-10 overflow-hidden text-sm max-h-44 w-60 overflow-y-auto">
          <div v-for="(s, i) in filteredSuggestions" :key="s" class="px-3 py-1 cursor-pointer"
            :class="i === selectedSuggestionIndex ? 'bg-primary/10 text-primary' : ''"
            @mousedown.prevent="insertVariableFromSuggestion(s)">
            {{ s }}
          </div>
          <div v-if="filteredSuggestions.length === 0" class="px-3 py-1 text-muted-foreground">
            No suggestions
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-2 gap-4">
        <UiButton type="button" size="sm" variant="outline" @click="isValidatorOpen = true">
          <Icon name="lucide:test-tube-2" class="mr-2 h-4 w-4" />
          Validate Template
        </UiButton>
        <UiButton size="sm" type="button" variant="outline" class="flex items-center gap-2" @click="copyPayload">
          <Icon v-if="isPayloadCopied" name="ph:check-bold" class="h-4 w-4" />
          <Icon v-else name="material-symbols:content-copy" class="h-4 w-4" />
          <span>{{ isPayloadCopied ? "Copied" : "Copy" }}</span>
        </UiButton>
      </div>
    </div>

    <!-- Right: Variables and Warnings -->
    <div class="flex flex-col gap-4 max-h-72">
      <div class="bg-muted rounded-lg border p-4 h-full overflow-y-auto">
        <div class="flex gap-2 justify-between mb-2 flex-col">
          <UiLabel class="text-base">Variables</UiLabel>
          <!-- Invalid Variable Warnings -->
          <div class="mb-2" v-if="invalidVariables.length > 0">
            <h3 class="text-base font-semibold mb-2 text-destructive flex items-center">
              <Icon name="lucide:alert-triangle" class="h-5 w-5 mr-2" />
              <span>Warnings</span>
            </h3>
            <ul class="space-y-1">
              <li v-for="variable in invalidVariables" :key="variable"
                class="bg-destructive/10 text-destructive font-mono text-xs px-2 py-1 rounded-md border border-destructive/20">
                {{ variable }}
              </li>
            </ul>
          </div>
        </div>
        <div class="space-y-4">
          <UiAccordion type="multiple" class="w-full">
            <div v-for="group in orderedGroups" :key="group.key">
              <template
                v-if="['$paymentFormInput', '$transaction', '$debitedAccount', '$creditedAccount', '$currentCustomer', '$enquiryFormInput', '$enquiryApiResponse'].includes(group.key)">
                <UiAccordionItem :value="group.key">
                  <UiAccordionTrigger class="text-xs uppercase text-muted-foreground mb-1">
                    {{ labelFor(group.key) }}
                  </UiAccordionTrigger>
                  <UiAccordionContent>
                    <div class="flex flex-wrap gap-2">
                      <div v-for="v in group.items" :key="v"
                        class="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium pl-2 pr-1 py-1 rounded-full border border-primary/30">
                        <span class="cursor-pointer" @click="insertVariableAtCursor(v, group.key)">{{ v }}</span>
                        <UiButton variant="ghost" type="button" size="icon" class="h-6 w-6"
                          @click.stop="copyVariable(v, group.key)"
                          :title="'Copy $' + formatVariable(v, group.key) + '}'">
                          <Icon v-if="copiedVariable === formatVariable(v, group.key)" name="ph:check-bold"
                            class="h-3 w-3" />
                          <Icon v-else name="material-symbols:content-copy" class="h-3 w-3" />
                        </UiButton>
                      </div>
                    </div>
                  </UiAccordionContent>
                </UiAccordionItem>
              </template>
              <template v-else>
                <div class="text-xs uppercase font-medium text-muted-foreground mb-1 mt-2">
                  {{ labelFor(group.key) }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <div v-for="v in group.items" :key="v"
                    class="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium pl-2 pr-1 py-1 rounded-full border border-primary/30">
                    <span class="cursor-pointer" @click="insertVariableAtCursor(v, group.key)">{{ v }}</span>
                    <UiButton variant="ghost" type="button" size="icon" class="h-6 w-6"
                      @click.stop="copyVariable(v, group.key)" :title="'Copy $' + formatVariable(v, group.key) + '}'">
                      <Icon v-if="copiedVariable === formatVariable(v, group.key)" name="ph:check-bold"
                        class="h-3 w-3" />
                      <Icon v-else name="material-symbols:content-copy" class="h-3 w-3" />
                    </UiButton>
                  </div>
                </div>
              </template>
            </div>
          </UiAccordion>
        </div>
      </div>
    </div>
  </div>
  <TemplateValidator v-model="isValidatorOpen" :template="payload" />
</template>

<style scoped>
.editor-textarea {
  caret-color: currentColor;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>