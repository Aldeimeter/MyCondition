import { Dispatch, SetStateAction } from "react";

export type MeasureType = "weight" | "upper" | "lower";
interface Props {
  measureType: string;
  setMeasureType: Dispatch<SetStateAction<MeasureType>>;
}
export const MeasureTypes = ({ measureType, setMeasureType }: Props) => {
  return (
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
  );
};
