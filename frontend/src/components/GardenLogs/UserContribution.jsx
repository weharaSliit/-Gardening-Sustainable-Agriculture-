import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../MainComponents/Nav";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const UserContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/garden-calendar/user-contributions")
      .then((response) => setContributions(response.data))
      .catch((error) => {
        console.error("Error fetching contributions:", error);
        setError("Failed to load contributions. Please try again later.");
      });
  }, []);

  // Calculate total quantity
  const totalQuantity = contributions.reduce(
    (sum, contribution) => sum + contribution.totalQuantity,
    0
  );

  // Prepare data for the pie chart
  const pieData = contributions.map((contribution) => ({
    name: `${contribution.userId}`,
    value: contribution.totalQuantity,
  }));

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Navigation Bar */}
      <Nav />
      <br />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-green-800 mb-6 text-center">
          User Contributions
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          A detailed summary of user contributions to sustainable agriculture.
        </p>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="flex flex-col lg:flex-row lg:space-x-8 items-start">
            {/* Table Section */}
            <div className="flex-1 overflow-x-auto shadow-lg rounded-lg border border-gray-200 mb-8 lg:mb-0">
              <table className="min-w-full bg-white rounded-lg">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <th className="p-4 text-left">User ID</th>
                    <th className="p-4 text-left">Total Quantity</th>
                    <th className="p-4 text-left">Entries</th>
                    <th className="p-4 text-left">Contribution (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((contribution, index) => {
                    const percentage =
                      totalQuantity > 0
                        ? (contribution.totalQuantity / totalQuantity) * 100
                        : 0;
                    return (
                      <tr
                        key={index}
                        className={`border-b ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="p-4 text-gray-800">
                          {contribution.userId}
                        </td>
                        <td className="p-4 text-gray-800">
                          {contribution.totalQuantity}
                        </td>
                        <td className="p-4 text-gray-800">
                          {contribution.entries}
                        </td>
                        <td className="p-4 text-green-600 font-semibold">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-green-600 h-4 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="ml-2">
                              {percentage.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td className="p-4">Total</td>
                    <td className="p-4">{totalQuantity}</td>
                    <td className="p-4">-</td>
                    <td className="p-4 text-green-600">100.00%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserContributions;