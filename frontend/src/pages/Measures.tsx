import { fetchMethodsSearch } from "@/entities/method";
import { api } from "@/shared/api";
import {
  CreateMeasureForm,
  ExportImport,
  LinearRegression,
  Pagination,
  RightSidebar,
  SearchWithSuggestions,
  Table,
  TableData,
  ValidatedInput,
} from "@/widgets";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

type MeasuresType = "weight" | "upper" | "lower";

interface Measure extends TableData {
  date: string;
  value: string;
  method: string | null;
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  methodId: string;
}

export const Measures = () => {
  const tableColumns = [
    { key: "date", label: "Date" },
    { key: "value", label: "Value" },
    { key: "method", label: "Method" },
  ];

  const [resetSearch, setResetSearch] = useState(false);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [measureType, setMeasureType] = useState<MeasuresType>("weight");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refresh, setRefresh] = useState(false);

  const [filterError, setFilterError] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // Local state for temporary filter values
  const [tempFilter, setTempFilter] = useState<Filters>({
    methodId: "",
    dateFrom: "",
    dateTo: "",
  });

  const [filter, setFilter] = useState<Filters>({
    methodId: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    const fetchMeasures = async (
      measureType: string,
      isFiltered: boolean,
      dateFrom: string,
      dateTo: string,
      methodId: string,
      page: number,
      limit: number,
    ) => {
      try {
        const response = await api.get(`/${measureType}`, {
          params: {
            dateFrom: (isFiltered && dateFrom) || undefined,
            dateTo: (isFiltered && dateTo) || undefined,
            methodId: (isFiltered && methodId) || undefined,
            page,
            limit,
          },
        });

        setMeasures(response.data.measures);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching measures:", error);
        throw error;
      }
    };

    fetchMeasures(
      measureType,
      isFiltered,
      filter.dateFrom,
      filter.dateTo,
      filter.methodId,
      currentPage,
      10,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, measureType, refresh]);
  const deleteMeasure = async (itemId: string) => {
    try {
      const response = await api.delete(`/${measureType}/${itemId}`);
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

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const triggerRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const handleFilterChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    ev.preventDefault();
    setTempFilter((prev) => ({
      ...prev,
      [ev.target.id]: ev.target.value,
    }));
  };
  const setMethod = (methodId: string) => {
    setTempFilter((prev) => ({
      ...prev,
      methodId,
    }));
  };
  const applyFilters = () => {
    if (
      tempFilter.dateFrom &&
      tempFilter.dateTo &&
      tempFilter.dateFrom > tempFilter.dateTo
    ) {
      setFilterError("The 'Date from' must be before or equal to 'Date to'.");
      return;
    }
    setFilterError(""); // Clear any previous errors
    setIsFiltered(true);
    setFilter(tempFilter); // Apply the temporary filter values
    triggerRefresh();
  };
  const resetFilters = () => {
    setTempFilter({
      dateTo: "",
      dateFrom: "",
      methodId: "",
    });
    setFilter({
      dateTo: "",
      dateFrom: "",
      methodId: "",
    });
    setFilterError("");
    setIsFiltered(false);
    triggerRefresh();
    setResetSearch((prev) => !prev);
  };
  return (
    <div className="flex">
      <div className="flex flex-col w-full">
        <div className="mx-10 flex justify-between">
          <button
            onClick={() => setMeasureType("weight")}
            className={`px-4 py-2 ${
              measureType === "weight"
                ? "text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            Weight
          </button>
          <button
            onClick={() => setMeasureType("upper")}
            className={`px-4 py-2 ${
              measureType === "upper"
                ? "text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            Upper
          </button>
          <button
            onClick={() => setMeasureType("lower")}
            className={`px-4 py-2 ${
              measureType === "lower"
                ? "text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            Lower
          </button>
        </div>
        <Table
          data={measures}
          columns={tableColumns}
          onClickAction={deleteMeasure}
        />
        <LinearRegression measures={measures} />
      </div>

      <RightSidebar>
        <div className="mb-3">
          <h3 className="text-lg font-bold mb-4">Filters</h3>
          <div className="flex flex-col space-y-4">
            <ValidatedInput
              inputProps={{
                type: "date",
                id: "dateFrom",
                name: "dateFrom",
                value: tempFilter.dateFrom,
                onChange: handleFilterChange,
              }}
              label="Date from"
            />
            <ValidatedInput
              inputProps={{
                type: "date",
                id: "dateTo",
                name: "dateTo",
                value: tempFilter.dateTo,
                onChange: handleFilterChange,
              }}
              label="Date to"
              error={filterError}
            />
            <SearchWithSuggestions
              fetchSuggestions={fetchMethodsSearch}
              callback={setMethod}
              searchName="Method"
              reset={resetSearch}
            />
            <button
              onClick={applyFilters}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              Reset Filters
            </button>
          </div>
        </div>
        <CreateMeasureForm
          triggerRefresh={triggerRefresh}
          measureType={measureType}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <ExportImport endpoint="/measures" triggerRefresh={triggerRefresh} />
      </RightSidebar>
    </div>
  );
};
