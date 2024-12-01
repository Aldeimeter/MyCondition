import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// Linear regression functions
const mean = (data: number[]) => {
  return data.reduce((acc, val) => acc + val, 0) / data.length;
};
const linearRegression = (x: number[], y: number[]) => {
  if (x.length !== y.length) {
    throw new Error("Input arrays must have the same length.");
  }

  const n = x.length;
  const xMean = mean(x);
  const yMean = mean(y);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    denominator += (x[i] - xMean) ** 2;
  }

  const m = numerator / denominator; // Slope
  const b = yMean - m * xMean; // Intercept

  return { m, b };
};
interface LinearRegressionProps {
  measures: {
    value: string;
    date: string;
  }[];
}
// React component
export const LinearRegression = ({ measures }: LinearRegressionProps) => {
  const [linearResult, setLinearResult] = useState<{
    slope: number;
    intercept: number;
  } | null>(null);

  useEffect(() => {
    const fetchWeights = () => {
      const measureData = measures
        .map((measure) => ({
          date: new Date(measure.date).getTime(), // Convert date to timestamp
          value: parseFloat(measure.value), // Ensure value is a number
        }))
        .sort((a, b) => a.date - b.date);

      // Prepare data for linear regression
      const x: number[] = [];
      const y: number[] = [];

      measureData.forEach((measure) => {
        const dateTimestamp = new Date(measure.date).getTime();
        x.push(dateTimestamp); // Use date as x-axis
        y.push(measure.value); // Use measure value as y-axis
      });

      // Perform linear regression
      const { m, b } = linearRegression(x, y);
      setLinearResult({ slope: m, intercept: b });
    };

    fetchWeights();
  }, [measures]);

  const sortedMeasures = [...measures].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  // Prepare data for Chart.js
  const chartData = {
    labels: sortedMeasures.map((measure) =>
      new Date(measure.date).toLocaleDateString(),
    ),
    datasets: [
      {
        label: "Weight Measurements",
        data: sortedMeasures.map((measure) => parseFloat(measure.value)),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        fill: true,
      },
      {
        label: "Linear Regression Line",
        data: linearResult
          ? sortedMeasures.map(
              (measure) =>
                linearResult.slope * new Date(measure.date).getTime() +
                linearResult.intercept,
            )
          : [],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div>
      {linearResult ? (
        <>
          <h2>Linear Regression Result</h2>
          <Line data={chartData} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
