<script setup lang="ts">
const { username, email } = useAuthStore();
const { logout, isLoading } = useAuth();

const logoutHandler = async () => {
  logout().then((data) => {
    console.log("User logged out successfully!");

    // Get the session management functions from the plugin
    const { $releaseSession, $notifyLogout } = useNuxtApp();

    // Release the session
    $releaseSession();

    // Notify other tabs about the logout
    $notifyLogout();
  });
};
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton variant="ghost" class="relative h-8 w-8 rounded-full">
        <UiAvatar class="h-8 w-8">
          <UiAvatarImage src="avatars/01.png" alt="@shadcn" />
          <UiAvatarFallback>SC</UiAvatarFallback>
        </UiAvatar>
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent class="w-56 p-2" align="end">
      <UiDropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col">
          <p class="text-base font-bold leading-none capitalize">
            {{ username }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ email }}
          </p>
        </div>
      </UiDropdownMenuLabel>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuGroup>
        <NuxtLink to="/profile">
          <UiDropdownMenuItem>
            Profile
            <UiDropdownMenuShortcut>⇧⌘P</UiDropdownMenuShortcut>
          </UiDropdownMenuItem>
        </NuxtLink>
        <NuxtLink to="/settings">
          <UiDropdownMenuItem>
            Change Password
            <UiDropdownMenuShortcut>⌘S</UiDropdownMenuShortcut>
          </UiDropdownMenuItem>
        </NuxtLink>
      </UiDropdownMenuGroup>
      <UiDropdownMenuSeparator />
      <div @click="logoutHandler" to="/login">
        <UiDropdownMenuItem>
          Log out
          <UiDropdownMenuShortcut>⇧⌘Q</UiDropdownMenuShortcut>
        </UiDropdownMenuItem>
      </div>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
