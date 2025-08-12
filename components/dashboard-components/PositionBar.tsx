"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "@/lib/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Employee {
  jabatan: { name: string };
}

export const PositionBar = () => {
  const [positionCounts, setPositionCounts] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("karyawan");
      const data: Employee[] = await res.data;

      const counts: Record<string, number> = {};
      data.forEach((emp) => {
        const jabatan = emp.jabatan?.name || "Tidak Diketahui";
        counts[jabatan] = (counts[jabatan] || 0) + 1;
      });

      setPositionCounts(counts);
    };

    fetchData();
  }, []);

  const labels = Object.keys(positionCounts);
  const values = Object.values(positionCounts);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Karyawan",
        data: values,
        backgroundColor: "#17876E",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-2 items-center p-3 rounded-lg w-full border shadow">
      <h2 className="mb-4 text-center font-bold">Distribusi Jabatan</h2>
      <div className="h-48">
        <Bar
          data={chartData}
          options={{
            plugins: { legend: { display: false } },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                ticks: {
                  stepSize: 1,
                  callback: function (value) {
                    return Number.isInteger(value) ? value : "";
                  },
                },
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};
