import { User } from "@/entities/user";
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
export const CreateUserForm = ({ triggerRefresh }: FormProps) => {
  const [formData, setFormData] = useState<User>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    age: 14,
    height: 160,
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
      const response = await api.post("/users", formData);
      if (response.data.success) {
        setFormData({
          username: "",
          email: "",
          password: "",
          passwordConfirm: "",
          age: 14,
          height: 160,
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
          id: "username",
          name: "username",
          value: formData.username,
          onChange: handleChange,
          placeholder: "Username",
        }}
        label="Username"
        error={errors.username}
      />
      <ValidatedInput
        inputProps={{
          type: "text",
          id: "email",
          name: "email",
          value: formData.email,
          onChange: handleChange,
          placeholder: "Email",
        }}
        label="Email"
        error={errors.email}
      />
      <ValidatedInput
        inputProps={{
          type: "password",
          id: "password",
          name: "password",
          value: formData.password,
          onChange: handleChange,
          placeholder: "Password",
        }}
        label="Password"
        error={errors.password}
      />
      <ValidatedInput
        inputProps={{
          type: "password",
          id: "passwordConfirm",
          name: "passwordConfirm",
          value: formData.passwordConfirm,
          onChange: handleChange,
          placeholder: "Confirm password",
        }}
        label="Confirm password"
        error={errors.passwordConfirm}
      />
      <div className="flex flex-row gap-8">
        <ValidatedInput
          inputProps={{
            type: "number",
            id: "age",
            name: "age",
            value: formData.age,
            onChange: handleChange,
            min: 14,
            max: 100,
          }}
          label="Age"
          error={errors.age}
        />
        <ValidatedInput
          inputProps={{
            type: "number",
            id: "height",
            name: "height",
            value: formData.height,
            onChange: handleChange,
            min: 100,
            max: 220,
          }}
          label="Height"
          error={errors.height}
        />
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
