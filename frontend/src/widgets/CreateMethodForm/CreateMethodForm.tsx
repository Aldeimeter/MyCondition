import { api } from "@/shared/api";
import { ErrorResponse, Errors, mapValidationErrors } from "@/shared/utils";
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
              const data = error.response.data as ErrorResponse;
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
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <ValidatedInput
        inputProps={{
          type: "text",
          id: "name",
          name: "name",
          value: formData.name,
          onChange: handleChange,
          placeholder: "Method name",
        }}
        label="Name"
        error={errors.name}
      />
      <div className="mb-2 flex flex-col w-full">
        <label
          htmlFor="description"
          className="ms-1 mb-1 text-sm font-medium text-gray-900"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full h-52 p-2.5 text-sm text-gray-900 resize-none"
          maxLength={1024}
          onChange={handleChange}
          value={formData.description}
        />
        {errors.description && (
          <span className="ms-1 mt-0.5 text-sm font-medium text-red-500">
            {errors.description}
          </span>
        )}
      </div>
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
