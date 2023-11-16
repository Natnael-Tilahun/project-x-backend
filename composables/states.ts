export const useSidebarCollapsed = () =>
  useState<boolean>("menuCollapsed", () => false);
