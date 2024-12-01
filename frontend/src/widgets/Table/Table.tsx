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
  return (
    <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={String(column.key)}
              className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-600"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={row.id}
            className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            onClick={() => onClickAction(row.id)}
          >
            {columns.map((column) => (
              <td
                key={String(column.key)}
                className="border border-gray-300 px-4 py-2 text-gray-700"
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
  );
};
