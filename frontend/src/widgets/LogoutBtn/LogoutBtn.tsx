import React, { useState } from "react";
import { api } from "@/shared/api";
import { useAuth } from "@/features/auth/AuthContext";
import { AxiosError } from "axios";
import { Errors } from "@/shared/utils";
export const LogoutBtn = () => {
  const { logout } = useAuth();

  const [errors, setErrors] = useState<Errors>({});
  const onClick = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    try {
      await api.post("/users/logout");
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        const error = e as AxiosError;
        setErrors({ global: "Unexpected error" });
        console.error("Axios error:", error);
      } else {
        console.error("Logout error:", e);
      }
    } finally {
      logout();
    }
  };
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onClick}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        Logout
      </button>
      {errors.global && (
        <span className="mx-auto my-0.5 text-sm font-medium text-red-500">
          {errors.global}
        </span>
      )}
    </div>
  );
};
