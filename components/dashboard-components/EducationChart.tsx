"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Employee {
  pendidikan?: {
    name: string;
  };
}

export const EducationChart = () => {
  const [eduCounts, setEduCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/data/karyawan");
        const data: Employee[] = await res.json();

        const counts = data.reduce((acc: Record<string, number>, e) => {
          const edu = e.pendidikan?.name || "Unknown";
          acc[edu] = (acc[edu] || 0) + 1;
          return acc;
        }, {});

        setEduCounts(counts);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }
    };

    fetchEmployees();
  }, []);

  const labels = Object.keys(eduCounts);
  const values = Object.values(eduCounts);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Karyawan",
        data: values,
        backgroundColor: [
          "#0ea5e9",
          "#6366f1",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#a855f7",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div className="flex flex-col gap-2 items-center p-3 rounded-lg w-full border shadow">
      <h2 className="mb-4 text-center font-bold">Distribusi Pendidikan</h2>
      <div className="w-48 h-48">
        <Doughnut
          data={chartData}
          options={{
            cutout: "60%",
            plugins: {
              legend: {
                display: true,
                position: "bottom",
              },
            },
          }}
        />
      </div>
    </div>
  );
};
