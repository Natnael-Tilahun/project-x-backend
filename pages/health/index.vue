<template>
  <div>
    <h2>
      <span id="health-page-heading" data-cy="healthPageHeading">Health</span>
      <UiButton class="btn btn-primary float-right" @click="refresh" :disabled="updatingHealth">
        <Icon name="svg-spinners:8-dots-rotate" v-if="updatingHealth" class="mr-2 h-4 w-4 animate-spin"></Icon>
        <Icon v-else name="majesticons:refresh" class="h-6 w-6 mr-2"></Icon>
        <span>Refresh</span>
      </UiButton>
    </h2>
    <div class="table-responsive">
      <table id="healthCheck" class="table table-striped" aria-describedby="Health check">
        <thead>
          <tr>
            <th scope="col">Service</th>
            <th class="text-center" scope="col">Status</th>
            <th class="text-center" scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="health in healthData" :key="health.name">
            <td>
              <span>{{ getBaseName(health.name) }}</span>
              {{ getSubSystemName(health.name) }}
            </td>
            <td class="text-center">
              <span class="badge" :class="getBadgeClass(health.status)">
                {{ health.status }}
              </span>
            </td>
            <td class="text-center">
              <a class="hand" @click="showHealth(health)" v-if="health.details || health.error">
                <font-awesome-icon icon="eye"></font-awesome-icon>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h4 v-if="currentHealth" class="modal-title" id="showHealthLabel">
            <span>{{ getBaseName(currentHealth.name) }}</span>
            {{ getSubSystemName(currentHealth.name) }}
          </h4>
          <button type="button" class="close" @click="closeModal">&times;</button>
        </div>
        <health-modal :current-health="currentHealth" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HealthModal from '~/components/health/HealthModal.vue';
import { useLoggers } from '~/composables/useLoggers';

const { getHealth } = useLoggers();

const healthData = ref<any[]>([]);
const currentHealth = ref<any>(null);
const updatingHealth = ref(false);
const showModal = ref(false);
const isLoading = ref(false)

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
  return statusState === 'UP' ? 'badge-success' : 'badge-danger';
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
  updatingHealth.value = true;
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
  } finally {
    updatingHealth.value = false;
  }
}

function showHealth(health: any) {
  currentHealth.value = health;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

onMounted(() => {
  refresh();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal {
  background: #fff;
  margin: 5% auto;
  padding: 1rem;
  border-radius: 8px;
  max-width: 600px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}
</style>
