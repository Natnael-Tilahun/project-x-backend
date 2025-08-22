<!-- components/operations/RequestBodyTemplateEditor.vue -->
<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import type { RequestInput } from "~/types";

const props = defineProps<{
  modelValue?: string | null;
  variables?: string[]; // available variables (union)
  requestInputs?: RequestInput[] | null; // full inputs for grouping
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const payload = ref(props.modelValue || "");
watch(
  () => props.modelValue,
  (v) => {
    if (v !== payload.value) payload.value = v || "";
  }
);
watch(payload, (v) => emit("update:modelValue", v));

const availableVariables = computed(() =>
  Array.from(new Set(props.variables || [])).filter(Boolean)
);

const groupedVariables = computed(() => {
  const base: Record<string, string[]> = {
    HEADER: [],
    BODY: [],
    QUERY: [],
    PATH: [],
    NONE: [],
  };
  const list = (props.requestInputs || []) as RequestInput[];
  for (const r of list) {
    const key = (r?.inputType as unknown as string) || 'NONE';
    const name = r?.inputName;
    if (!name) continue;
    if (base[key]) base[key].push(name);
    else base['NONE'].push(name);
  }
  // Fallback to show provided variables under NONE when requestInputs is empty
  if (list.length === 0 && availableVariables.value.length > 0) {
    base['NONE'] = Array.from(
      new Set([...base['NONE'], ...availableVariables.value])
    );
  }
  (Object.keys(base) as (keyof typeof base)[]).forEach((k) => {
    base[k] = Array.from(new Set(base[k]));
  });
  return base;
});

const CATEGORY_ORDER = ['HEADER','BODY','QUERY','PATH','NONE'] as const;
const categoryLabels: Record<string, string> = {
  HEADER: 'Headers',
  BODY: 'Body',
  QUERY: 'Query',
  PATH: 'Path',
  NONE: 'None',
};

const orderedCategories = computed(() => CATEGORY_ORDER as unknown as string[]);
const getGroup = (k: string) => groupedVariables.value[k] || [];
const labelFor = (k: string) => categoryLabels[k] || k;
const orderedGroups = computed(() =>
  orderedCategories.value.map((k) => ({ key: k, items: getGroup(k) }))
    .filter((g) => Array.isArray(g.items) && g.items.length > 0)
);

const editor = ref<HTMLTextAreaElement | null>(null);
const ghost = ref<HTMLElement | null>(null);

// Copy states
const copiedVariable = ref<string | null>(null);
const isPayloadCopied = ref(false);

// Suggestions
const showSuggestions = ref(false);
const suggestionPosition = ref({ top: 0, left: 0 });
const currentPartial = ref("");
const selectedSuggestionIndex = ref(0);
const filteredSuggestions = computed(() => {
  if (!currentPartial.value) return availableVariables.value;
  return availableVariables.value.filter((v) =>
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
  const avail = new Set((availableVariables.value || []).map(v => v.toLowerCase()));
  return usedVariables.value.filter(v => !avail.has((v || "").toLowerCase()));
});

console.log("invalidVariables: ", invalidVariables.value)

// Methods
const copyVariable = (variable: string) => {
  const textToCopy = `\${${variable}}`;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      copiedVariable.value = variable;
      setTimeout(() => (copiedVariable.value = null), 2000);
    })
    .catch(() => {});
};

const copyPayload = () => {
  if (!payload.value) return;
  navigator.clipboard
    .writeText(payload.value)
    .then(() => {
      isPayloadCopied.value = true;
      setTimeout(() => (isPayloadCopied.value = false), 2000);
    })
    .catch(() => {});
};

const insertVariableAtCursor = (variable: string) => {
  const textarea = editor.value;
  if (!textarea) return;
  const textToInsert = `\${${variable}}`;
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
//   const ghostEl = ghost.value;
  if (!textarea ) return { top: 0, left: 0 };
  const textUpToCursor = textarea.value.substring(0, textarea.selectionStart);
  const style = window.getComputedStyle(textarea);
  [...(style as any)].forEach((key: string) =>
  textarea.style.setProperty(key, style.getPropertyValue(key), "important")
  );
  textarea.innerHTML = `${textUpToCursor.replace(/\n/g, "<br/>")}<span id="cursor-pos"></span>`;
  const cursorPosSpan = textarea.querySelector("#cursor-pos") as HTMLElement | null;
  // Use actual line-height when available; fallback to font-size * 1.2
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
  const textUpToCursor = textarea.value.substring(0, textarea.selectionStart);
  const braceIndex = textUpToCursor.lastIndexOf("${");
  const dollarIndex = textUpToCursor.lastIndexOf("$");
  const triggerIndex = Math.max(braceIndex, dollarIndex);

  const textToInsert = `\${${variable}}`;

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
    // Fallback: insert at cursor
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
  // Trigger suggestions when typing "$" OR "${" followed by word chars
  const match = textUpToCursor.match(/(?:\$\{|\$)(\w*)$/);
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
    // close suggestions if clicking outside the textarea
    if (editor.value && e.target !== editor.value) hideSuggestions();
  });
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Left: Editor -->
    <div class="relative">
      <div class="flex items-center justify-between mb-2">
        <UiLabel class="text-base">Request Body Template</UiLabel>
        <UiButton
          size="sm"
          type="button"
          variant="outline"
          class="flex items-center gap-2"
          @click="copyPayload"
        >
          <Icon v-if="isPayloadCopied" name="ph:check-bold" class="h-4 w-4" />
          <Icon v-else name="material-symbols:content-copy" class="h-4 w-4" />
          <span>{{ isPayloadCopied ? "Copied" : "Copy" }}</span>
        </UiButton>
      </div>

      <div class="relative">
        <textarea
          ref="editor"
          :value="payload"
          @input="(e:any) => { payload = e?.target?.value; handleInput(e); }"
          @keydown.enter.prevent="confirmSuggestion"
          @keydown.tab.prevent="confirmSuggestion"
          @keydown.esc="hideSuggestions"
          spellcheck="false"
          class="w-full h-72 overflow-y-auto p-3 border rounded-lg shadow-inner focus:outline-none resize-y"
        ></textarea>

        <!-- Suggestions -->
        <div
          v-if="showSuggestions"
          class="absolute bg-background border rounded-md shadow-md z-10 overflow-hidden text-sm max-h-40 w-60 overflow-y-auto"
        >
          <div
            v-for="(s, i) in filteredSuggestions"
            :key="s"
            class="px-3 py-1 cursor-pointer"
            :class="i === selectedSuggestionIndex ? 'bg-primary/10 text-primary' : ''"
            @mousedown.prevent="insertVariableFromSuggestion(s)"
          >
            {{ s }}
          </div>
          <div v-if="filteredSuggestions.length === 0" class="px-3 py-1 text-muted-foreground">
            No suggestions
          </div>
        </div>

        <!-- Hidden ghost element for cursor position calc (within the same wrapper) -->
        <!-- <div id="ghost" ref="ghost" class="editor-textarea absolute top-0 left-0 invisible whitespace-pre-wrap"></div> -->
      </div>
    </div>

    <!-- Right: Variables and Warnings -->
    <div class="flex flex-col gap-4 mt-12">
      <div class="bg-muted rounded-lg border p-4">
        <div class="flex items-center justify-between mb-2">
          <UiLabel class="text-base">Variables</UiLabel>
        </div>
        <div class="space-y-4">
          <div
            v-for="group in orderedGroups"
            :key="group.key"
          >
            <div class="text-xs uppercase text-muted-foreground mb-1">
              {{ labelFor(group.key) }}
            </div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="v in group.items"
                :key="v"
                class="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium pl-2 pr-1 py-1 rounded-full border border-primary/30"
              >
                <span class="cursor-pointer" @click="insertVariableAtCursor(v)">{{ v }}</span>
                <UiButton
                  variant="ghost"
                  type="button"
                  size="icon"
                  class="h-6 w-6"
                  @click.stop="copyVariable(v)"
                  :title="`Copy \${${v}}`"
                >
                  <Icon
                    v-if="copiedVariable === v"
                    name="ph:check-bold"
                    class="h-3 w-3"
                  />
                  <Icon
                    v-else
                    name="material-symbols:content-copy"
                    class="h-3 w-3"
                  />
                </UiButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.editor-textarea {
  caret-color: currentColor;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>