import { IAdvertisement } from "@/entities/ad";
import { api } from "@/shared/api";
import {
  RightSidebar,
  Table,
  TableData,
  Pagination,
  CreateAdForm,
} from "@/widgets";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";

export const Advertisement = () => {
  const tableColumns = [
    { key: "targetUrl", label: "Target" },
    { key: "imgUrl", label: "Image" },
    { key: "counter", label: "Counter" },
    { key: "isActive", label: "Active" },
  ];

  const [ads, setAds] = useState<IAdvertisement[]>([]);
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

  const setActive = async (itemId: string) => {
    try {
      const response = await api.patch(`/ad/activate/${itemId}`);
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
        const response = await api.get(`/ad/all?page=${page}&limit=10`);
        const sortedAds = response.data.ads.sort(
          (a: { isActive: boolean }, b: { isActive: boolean }) => {
            if (a.isActive && !b.isActive) return -1; // `a` is active, move it earlier
            if (!a.isActive && b.isActive) return 1; // `b` is active, move it earlier
            return 0; // Both are either active or inactive, maintain order
          },
        );
        setAds(sortedAds);
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
          Click on row to activate ad
        </h2>
        <Table
          data={ads as unknown as TableData[]}
          columns={tableColumns}
          onClickAction={setActive}
        />
      </div>
      <RightSidebar>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <CreateAdForm triggerRefresh={triggerRefresh} />
      </RightSidebar>
    </div>
  );
};
