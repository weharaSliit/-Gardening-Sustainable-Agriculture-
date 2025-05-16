import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const GardenLogsAnalysis = ({ calendarData }) => {
  const [categoryMonthlyData, setCategoryMonthlyData] = useState({});
  const [categoryYearlyData, setCategoryYearlyData] = useState({});

  useEffect(() => {
    const processMonthlyAndYearlyData = () => {
      const monthly = {};
      const yearly = {};
  
      calendarData.forEach((entry) => {
        const date = new Date(entry.startDate);
        const month = date.getMonth(); // 0-11
        const year = date.getFullYear();
        const category = entry.category || "Uncategorized";
  
        // Initialize category data if not already present
        if (!monthly[category]) {
          monthly[category] = Array(12).fill(0); // Initialize with 12 months
        }
        if (!yearly[category]) {
          yearly[category] = {};
        }
  
        // Add quantity to the respective month and category
        monthly[category][month] += entry.quantity;
  
        // Add quantity to the respective year and category
        yearly[category][year] = (yearly[category][year] || 0) + entry.quantity;
      });
  
      setCategoryMonthlyData(monthly);
  
      // Convert yearly data into a format suitable for charting
      const formattedYearlyData = Object.fromEntries(
        Object.entries(yearly).map(([category, data]) => [
          category,
          Object.keys(data).map((year) => ({
            year: parseInt(year, 10),
            quantity: data[year],
          })),
        ])
      );
  
      setCategoryYearlyData(formattedYearlyData);
    };
  
    processMonthlyAndYearlyData();
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
      data: labels.map((label) => {
        const entry = values.find((v) => v.year === label);
        return entry ? entry.quantity : 0;
      }),
      fill: false,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      tension: 0.4,
    }));
  };

  // Generate labels for yearly chart
  const yearlyLabels = Object.keys(categoryYearlyData).length
    ? [...new Set(Object.values(categoryYearlyData).flat().map((data) => data.year))]
    : [];

  // Generate datasets for yearly chart
  const yearlyDatasets = generateCategoryDatasets(categoryYearlyData, yearlyLabels);

  const monthlyChartData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    datasets: Object.entries(categoryMonthlyData).map(([category, data], index) => ({
      label: `${category} Contribution`,
      data: data, // Monthly data for the category
      fill: false,
      borderColor: `rgba(${index * 50}, ${index * 100}, ${index * 150}, 1)`,
      backgroundColor: `rgba(${index * 50}, ${index * 100}, ${index * 150}, 0.2)`,
      tension: 0.4,
    })),
  };
  const yearlyChartData = {
    labels: yearlyLabels,
    datasets: yearlyDatasets,
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