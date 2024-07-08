// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useHasPermissions(permission: string) {
    // const data = ref(null)
    const authStore = useAuthStore();
    return authStore.hasPermissions(permission);

    // return { data, error }
}