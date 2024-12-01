import { api } from "@/shared/api";
import { Suggestion } from "@/widgets";

export const fetchMethodsSearch = async (
  query: string,
): Promise<Suggestion[]> => {
  try {
    const response = await api.get(`/methods/search?q=${query}`);
    return [...response.data.methods, { name: "No method", id: "null" }];
  } catch (error) {
    console.error(error);
    return [];
  }
};
