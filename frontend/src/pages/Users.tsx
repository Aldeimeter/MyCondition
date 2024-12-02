import { User } from "@/entities/user";
import { api } from "@/shared/api";
import {
  RightSidebar,
  Table,
  TableData,
  Pagination,
  CreateUserForm,
  ExportImport,
} from "@/widgets";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
export const Users = () => {
  const tableColumns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "age", label: "Age" },
    { key: "height", label: "Height" },
  ];

  const [users, setUsers] = useState<User[]>([]);
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

  const deleteUser = async (itemId: string) => {
    try {
      const response = await api.delete(`/users/${itemId}`);
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
    const getPaginatedUsers = async (page: number) => {
      try {
        const response = await api.get(`/users?page=${page}&limit=10`);
        setUsers(response.data.users);
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
    getPaginatedUsers(currentPage);
  }, [currentPage, refresh]);

  return (
    <div className="flex">
      <Table
        data={users as unknown as TableData[]}
        columns={tableColumns}
        onClickAction={deleteUser}
      />
      <RightSidebar>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <CreateUserForm triggerRefresh={triggerRefresh} />
        <ExportImport endpoint="/users/csv" triggerRefresh={triggerRefresh} />
      </RightSidebar>
    </div>
  );
};
