import { api } from "@/shared/api";
import {
  RightSidebar,
  Table,
  TableData,
  CreateMethodForm,
  Pagination,
} from "@/widgets";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
interface Method extends TableData {
  name: string;
  description: string;
}
export const Methods = () => {
  const tableColumns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];

  const mockedMethods = [
    {
      id: "2cd63cfe-1483-438f-9660-d92551001409",
      name: "Name 1",
      description: "Some random description",
    },
    {
      id: "1e414d08-d32e-4cb9-bc07-72a75d84c501",
      description:
        "Method with a description that is very long and exceeds typical lengths. This description is specifically designed to be exactly 1024 characters long. It should contain detailed information about the method, its purpose, usage, and any other relevant details. This part continues to fill in the character count to ensure the total length reaches exactly 1024 characters, demonstrating the capability to handle lengthy descriptions effectively. The goal is to test the boundaries of the description length and confirm that the system manages it without errors.",
      name: "This method has long description that contains useful information.",
    },
    {
      id: "3ab47344-95be-44c5-918f-8f5d3c39fca7",
      name: "A method name that is exactly forty-eight characters long!",
      description: "This method has a proper description.",
    },
    {
      id: "5e6d7f8c-d10f-4b7e-b01d-f68e21504870",
      name: "Method Without Description",
      description: "",
    },
    {
      id: "9f19bc3d-5c66-4f69-96d2-e499e4c9e067",
      name: "Another Method",
      description: "A brief description.",
    },
  ];

  const [methods, setMethods] = useState<Method[]>(mockedMethods);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refresh, setRefresh] = useState(false);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const triggerRefresh = () => {
    setRefresh((prev) => !prev); // Toggle refresh to trigger useEffect
  };

  const deleteMethod = async (itemId: string) => {
    try {
      const response = await api.delete(`/methods/${itemId}`);
      if (response.data.success) {
        triggerRefresh();
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        const error = e as AxiosError;
        console.error(error.cause);
      } else {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const getPaginatedMethods = async (page: number) => {
      try {
        const response = await api.get(`/methods?page=${page}&limit=10`);
        setMethods(response.data.methods);
        setTotalPages(response.data.totalPages);
      } catch (e: unknown) {
        if (e instanceof AxiosError) {
          const error = e as AxiosError;
          console.error(error.cause);
        } else {
          console.error(e);
        }
      }
    };
    getPaginatedMethods(currentPage);
  }, [currentPage, refresh]);

  // TODO: add onClick deletion
  // TODO: add useEffect to fetch methods
  return (
    <div className="flex">
      <Table
        data={methods}
        columns={tableColumns}
        onClickAction={deleteMethod}
      />
      <RightSidebar>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <CreateMethodForm triggerRefresh={triggerRefresh} />
      </RightSidebar>
    </div>
  );
};
