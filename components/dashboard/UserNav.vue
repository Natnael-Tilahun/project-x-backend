<script setup lang="ts">
const { username, email } = useAuthStore();
const { logout, isLoading } = await useAuth();

const logoutHandler = async () => {
  logout().then((data) => {
    console.log("User logged out successfully!");
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
    <UiDropdownMenuContent class="w-56" align="end">
      <UiDropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">{{ username }}</p>
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
            Settings
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
