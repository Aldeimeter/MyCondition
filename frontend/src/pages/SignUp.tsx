import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/shared/api";
import type { ResponseData } from "@/shared/api";
import type { Errors, ErrorResponse } from "@/shared/utils";
import { ValidatedInput } from "@/widgets";
import { useAuth } from "@/features/auth";
import { mapValidationErrors } from "@/shared/utils";
import { AxiosError } from "axios";

interface SignUpForm {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
  height: number;
  age: number;
}

export const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpForm>({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    height: 160,
    age: 18,
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
      const response = await api.post("/users/signup", formData);
      const { accessToken } = response.data as ResponseData;
      login(accessToken);
      navigate("/dashboard");
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
    <div className="max-w-sm mx-auto mt-3 shadow-md rounded-xl bg-gray-100">
      <h2 className="text-center text-3xl font-extralight">Sign Up</h2>
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
          label="Confirm Password"
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
            error={errors.age}
          />
        </div>
        <button
          type="submit"
          className="w-3/4 mt-2 mx-auto focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2"
        >
          Sign up
        </button>
        {errors.global && (
          <span className="ms-1 mt-0.5 text-sm font-medium text-red-500">
            {errors.global}
          </span>
        )}
      </form>
    </div>
  );
};
