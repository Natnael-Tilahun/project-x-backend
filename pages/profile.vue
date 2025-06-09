<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { profileFormSchema } from "~/validations/profileFormSchema";
import { toast } from "~/components/ui/toast";
import type { Profile } from "~/types";

const { getProfile, isLoading } = useProfile();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<Profile>();
const openItems = ref("profileInfo");

// const { getProfile, isLoading } = useAuth();
// const isLoading = ref(false);

const form = useForm<Profile>({
  validationSchema: profileFormSchema,
});

const onSubmit = form.handleSubmit((values: any) => {
  console.log("Form submitted!", values);
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});

// Fetch profile data when the component is mounted
onMounted(async () => {
  try {
    isLoading.value = true;
    const profileData = await getProfile(); // Call your API function to fetch profile
    console.log("Profile data; ", profileData);
    console.log("form data; ", form.values);
    form.setValues(profileData);

    // form.setValues(profileData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `There was a problem with your request: ${error}`,
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="pb-4">
      <h1 class="md:text-2xl text-lg font-medium">Profile</h1>
      <p class="text-sm text-muted-foreground">Update your profile</p>
    </div>

    <UiCard class="p-6 space-y-8" v-if="isLoading">
      <div class="grid grid-cols-2 gap-8">
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
      </div>
      <div class="w-full flex justify-between">
        <UiSkeleton class="h-16 w-1/5" />
        <UiSkeleton class="h-16 w-1/5" />
      </div>
    </UiCard>

    <UiCard v-else >
      <UiTabs v-model="openItems" class="w-full space-y-0">
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
        <UiTabsTrigger
          value="profileInfo"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
        Profile Details
        </UiTabsTrigger>
        <UiTabsTrigger
          value="assignments"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Assignments
        </UiTabsTrigger>
        </UiTabsList>
        <UiTabsContent
        value="profileInfo"
        class="text-base bg-background p-6 rounded-lg"
      >
      <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <!-- <FormField v-slot="{ componentField }" name="employeeId">
            <FormItem>
              <FormLabel> Employee ID </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="CBE050202"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField> -->
          <FormField v-slot="{ componentField }" name="firstname">
            <FormItem>
              <FormLabel> First Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter first name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lastname">
            <FormItem>
              <FormLabel> Last Name </FormLabel>
              <FormControl>
                <UiInput
                  class="disabled:text-black opacity"
                  type="text"
                  placeholder="Enter last name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="emailAddress">
            <FormItem>
              <FormLabel> Email Address </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter Email Address"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="mobileNo">
            <FormItem>
              <FormLabel> Phone </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter phone number"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- <FormField v-slot="{ componentField }" name="authorities">
            <FormItem>
              <FormLabel> Role </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter Role "
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField> -->
          <FormField v-slot="{ componentField }" name="active">
            <FormItem>
              <FormLabel> Status </FormLabel>
              <!-- <FormControl> -->
                <UiBadge
                  class="p-2 rounded-md w-full hover:bg-green-500"
                  :class="data?.active ? 'bg-green-500' : 'bg-red-500'"
                >
                  {{ data?.active ? "Active" : "Inactive" }}
                </UiBadge>
              <!-- </FormControl> -->
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- <FormField v-slot="{ componentField }" name="authorities">
            <FormItem>
              <FormLabel>Permissions</FormLabel>
              <FormControl>
                <UiTextarea
                  placeholder="Enter Permissions"
                  class="resize-y"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField> -->
<!-- 
          <div class="col-span-full w-full py-4 flex justify-between">
            <UiButton
              :disabled="isLoading"
              variant="outline"
              type="button"
              size="lg"
              @click="$router.go(-1)"
            >
              Cancel
            </UiButton>
            <UiButton disabled :disabled="isLoading" size="lg" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="isLoading"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Update
            </UiButton>
          </div> -->
        </div>
      </form>
      </UiTabsContent>
      <UiTabsContent
        value="assignments"
        class="text-base bg-background p-6 rounded-lg"
      >
        <ProfileAssignments />
      </UiTabsContent>
      </UiTabs>
    </UiCard>
  </div>
</template>

<style lang="css" scoped></style>
