import React from "react";

type Props = {
  error?: string;
  label?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
};

const ValidatedInput = ({ error, label, inputProps }: Props) => {
  return (
    <div className="mb-2 flex flex-col w-full">
      {label && (
        <label
          htmlFor={inputProps.id}
          className="ms-1 mb-1 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      )}
      <input
        {...inputProps}
        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 text-sm text-gray-900"
      />
      {error && (
        <span className="ms-1 mt-0.5 text-sm font-medium text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default ValidatedInput;
