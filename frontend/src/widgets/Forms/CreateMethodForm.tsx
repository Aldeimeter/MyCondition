import { api } from "@/shared/api";
import {
  Errors,
  mapValidationErrors,
  ValidationErrorResponse,
} from "@/shared/utils";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { ValidatedInput } from "..";

interface MethodForm {
  name: string;
  description: string;
}
interface FormProps {
  triggerRefresh: () => void;
}
export const CreateMethodForm = ({ triggerRefresh }: FormProps) => {
  const [formData, setFormData] = useState<MethodForm>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    ev.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      [ev.target.id]: ev.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await api.post("/methods", formData);
      if (response.data.success) {
        setFormData({
          name: "",
          description: "",
        });
        triggerRefresh();
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
        console.error("Signup error:", e);
      }
    }
  };
  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <ValidatedInput
        inputProps={{
          type: "text",
          id: "name",
          name: "name",
          value: formData.name,
          onChange: handleChange,
          placeholder: "Method name",
          className: "w-full",
        }}
        label="Name"
        error={errors.name}
      />
      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="mb-2 text-sm font-medium text-gray-900"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="min-h-[200px] w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500"
          maxLength={1024}
          onChange={handleChange}
          value={formData.description}
        />
        {errors.description && (
          <span className="mt-1 text-sm font-medium text-red-500">
            {errors.description}
          </span>
        )}
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        Create
      </button>
      {errors.global && (
        <span className="text-sm font-medium text-red-500">
          {errors.global}
        </span>
      )}
    </form>
  );
};
