import { IAdvertisement } from "@/entities/ad";
import { api } from "@/shared/api";
import {
  Errors,
  mapValidationErrors,
  ValidationErrorResponse,
} from "@/shared/utils";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { ValidatedInput } from "..";

interface FormProps {
  triggerRefresh: () => void;
}
export const CreateAdForm = ({ triggerRefresh }: FormProps) => {
  const [formData, setFormData] = useState<IAdvertisement>({
    imgUrl: "",
    targetUrl: "",
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
      const response = await api.post("/ad", formData);
      if (response.data.success) {
        setFormData({
          imgUrl: "",
          targetUrl: "",
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
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <ValidatedInput
        inputProps={{
          type: "text",
          id: "imgUrl",
          name: "imgUrl",
          value: formData.imgUrl,
          onChange: handleChange,
          placeholder: "Image url",
          maxLength: 2048,
        }}
        label="Image url"
        error={errors.imgUrl}
      />
      <ValidatedInput
        inputProps={{
          type: "text",
          id: "targetUrl",
          name: "targetUrl",
          value: formData.targetUrl,
          onChange: handleChange,
          placeholder: "Target url",
          maxLength: 2048,
        }}
        label="Target url"
        error={errors.targerUrl}
      />
      <button
        type="submit"
        className="w-3/4 mt-2 mx-auto focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2"
      >
        Add
      </button>
      {errors.global && (
        <span className="ms-1 mt-0.5 text-sm font-medium text-red-500">
          {errors.global}
        </span>
      )}
    </form>
  );
};
