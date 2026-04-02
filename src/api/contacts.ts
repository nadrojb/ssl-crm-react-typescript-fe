import { apiClient } from "./client";
import { toAppError, type AppError } from "./errorHandler";
import {
  ContactsListResponseSchema,
  ContactResponseSchema,
  type ContactsListResponse,
  type CreateContactRequest,
  type Contact,
} from "./schemas/contact";

export async function getContacts(params?: {
  page?: number;
  perPage?: number;
  sort?: string;
  filterName?: string;
}): Promise<ContactsListResponse> {
  try {
    const queryParams: Record<string, string | number> = {};

    if (params?.page != null) {
      queryParams.page = params.page;
    }

    if (params?.perPage != null) {
      queryParams.per_page = params.perPage;
    }

    if (params?.sort != null && params.sort.trim().length > 0) {
      queryParams.sort = params.sort;
    }

    if (params?.filterName != null && params.filterName.trim().length > 0) {
      queryParams["filter[name]"] = params.filterName;
    }

    const response = await apiClient.get("/contacts", {
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    });

    return ContactsListResponseSchema.parse(response.data);
  } catch (error: unknown) {
    const appError: AppError = toAppError(error);
    throw appError;
  }
}

export async function createContact(
  payload: CreateContactRequest
): Promise<Contact> {
  try {
    const response = await apiClient.post("/contacts", payload);
    return ContactResponseSchema.parse(response.data).data;
  } catch (error: unknown) {
    const appError: AppError = toAppError(error);
    throw appError;
  }
}
