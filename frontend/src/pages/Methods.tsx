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

  const [methods, setMethods] = useState<Method[]>([]);
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
    <div className="flex gap-8 p-8 max-w-7xl mx-auto">
      <div className="flex-1 shadow-sm border rounded-lg">
        <h2 className="pt-3 text-center text-2xl font-light mb-6">
          Click on row to delete method
        </h2>
        <Table
          data={methods}
          columns={tableColumns}
          onClickAction={deleteMethod}
        />
      </div>
      <RightSidebar>
        <div className="w-[300px] space-y-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <CreateMethodForm triggerRefresh={triggerRefresh} />
        </div>
      </RightSidebar>
    </div>
  );
};
