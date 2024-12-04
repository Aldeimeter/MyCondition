import { fetchMethodsSearch } from "@/entities/method";
import { api } from "@/shared/api";
import {
  CreateMeasureForm,
  ExportImport,
  LinearRegression,
  MeasureTypes,
  MeasureType,
  Pagination,
  RightSidebar,
  SearchWithSuggestions,
  Table,
  TableData,
  ValidatedInput,
} from "@/widgets";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

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
  const [measureType, setMeasureType] = useState<MeasureType>("weight");
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
    <div className="flex gap-8 p-8 max-w-7xl mx-auto">
      <div className="flex-1 shadow-sm border rounded-lg">
        <MeasureTypes
          measureType={measureType}
          setMeasureType={setMeasureType}
        />
        <h2 className="pt-3 text-center text-2xl font-light mb-6">
          Click on row to delete measure
        </h2>
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
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="p-2 w-full bg-purple-700 text-white rounded-full hover:bg-purple-800"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-3 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                X
              </button>
            </div>
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
