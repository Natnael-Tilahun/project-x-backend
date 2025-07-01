<script setup lang="ts">
import { ref, computed, watch } from "vue"; // Added watch
import { cn } from "@/lib/utils";
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userLoginFormSchema } from "~/validations/userLoginFormSchema";
import { useAuth } from "~/composables/useAuth";
// import { useAuthStore } from '~/stores/auth'; // Assuming you have this

const authStore = useAuthStore(); // Make sure this is your Pinia auth store instance
const { login, isLoading } = useAuth();
let showPassword = ref(false);
// const { toast } = useToast(); // Uncomment if used

// --- Username Masking Logic ---
const isUsernameFocused = ref(false);
const MASK_CHAR = "*";
const MASK_VISIBLE_PREFIX = 2;
const MASK_VISIBLE_SUFFIX_LOCAL = 0;
const MASK_VISIBLE_DOMAIN_PREFIX = 2;
const MASK_MIN_LEN_FOR_MASKING_LOCAL = 3;
const MASK_MIN_LEN_FOR_MASKING_DOMAIN = 3;

function robustMask(
  part: string,
  prefixLen: number,
  suffixLen: number,
  minLenToMask: number
): string {
  const len = part.length;
  if (!part || len < minLenToMask || len <= prefixLen + suffixLen) {
    return part;
  }
  const maskedCoreLength = Math.max(0, len - prefixLen - suffixLen);
  return (
    part.substring(0, prefixLen) +
    MASK_CHAR.repeat(maskedCoreLength) +
    part.substring(len - suffixLen)
  );
}

const maskUsernameForDisplay = (username: string | undefined): string => {
  if (!username) return "";

  if (username.includes("@")) {
    const parts = username.split("@");
    const localPart = parts[0];
    const domainPart = parts.length > 1 ? parts.slice(1).join("@") : "";

    const maskedLocal = robustMask(
      localPart,
      MASK_VISIBLE_PREFIX,
      MASK_VISIBLE_SUFFIX_LOCAL,
      MASK_MIN_LEN_FOR_MASKING_LOCAL
    );

    if (!domainPart) return maskedLocal;

    const domainSegments = domainPart.split(".");
    if (domainSegments.length > 1) {
      const mainDomain = domainSegments.slice(0, -1).join(".");
      const tld = domainSegments[domainSegments.length - 1];
      const maskedMainDomain = robustMask(
        mainDomain,
        MASK_VISIBLE_DOMAIN_PREFIX,
        0,
        MASK_MIN_LEN_FOR_MASKING_DOMAIN
      );
      return `${maskedLocal}@${maskedMainDomain}.${tld}`;
    } else {
      const maskedDomain = robustMask(
        domainPart,
        MASK_VISIBLE_DOMAIN_PREFIX,
        0,
        MASK_MIN_LEN_FOR_MASKING_DOMAIN
      );
      return `${maskedLocal}@${maskedDomain}`;
    }
  } else {
    return robustMask(
      username,
      MASK_VISIBLE_PREFIX,
      0,
      MASK_MIN_LEN_FOR_MASKING_LOCAL
    );
  }
};
// --- End Username Masking Logic ---

const form = useForm({
  validationSchema: userLoginFormSchema,
  initialValues: {
    username: authStore.username || "", // Pre-fill from store if available
    password: "",
    rememberMe: false, // Initialize other fields too
  },
});

// Get the reactive actual username value from vee-validate
const actualUsername = computed(() => form.values.username);

// Computed property for what to display in the input field
const usernameToDisplay = computed(() => {
  if (isUsernameFocused.value) {
    return actualUsername.value || ""; // Show actual value when focused or if it's empty
  }
  // Not focused: show masked value if actualUsername exists, otherwise empty string
  return actualUsername.value
    ? maskUsernameForDisplay(actualUsername.value)
    : "";
});

// If store.username can load asynchronously and you want to update the form:
watch(
  () => authStore.username,
  (newUsername) => {
    if (newUsername && newUsername !== form.values.username) {
      // Only update if it changed and differs from current form value,
      // and perhaps only if the field hasn't been touched by the user yet.
      if (!form.meta.value.touchedFields.username) {
        form.setFieldValue("username", newUsername);
      }
    }
  }
);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;
  // `values.username` will be the ACTUAL, unmasked username
  const userCredentials = {
    username: values.username, // This is the true value
    password: values.password,
    rememberMe: values.rememberMe,
  };

  console.log("Submitting actual credentials:", userCredentials);

  try {
    await login(userCredentials);
    // Trigger the storage event in other tabs by setting a new value
    localStorage.setItem('auth-event', `login-${Date.now()}`);
    navigateTo("/", { replace: true });
  } catch (error) {
    console.error("Login error: ", error);
    // toast({ title: "Login Failed", description: (error as Error).message, variant: "destructive" });
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form
      @submit="onSubmit"
      autocomplete="off"
      aria-autocomplete="none"
      novalidate
    >
      <div class="grid gap-3">
        <FormField name="username" v-slot="{ field, meta }">
          <FormItem>
            <FormLabel>Username or Email</FormLabel>
            <FormControl>
              <UiInput
                type="text"
                placeholder="username or email"
                :model-value="usernameToDisplay"
                @update:model-value="field.onChange"
                @focus="isUsernameFocused = true"
                @blur="
                  (e) => {
                    isUsernameFocused = false;
                    field.onBlur(e);
                  }
                "
                :disabled="isLoading"
                aria-autocomplete="none"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                :aria-invalid="meta.touched && !meta.valid"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="password" v-slot="{ field, meta }">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl aria-autocomplete="new-password">
              <div
                class="relative flex items-center bg-background border border-input rounded-md focus-within:ring-1 focus-within:ring-ring"
              >
                <UiInput
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="******"
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :disabled="isLoading"
                  autocomplete="new-password"
                  aria-autocomplete="nope"
                  autocapitalize="off"
                  spellcheck="false"
                  class="pl-3 pr-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow"
                  :aria-invalid="meta.touched && !meta.valid"
                />
                <Icon
                  v-if="showPassword"
                  name="material-symbols:visibility-off-rounded"
                  class="absolute flex right-0 mr-3 items-center w-5 h-5 text-muted-foreground cursor-pointer"
                  @click="togglePasswordVisibility"
                />
                <Icon
                  v-else
                  name="material-symbols:visibility-rounded"
                  class="absolute flex right-0 mr-3 items-center w-5 h-5 text-muted-foreground cursor-pointer"
                  @click="togglePasswordVisibility"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <UiButton
          class="mt-2"
          type="submit"
          :disabled="isLoading || !form.meta.value.valid"
        >
          <Icon
            v-if="isLoading"
            name="svg-spinners:8-dots-rotate"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Sign In
        </UiButton>
      </div>
    </form>
    <!-- Debugging Info (Optional) -->
    <!--
    <div class="mt-4 p-2 border bg-slate-50 text-xs">
        <p>Is Username Focused: {{ isUsernameFocused }}</p>
        <p>Actual Username (form.values): {{ form.values.username }}</p>
        <p>Username to Display: {{ usernameToDisplay }}</p>
        <p>Form Meta Valid: {{ form.meta.value.valid }}</p>
    </div>
    -->
  </div>
</template>
