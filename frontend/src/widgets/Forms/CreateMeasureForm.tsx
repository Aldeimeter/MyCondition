import { fetchMethodsSearch } from "@/entities/method";
import { api } from "@/shared/api";
import {
  Errors,
  mapValidationErrors,
  ValidationErrorResponse,
} from "@/shared/utils";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { SearchWithSuggestions, ValidatedInput } from "..";

interface MeasureForm {
  date: string;
  value: string;
  methodId: string;
}
interface FormProps {
  triggerRefresh: () => void;
  measureType: string;
}
interface Method {
  id: string;
  name: string;
}
export const CreateMeasureForm = ({
  triggerRefresh,
  measureType,
}: FormProps) => {
  const [formData, setFormData] = useState<MeasureForm>({
    date: "",
    value: "",
    methodId: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [resetSearch, setResetSearch] = useState(false);

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    ev.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      [ev.target.id]: ev.target.value,
    }));
  };

  const setMethod = (methodId: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      methodId: methodId,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await api.post(`/${measureType}`, formData);
      if (response.data.success) {
        setFormData({
          date: "",
          value: "",
          methodId: "",
        });
        triggerRefresh();
        setResetSearch((prev) => !prev);
      }
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        const error = e as AxiosError;
        switch (error.status) {
          case 422:
            if (error.response?.data) {
              const data = error.response.data as ValidationErrorResponse;
              setErrors(mapValidationErrors(data.validationErrors));
            }
            break;

          default:
            setErrors({ global: "Unexpected error" });
            console.error("Axios error:", error);
            break;
        }
      } else {
        console.error("Unexpected Error:", e);
      }
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <ValidatedInput
        inputProps={{
          type: "date",
          id: "date",
          name: "date",
          value: formData.date,
          onChange: handleChange,
        }}
        label="Date"
        error={errors.date}
      />
      <ValidatedInput
        inputProps={{
          type: "number",
          id: "value",
          name: "value",
          value: formData.value,
          onChange: handleChange,
        }}
        label="Value"
        error={errors.value}
      />
      <SearchWithSuggestions
        fetchSuggestions={fetchMethodsSearch}
        callback={setMethod}
        searchName="Method"
        reset={resetSearch}
      />
      <button
        type="submit"
        className="w-3/4 mt-2 mx-auto focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2"
      >
        Create
      </button>
      {errors.global && (
        <span className="ms-1 mt-0.5 text-sm font-medium text-red-500">
          {errors.global}
        </span>
      )}
    </form>
  );
};
