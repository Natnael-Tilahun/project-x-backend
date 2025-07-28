<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import UnlockUser from "~/components/users/UnlockUser.vue";
import { PermissionConstants } from "~/constants/permissions";
import { getIdFromPath } from "~/lib/utils";
import type { User } from "~/types";

const route = useRoute();
const {
  getUserById,
  isLoading,
} = useUsers();
const customerId = ref<string>("");
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<User>();
const tooltipText = ref<string>("Copy to clipboard");
const tooltipOpen = ref<boolean>(true);

customerId.value = getIdFromPath(route.fullPath);

const copyToClipboard = (data: any) => {
  navigator.clipboard.writeText(data);
  tooltipText.value = "Copied to clipboard";
  tooltipOpen.value = true;
  toast({
    title: "Copied to clipboard",
  });
  setTimeout(() => {
    tooltipOpen.value = false;
    tooltipText.value = "Copy to clipboard";
  }, 2000); // Reset the tooltip text after 2 seconds
};

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getUserById(customerId.value); // Call your API function to fetch roles
} catch (err) {
  console.error("Error fetching users:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <UiCard class="w-full p-6">
      <UiTabs default-value="profile" class="space-y-0 w-full">
        <UiTabsList
          class="w-full bg-backgroung flex justify-start py- px-0 border-[1px]"
        >
          <UiPermissionGuard :permission=PermissionConstants.READ_USER >
          <UiTabsTrigger
            value="profile"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Profile
          </UiTabsTrigger>
          </UiPermissionGuard>
          <UiPermissionGuard :permission=PermissionConstants.RESET_USER_PIN >
          <UiTabsTrigger
            value="pinReset"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            PIN Reset
          </UiTabsTrigger>
          </UiPermissionGuard>
          <!-- <UiPermissionGuard :permission=PermissionConstants.UNLOCK_USER > -->
          <UiTabsTrigger
            value="unlockUser"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Unlock User
          </UiTabsTrigger>
          <!-- </UiPermissionGuard> -->
          <UiPermissionGuard :permission=PermissionConstants.READ_USER_DEVICE >
        <UiTabsTrigger
            value="devices"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Devices
          </UiTabsTrigger>
          </UiPermissionGuard>
          <!-- <UiPermissionGuard :permission=PermissionConstants.RESET_USER_PIN > -->
          <UiTabsTrigger
            value="loginHistory"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Login History
          </UiTabsTrigger>
          <!-- </UiPermissionGuard> -->
        </UiTabsList>

        <UiPermissionGuard :permission=PermissionConstants.READ_USER >
        <UiTabsContent value="profile" class="space-y-4 pt-4 text-sm border-0">
          <UiCard class="grid lg:grid-cols-3 gap-4 md:gap-8 w-full p-6">
            <div class="space-y-1">
              <h1 class="text-muted-foreground uppercase">ID</h1>
              <div
                @click="copyToClipboard(data?.id)"
                class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
              >
                <p>{{ data?.id || "Not Setted" }}</p>
                <Icon
                  name="material-symbols:content-copy"
                  class="h-5 w-5 text-primary"
                ></Icon>
              </div>
            </div>
            <div class="space-y-1">
              <h1 class="text-muted-foreground">Username</h1>
              <div
                @click="copyToClipboard(data?.login)"
                class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
              >
                <p>{{ data?.login || "Not Setted" }}</p>
                <Icon
                  name="material-symbols:content-copy"
                  class="h-5 w-5 text-primary"
                ></Icon>
              </div>
            </div>
            <div class="space-y-1">
              <h1 class="text-muted-foreground">Phone Number</h1>
              <div
                @click="copyToClipboard(data?.phone)"
                class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
              >
                <p>{{ data?.phone || "Not Setted" }}</p>
                <Icon
                  name="material-symbols:content-copy"
                  class="h-5 w-5 text-primary"
                ></Icon>
              </div>
            </div>
            <div class="space-y-1">
              <h1 class="text-muted-foreground">Email</h1>
              <div
                @click="copyToClipboard(data?.email)"
                class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
              >
                <p>{{ data?.email || "Not Setted" }}</p>
                <Icon
                  name="material-symbols:content-copy"
                  class="h-5 w-5 text-primary"
                ></Icon>
              </div>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">National Id</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.nationalId || "Not Setted" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">User Activated</h1>
              <UiBadge
                class="p-2 rounded-md w-full"
                :class="data?.activated  ? 'bg-green-500' : 'bg-red-500'"
              >
                {{ data?.activated  ? "Active" : "Inactive" }}
              </UiBadge>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Verified</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.verified != null ? data?.verified : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Is Enrolled</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.isEnrolled != null ? data.isEnrolled : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Email Verified</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.emailVerified != null ? data?.emailVerified : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Staff</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.staff != null
                    ? data.staff
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Customer</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.customer != null
                    ? data.customer
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Operator</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.operator != null
                    ? data.operator
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Force PIN Change</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.forcePinChange != null ? data.forcePinChange : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Is Pin Set</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.isPinSet != null ? data.isPinSet : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Is User Account Locked</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.isUserAccountLocked != null
                    ? data.isUserAccountLocked
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Created By</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.createdBy != null ? data.createdBy : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Created Date</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.createdDate != null
                    ? new Date(data.createdDate).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Current Login Time</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.currentLoginTime != null
                    ? new Date(data.currentLoginTime).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Device Id</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.deviceId != null ? data.deviceId : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Image Url</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.imageUrl != null ? data.imageUrl : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Language Key</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.langKey != null ? data.langKey : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Last Login Time</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.lastLoginTime != null
                    ? new Date(data.lastLoginTime).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Last Modified By</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.lastModifiedBy != null ? data.lastModifiedBy : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Last Modified Date</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.lastModifiedDate != null
                    ? new Date(data.lastModifiedDate).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Lock Count</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.lockCount != null ? data.lockCount : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Lockout Date Time</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.lockoutDateTime != null
                    ? new Date(data.lockoutDateTime).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Preferred Otp Method</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.preferredOtpMethod != null
                    ? data.preferredOtpMethod
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Reset Date</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.resetDate != null
                    ? new Date(data.resetDate).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Reset Key</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.resetKey != null ? data.resetKey : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Unsuccessful Login Attempts</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.unsuccessfulLoginAttempts != null
                    ? data.unsuccessfulLoginAttempts
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Verification Key</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.verificationKey != null ? data.verificationKey : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Block Level</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.blockLevel != null
                    ? new Date(data.blockLevel).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Block Expiration Time</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.blockExpirationTime != null ? data.blockExpirationTime : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Roles</h1>
              <ul class="border py-3 px-6 bg-muted rounded-md">
                <li
                  class="list-disc"
                  v-for="(item, index) in data?.authorities"
                  :key="index"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </UiCard>
        </UiTabsContent>
        </UiPermissionGuard>



        <UiPermissionGuard :permission=PermissionConstants.RESET_USER_PIN >
        <UiTabsContent value="pinReset" class="space-y-4 py-8">
          <UsersPinReset />
        </UiTabsContent>
        </UiPermissionGuard>


        <!-- <UiPermissionGuard :permission=PermissionConstants.UNLOCK_USER > -->
        <UiTabsContent value="unlockUser" class="space-y-4 py-8">
          <UnlockUser />
        </UiTabsContent>
        <!-- </UiPermissionGuard> -->

        <UiPermissionGuard :permission=PermissionConstants.READ_USER_DEVICE >
            <UiTabsContent value="devices" class="space-y-4 py-8">
          <UsersDevices/>
        </UiTabsContent>
        </UiPermissionGuard>

        <!-- <UiPermissionGuard :permission=PermissionConstants.RESET_USER_PIN > -->
        <UiTabsContent value="loginHistory" class="space-y-4 py-8">
          <UsersLoginHistory />
        </UiTabsContent>
        <!-- </UiPermissionGuard> -->
      </UiTabs>
    </UiCard>
  </div>

</template>

<style lang="css" scoped></style>
