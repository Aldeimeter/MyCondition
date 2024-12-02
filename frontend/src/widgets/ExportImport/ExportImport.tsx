import { api } from "@/shared/api";
import React, { useRef } from "react";

interface Props {
  endpoint: string;
  triggerRefresh: () => void;
}

export const ExportImport = ({ endpoint, triggerRefresh }: Props) => {
  const fileSelectorRef = useRef<HTMLInputElement | null>(null); // Specify type for the ref
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.target; // Reference to the file input

    try {
      if (input.files) {
        const file = input.files[0];
        const text = await file.text();

        // Send the CSV data to the server
        const response = await api.post(endpoint, { csv: text });

        // Check for success
        if (response.data.success) {
          alert("File imported successfully!");

          // If there are errors, format them for display
          if (response.data.errors && response.data.errors.length > 0) {
            const errorMessages = response.data.errors
              .map(
                (error: { line: number; error: string }) =>
                  `Line ${error.line}: ${error.error}`,
              )
              .join("\n");

            alert(`Some errors occurred during import:\n${errorMessages}`);
          }
        } else {
          alert("Failed to import the file.");
        }
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while importing the file.");
    } finally {
      triggerRefresh();
      // Clear the file input
      input.value = "";
    }
  };
  const handleExportMeasures = async () => {
    try {
      const response = await api.get(`${endpoint}`);
      const data = await response.data;
      const blob = new Blob([data.csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "export.csv");
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting:", error);
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="file"
        accept=".csv" // Accept only CSV files
        onChange={handleFileChange}
        hidden={true}
        ref={fileSelectorRef}
      />
      <button
        onClick={handleExportMeasures}
        className="p-1 bg-gray-500 text-white rounded-full hover:bg-blue-600"
      >
        Export measures
      </button>
      <button
        onClick={() => fileSelectorRef.current?.click()}
        className="p-1 bg-gray-500 text-white rounded-full hover:bg-blue-600"
      >
        Import measures
      </button>
    </div>
  );
};
