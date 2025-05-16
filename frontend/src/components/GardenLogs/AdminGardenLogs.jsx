import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import Nav from "../MainComponents/Nav";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

const AdminGardenLogs = () => {
  const [analytics, setAnalytics] = useState([]); // For garden log analytics
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosClient.get("/admin/admin-garden-logs");
        setAnalytics(response.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to fetch analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Group data by month and category
  const groupedData = analytics.reduce((acc, item) => {
    if (!acc[item.month]) {
      acc[item.month] = {};
    }
    if (!acc[item.month][item.category]) {
      acc[item.month][item.category] = 0;
    }
    acc[item.month][item.category] += item.logs;
    return acc;
  }, {});

  // Extract unique categories
  const categories = [...new Set(analytics.map((item) => item.category))];

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(groupedData), // Months
    datasets: categories.map((category) => ({
      type: "bar",
      label: category,
      data: Object.keys(groupedData).map((month) => groupedData[month][category] || 0),
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, 0.6)`,
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, 1)`,
      borderWidth: 1,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Garden Logs by Category",
      },
    },
    scales: {
      x: {
        stacked: true, // Stack bars for each month
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div>
      <Nav /> {/* Navigation Bar */}
      <h2 className="text-xl font-semibold mb-4">Admin Garden Logs</h2>

      {/* Combined Chart */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Category Summary Table */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Category Summary</h3>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Month</th>
              {categories.map((category) => (
                <th key={category} className="py-2 px-4 border-b">
                  {category}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).map((month) => (
              <tr key={month}>
                <td className="py-2 px-4 border-b">{month}</td>
                {categories.map((category) => (
                  <td key={category} className="py-2 px-4 border-b">
                    {groupedData[month][category] || 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGardenLogs;