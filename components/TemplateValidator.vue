<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useTempleteProcessor } from '~/composables/useTempleteProcessor';

const props = defineProps<{
  modelValue: boolean; // for v-model
  template: string;
}>();

const emit = defineEmits(['update:modelValue']);

const { isLoading, extractTemplateVariables, processTemplate: apiProcessTemplate } = useTempleteProcessor();

const templateContent = ref(props.template);
const isDrawerOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const drawerState = ref<'idle' | 'loading' | 'error' | 'form' | 'result'>('idle');
const loadingMessage = ref('');
const errorMessage = ref('');
const extractedVariables = ref<string[]>([]);
const variableValues = ref<Record<string, string>>({});
const processedResult = ref('');

const startValidation = async () => {
    drawerState.value = 'loading';
    loadingMessage.value = 'Analyzing template...';
    errorMessage.value = '';
    try {
        const variables = await extractTemplateVariables(templateContent.value);
        extractedVariables.value = variables || [];
        variableValues.value = extractedVariables.value.reduce((acc, key) => ({ ...acc, [key]: '' }), {});
        drawerState.value = 'form';
    } catch (err: any) {
        errorMessage.value = err.message || 'An unknown error occurred.';
        drawerState.value = 'error';
    }
};

const processTemplate = async () => {
    drawerState.value = 'loading';
    loadingMessage.value = 'Generating preview...';
    errorMessage.value = '';
    try {
        const result = await apiProcessTemplate(templateContent.value, variableValues.value);
        processedResult.value = result;
        drawerState.value = 'result';
    } catch (err: any) {
        errorMessage.value = err.message || 'An unknown error occurred.';
        drawerState.value = 'error';
    }
};

const closeDrawer = () => {
    isDrawerOpen.value = false;
    setTimeout(() => { drawerState.value = 'idle'; }, 400);
};

const resetDrawer = () => {
    processedResult.value = '';
    errorMessage.value = '';
    drawerState.value = 'form';
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    templateContent.value = props.template;
    startValidation();
  }
});

</script>

<template>
    <div>
        <!-- Slide-out Drawer Panel -->
        <transition name="backdrop">
            <div v-if="isDrawerOpen" @click="closeDrawer" class="fixed inset-0 bg-black/30 z-50"></div>
        </transition>
        <transition name="drawer">
            <aside v-if="isDrawerOpen" class="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
                <!-- Drawer Header -->
                <div class="flex items-center justify-between p-5 bg-slate-50 border-b border-slate-200">
                    <h2 class="text-xl font-semibold text-slate-800">Validate Template</h2>
                    <button @click="closeDrawer" class="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
                        <Icon name="radix-icons:cross-2" class="h-6 w-6" />
                    </button>
                </div>

                <!-- Drawer Content -->
                <div class="p-6 md:p-8 flex-grow overflow-y-auto">
                    <!-- Loading State -->
                    <div v-if="drawerState === 'loading' || isLoading" class="flex flex-col items-center justify-center h-full text-slate-500">
                        <Icon name="svg-spinners:8-dots-rotate" class="h-10 w-10 text-primary mb-4" />
                        <p class="font-medium text-lg">{{ loadingMessage }}</p>
                    </div>
                    
                    <!-- Error State -->
                    <div v-else-if="drawerState === 'error'" class="flex items-start p-4 bg-red-50 text-red-800 border-l-4 border-red-500 rounded-r-lg">
                        <Icon name="radix-icons:cross-circled" class="h-6 w-6 mr-3 flex-shrink-0" />
                        <div>
                            <h3 class="font-bold mb-1">An Error Occurred</h3>
                            <p class="text-sm">{{ errorMessage }}</p>
                            <button @click="startValidation" class="mt-3 text-sm font-semibold text-primary hover:underline">Try Again</button>
                        </div>
                    </div>

                    <!-- Form & Result States -->
                    <div v-else class="space-y-8">
                        <!-- Step 1: Form -->
                        <div :class="{'opacity-50': drawerState === 'result'}">
                            <h3 class="flex items-center font-semibold text-slate-800 text-lg">
                                 <span class="flex items-center justify-center w-7 h-7 bg-primary text-white rounded-full mr-3 text-sm font-bold">1</span>
                                 Provide Values
                            </h3>
                            <p class="text-sm text-slate-500 mt-2 ml-10">Fill in the variables we found in your template.</p>
                            
                            <div v-if="extractedVariables.length === 0 && drawerState === 'form'" class="mt-4 ml-10 p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm">
                                No variables like `${...}` were found. You can still process the template as is.
                            </div>
                            <form @submit.prevent="processTemplate" class="mt-4 ml-10 space-y-4">
                                <div v-for="variable in extractedVariables" :key="variable">
                                    <label :for="variable" class="block text-sm font-medium text-slate-600 mb-1 font-mono">${{ variable }}</label>
                                    <UiInput type="text" :id="variable" v-model="variableValues[variable]" class="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition" />
                                </div>
                                <UiButton type="submit" v-if="drawerState === 'form'" class="w-full font-bold">
                                    Process Template
                                </UiButton>
                            </form>
                        </div>
                        
                         <!-- Step 2: Result -->
                        <div v-if="drawerState === 'result'">
                            <h3 class="flex items-center font-semibold text-slate-800 text-lg">
                                <span class="flex items-center justify-center w-7 h-7 bg-green-500 text-white rounded-full mr-3 text-sm font-bold">2</span>
                                Processed Result
                            </h3>
                            <div class="mt-4 ml-10">
                                 <pre class="bg-slate-800 text-white p-4 rounded-lg text-sm whitespace-pre-wrap font-mono leading-relaxed">{{ processedResult }}</pre>
                                 <UiButton @click="resetDrawer" class="w-full mt-4 bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                                    Run Again with New Values
                                 </UiButton>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </transition>
    </div>
</template>

<style scoped>
/* Drawer Transitions */
.drawer-enter-active, .drawer-leave-active {
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.drawer-enter-from, .drawer-leave-to {
    transform: translateX(100%);
}
.backdrop-enter-active, .backdrop-leave-active {
    transition: opacity 0.4s ease;
}
.backdrop-enter-from, .backdrop-leave-to {
    opacity: 0;
}
</style>