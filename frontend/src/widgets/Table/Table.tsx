import React from "react";

export interface TableData {
  id: string;
  [key: string]: React.ReactNode;
}

interface TableProps<T extends TableData> {
  data: T[];
  columns: { key: keyof T; label: string }[];
  onClickAction: (itemId: string) => void;
}

export const Table = <T extends TableData>({
  data,
  columns,
  onClickAction,
}: TableProps<T>) => {
  // Fill with placeholders to ensure at least 10 rows
  const rows: T[] = [...data];
  const placeholdersCount = Math.max(0, 10 - rows.length);

  for (let i = 0; i < placeholdersCount; i++) {
    const placeholder = columns.reduce(
      (acc, column) => ({
        ...acc,
        [column.key]: "No data", // Add empty values for all columns
      }),
      { id: `placeholder-${i}` } as T, // Ensure placeholder conforms to type T
    );
    rows.push(placeholder);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-sm font-medium text-gray-500"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {rows.map((row, index) => (
            <tr
              key={row.id}
              className={`cursor-pointer hover:bg-gray-50 ${
                row.id.startsWith("placeholder")
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              onClick={() =>
                !row.id.startsWith("placeholder") && onClickAction(row.id)
              }
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 text-gray-900"
                >
                  {row[column.key] !== undefined
                    ? String(row[column.key])
                    : "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
