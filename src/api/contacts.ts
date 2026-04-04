import { apiClient } from "./client";
import { toAppError } from "./errorHandler";
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
    const response = await apiClient.get("/contacts", {
      params: {
        page: params?.page,
        per_page: params?.perPage,
        sort: params?.sort,
        "filter[name]": params?.filterName,
      },
    });

    return ContactsListResponseSchema.parse(response.data);
  } catch (error) {
    throw toAppError(error);
  }
}

export async function createContact(
    payload: CreateContactRequest
): Promise<Contact> {
  try {
    const response = await apiClient.post("/contacts", payload);
    return ContactResponseSchema.parse(response.data).data;
  } catch (error) {
    throw toAppError(error);
  }
}