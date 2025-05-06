import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const GardenLogsAnalysis = ({ calendarData }) => {
  const [categoryMonthlyData, setCategoryMonthlyData] = useState({});
  const [categoryYearlyData, setCategoryYearlyData] = useState({});

  useEffect(() => {
    // Process data for category-wise monthly and yearly analysis
    const processAnalysisData = () => {
      const monthly = {};
      const yearly = {};

      calendarData.forEach((entry) => {
        const startDate = new Date(entry.startDate);
        const month = startDate.getMonth(); // 0-11
        const year = startDate.getFullYear();
        const category = entry.category || "Uncategorized";

        // Convert quantity to grams if it's in kilograms
        const quantityInGrams = entry.unit === "kg" ? entry.quantity * 1000 : entry.quantity;

        // Initialize category data if not already present
        if (!monthly[category]) {
          monthly[category] = Array(12).fill(0);
        }
        if (!yearly[category]) {
          yearly[category] = {};
        }

        // Add data to the respective category
        monthly[category][month] += quantityInGrams;
        yearly[category][year] = (yearly[category][year] || 0) + quantityInGrams;
      });

      setCategoryMonthlyData(monthly);
      setCategoryYearlyData(
        Object.fromEntries(
          Object.entries(yearly).map(([category, data]) => [
            category,
            Object.entries(data).map(([year, quantity]) => ({ year, quantity })),
          ])
        )
      );
    };

    processAnalysisData();
  }, [calendarData]);

  const generateCategoryDatasets = (data, labels) => {
    const colors = [
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
    ];

    return Object.entries(data).map(([category, values], index) => ({
      label: `${category} Contribution (grams)`,
      data: labels.map((_, i) => values[i] || 0),
      fill: false,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      tension: 0.4,
    }));
  };

  const monthlyChartData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    datasets: generateCategoryDatasets(categoryMonthlyData, Array(12).fill(0)),
  };

  const yearlyChartData = {
    labels: Object.keys(categoryYearlyData).length
      ? Object.values(categoryYearlyData)[0].map((data) => data.year)
      : [],
    datasets: Object.entries(categoryYearlyData).map(([category, data], index) => ({
      label: `${category} Contribution (grams)`,
      data: data.map((entry) => entry.quantity),
      fill: false,
      borderColor: `rgba(${index * 50}, ${index * 100}, ${index * 150}, 1)`,
      backgroundColor: `rgba(${index * 50}, ${index * 100}, ${index * 150}, 0.2)`,
      tension: 0.4,
    })),
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Garden Logs Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Monthly Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Monthly Contribution (Category-wise)</h3>
          <div className="w-7/8 h-7/8">
            <Line
              key={JSON.stringify(categoryMonthlyData)} // Add a unique key to force re-render
              data={monthlyChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Yearly Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Yearly Contribution (Category-wise)</h3>
          <div className="w-7/8 h-7/8">
            <Line
              key={JSON.stringify(categoryYearlyData)} // Add a unique key to force re-render
              data={yearlyChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenLogsAnalysis;