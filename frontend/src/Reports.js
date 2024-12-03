import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

const Reports = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch insights data
    const fetchInsights = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/division/getInsights"
        ); // Adjust this to your actual endpoint
        console.log("hello: ", response.data.insights);
        setInsights(response.data.insights);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching insights:", error);
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return <div>Loading insights...</div>;
  }

  // Prepare labels for line graph (Issues Over Time)
  const lineGraphLabels = [
    ...new Set(
      insights.flatMap((division) => Object.keys(division.issuesOverTime))
    ),
  ];

  // Prepare data for line graph (Issues Over Time)
  const lineGraphData = {
    labels: lineGraphLabels,
    datasets: insights.map((division) => ({
      label: division.division,
      data: lineGraphLabels.map((date) => division.issuesOverTime[date] || 0),
      fill: false,
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 1)`, // Random color for each division
      tension: 0.1,
    })),
  };

  // Prepare data for bar chart (Priority Breakdown)
  const priorityBreakdown = insights.reduce((acc, division) => {
    Object.keys(division.priorityBreakdown).forEach((priority) => {
      acc[priority] =
        (acc[priority] || 0) + division.priorityBreakdown[priority];
    });
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(priorityBreakdown),
    datasets: [
      {
        label: "Priority Breakdown",
        data: Object.values(priorityBreakdown),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ], // Colors for low, medium, high
      },
    ],
  };

  // Prepare data for doughnut chart (Completed vs Pending Issues)
  const completedIssues = insights.reduce(
    (acc, division) => acc + division.completedIssues,
    0
  );
  const pendingIssues = insights.reduce(
    (acc, division) => acc + division.pendingIssues,
    0
  );

  const doughnutChartData = {
    labels: ["Completed Issues", "Pending Issues"],
    datasets: [
      {
        data: [completedIssues, pendingIssues],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"], // Colors for completed and pending
      },
    ],
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Insights Page
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {/* Line Graph */}
        <div style={{ width: "90%", maxWidth: "800px" }}>
          <h3>Issues Over Time</h3>
          <Line data={lineGraphData} />
        </div>

        {/* Bar Chart */}
        <div style={{ width: "45%", minWidth: "300px" }}>
          <h3>Priority Breakdown</h3>
          <Bar data={barChartData} />
        </div>

        {/* Doughnut Chart */}
        <div
          style={{
            width: "45%",
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Completed vs Pending Issues</h3>
          <Doughnut data={doughnutChartData} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
