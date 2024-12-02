import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/shared/api";
import type { ResponseData } from "@/shared/api";
import { useAuth } from "@/features/auth";
import { ErrorResponse, Errors, ValidationErrorResponse } from "@/shared/utils";
import { AxiosError } from "axios";
import { mapValidationErrors } from "@/shared/utils";
import { ValidatedInput } from "@/widgets";

interface LoginForm {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await api.post("/users/login", formData);
      const { accessToken } = response.data as ResponseData;
      login(accessToken);
      navigate("/measures");
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
          case 400:
            if (error.response?.data) {
              const data = error.response.data as ErrorResponse;
              setErrors({ ...errors, global: data.feedback });
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
    <div className="max-w-sm mx-auto mt-3 shadow-md rounded-xl bg-gray-100">
      <h2 className="text-center text-3xl font-extralight">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <ValidatedInput
          inputProps={{
            type: "text",
            id: "email",
            name: "email",
            value: formData.email,
            onChange: handleChange,
            placeholder: "Email",
          }}
          label="Email Address"
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
        <button
          type="submit"
          className="w-3/4 mt-2 mx-auto focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2"
        >
          Login
        </button>
        {errors.global && (
          <span className="mx-auto my-0.5 text-sm font-medium text-red-500">
            {errors.global}
          </span>
        )}
      </form>
    </div>
  );
};
