import type { Contract, CustomerGroup, CustomerGroupMember, Device, LoginHistory, Staff } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useCustomerGroups = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getCustomerGroups: (
    page?: number,
    size?: number
  ) => ApiResult<CustomerGroup[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroup[]>(
        "/api/v1/internal/customer-groups",
        {
          params: {
            page,
            size,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroup[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getCustomerGroupById: (groupId: string) => ApiResult<CustomerGroup> = async (groupId) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroup>(
        `/api/v1/internal/customer-groups/${groupId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroup) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewCustomerGroup: (groupData: any) => ApiResult<CustomerGroup> = async (
    groupData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroup>(
        "/api/v1/internal/customer-groups",
        {
          method: "POST",
          body: groupData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroup) : null;
    } catch (err) {
      throw err
    }
  };

  const updateCustomerGroups: (
    groupId: string,
    groupData: any
  ) => ApiResult<CustomerGroup> = async (groupId, groupData) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroup>(
        `/api/v1/internal/customer-groups/${groupId}`,
        {
          method: "PATCH",
          body: groupData,
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroup) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteCustomerGroup: (groupId: string) => ApiResult<any> = async (groupId) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/customer-groups/${groupId}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err
    }
  };

  const deleteCustomerMember: (gromemberIdupId: string) => ApiResult<any> = async (memberId) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/customer-groups/members/delete/${memberId}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err
    }
  };

  const addPaymentIntegrationsInTheGroup: (groupId: string, integraionsData:any) => ApiResult<CustomerGroup> = async (
    groupId,
    integraionsData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroup>(
        `/api/v1/internal/customer-groups/${groupId}/payment-integrations`,
        {
          method: "POST",
          body: integraionsData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroup) : null;
    } catch (err) {
      throw err;
    }
  };

  const deletePaymentIntegrationsFromTheGroup: (groupId: string, integraionsData:any) => ApiResult<CustomerGroup> = async (
    groupId,
    integraionsData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroup>(
        `/api/v1/internal/customer-groups/${groupId}/payment-integrations`,
        {
          method: "DELETE",
          body: integraionsData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroup) : null;
    } catch (err) {
      throw err;
    }
  };

  const addMembersInTheGroup: (groupId: string, membersData:any) => ApiResult<CustomerGroup> = async (
    groupId,
    membersData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroup>(
        `/api/v1/internal/customer-groups/${groupId}/members`,
        {
          method: "POST",
          body: membersData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroup) : null;
    } catch (err) {
      throw err;
    }
  };

  const deleteMembersFromTheGroup: (groupId: string, membersData:any) => ApiResult<CustomerGroup> = async (
    groupId,
    membersData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroup>(
        `/api/v1/internal/customer-groups/${groupId}/members`,
        {
          method: "DELETE",
          body: membersData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroup) : null;
    } catch (err) {
      throw err;
    }
  };

  const getCustomerGroupMemebersByGroupId: (groupId: string, page?: number,
    size?: number) => ApiResult<CustomerGroupMember> = async (groupId, page, size) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroupMember>(
        `/api/v1/internal/customer-groups/${groupId}/members`,
        {
          params: {
            page,
            size,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroupMember) : null;
    } catch (err) {
      throw err
    }
  };

  const getCustomerGroupPaymentIntegrationsByGroupId: (groupId: string, page?: number,
    size?: number) => ApiResult<CustomerGroupMember> = async (groupId, page, size) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroupMember>(
        `/api/v1/internal/customer-groups/${groupId}/payment-integrations`,
        {
          params: {
            page,
            size,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroupMember) : null;
    } catch (err) {
      throw err
    }
  };

  return {
    isLoading,
    getCustomerGroups,
    getCustomerGroupById,
    createNewCustomerGroup,
    deleteCustomerGroup,
    updateCustomerGroups,
    addPaymentIntegrationsInTheGroup,
    deletePaymentIntegrationsFromTheGroup,
    addMembersInTheGroup,
    deleteMembersFromTheGroup,
    getCustomerGroupMemebersByGroupId,
    getCustomerGroupPaymentIntegrationsByGroupId,
    deleteCustomerMember,
    isSubmitting,
  };
};
