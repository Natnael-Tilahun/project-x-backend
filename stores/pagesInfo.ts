import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

enum Sort {
  ASC = "asc",
  DESC = "desc",
}

interface PagesInfoState {
  pageNumber: number;
  isUpdated: boolean;
  pageSize: number
  sort: Sort
}

interface PagesInfoPayload {
  pageNumber: number;
  isUpdated: boolean;
  pageSize: number
  sort: Sort
}

export const usePagesInfoStore = defineStore("pagesInfo", {


  state: (): PagesInfoState => ({
    pageNumber: 0,
    isUpdated: false,
    pageSize: 10000,
    sort: Sort.ASC
  }),

  actions: {
    setPageInfo(pagesInfo: Partial<PagesInfoPayload>) {
      this.pageNumber = pagesInfo.pageNumber ?? 0
      this.isUpdated = pagesInfo?.isUpdated ?? false;
      this.pageSize = pagesInfo.pageSize ?? 0
      this.sort = pagesInfo.sort ?? Sort.ASC

    },

    setPageNumber(pagesInfo: { pageNumber: number }) {
      this.pageNumber = pagesInfo?.pageNumber ?? 0;
    },

    setPageSize(pagesInfo: { pageSize: number }) {
      this.pageSize = pagesInfo?.pageSize ?? 0;
    },

    setIsUpdated(pagesInfo: { isUpdated: boolean }) {
      this.isUpdated = pagesInfo?.isUpdated ?? false;
    },

    $reset() {
      this.isUpdated = false;
      this.pageNumber = 0;
      this.sort = Sort.ASC;
      this.pageSize = 10
    },
  },
  getters: {
    // hasPermissions: (state) => {
    //   return (permission: string) => state.permissions.includes(permission);
    // },

    // hasRole: (state) => {
    //   return (role: string) => state.userRole === role;
    // }
  },
  // persist: {
  //   storage: persistedState.cookies,
  // },
});
