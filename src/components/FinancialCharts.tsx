import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import type { AmortizationRow } from "../utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FinancialChartsProps {
  sacData: AmortizationRow[];
  priceData: AmortizationRow[];
  system: "SAC" | "PRICE" | "COMPARE";
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({
  sacData,
  priceData,
  system,
}) => {
  // Cores da paleta profissional
  const colors = {
    primary: "#1e40af",
    primaryLight: "#3b82f6",
    success: "#059669",
    successLight: "#10b981",
    danger: "#dc2626",
    dangerLight: "#ef4444",
    neutral: "#6b7280",
    neutralLight: "#9ca3af",
  };

  // Dados para gráfico de saldo devedor
  const balanceChartData = {
    labels: sacData.map((_, index) => `Parcela ${index + 1}`),
    datasets: [
      {
        label: "SAC",
        data: sacData.map((row) => row.balance),
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
      },
      {
        label: "PRICE",
        data: priceData.map((row) => row.balance),
        borderColor: colors.success,
        backgroundColor: `${colors.success}20`,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  // Dados para gráfico de valor das parcelas
  const installmentChartData = {
    labels: sacData.map((_, index) => `Parcela ${index + 1}`),
    datasets: [
      {
        label: "SAC",
        data: sacData.map((row) => row.installmentValue),
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "PRICE",
        data: priceData.map((row) => row.installmentValue),
        borderColor: colors.success,
        backgroundColor: colors.success,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  // Dados para gráfico de composição (apenas para SAC ou PRICE)
  const getCompositionData = (data: AmortizationRow[]) => {
    const totalAmortization = data.reduce(
      (sum, row) => sum + row.amortization,
      0
    );
    const totalInterest = data.reduce((sum, row) => sum + row.interest, 0);

    return {
      labels: ["Amortização", "Juros"],
      datasets: [
        {
          data: [totalAmortization, totalInterest],
          backgroundColor: [colors.primary, colors.danger],
          borderColor: [colors.primary, colors.danger],
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  };

  // Dados para gráfico de juros vs amortização
  const getInterestVsAmortizationData = (data: AmortizationRow[]) => {
    return {
      labels: data.map((_, index) => `Parcela ${index + 1}`),
      datasets: [
        {
          label: "Juros",
          data: data.map((row) => row.interest),
          backgroundColor: colors.danger,
          borderColor: colors.danger,
          borderWidth: 1,
        },
        {
          label: "Amortização",
          data: data.map((row) => row.amortization),
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "Inter",
          },
        },
      },
      title: {
        display: true,
        text: "Evolução do Saldo Devedor",
        font: {
          size: 16,
          family: "Inter",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
        color: "#374151",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: colors.primary,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value: any) {
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            }).format(value);
          },
          font: {
            size: 11,
            family: "Inter",
          },
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
            family: "Inter",
          },
        },
      },
    },
  };

  const installmentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "Inter",
          },
        },
      },
      title: {
        display: true,
        text: "Valor das Parcelas",
        font: {
          size: 16,
          family: "Inter",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
        color: "#374151",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: colors.primary,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value: any) {
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            }).format(value);
          },
          font: {
            size: 11,
            family: "Inter",
          },
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
            family: "Inter",
          },
        },
      },
    },
  };

  const compositionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "Inter",
          },
        },
      },
      title: {
        display: true,
        text: "Composição do Financiamento",
        font: {
          size: 16,
          family: "Inter",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
        color: "#374151",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: colors.primary,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "Inter",
          },
        },
      },
      title: {
        display: true,
        text: "Juros vs Amortização",
        font: {
          size: 16,
          family: "Inter",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
        color: "#374151",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: colors.primary,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value: any) {
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            }).format(value);
          },
          font: {
            size: 11,
            family: "Inter",
          },
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
            family: "Inter",
          },
        },
      },
    },
  };

  return (
    <div className="charts-container">
      <div className="row g-4">
        {/* Gráfico de Saldo Devedor */}
        <div className="col-lg-6">
          <div className="chart-card">
            <div style={{ height: "300px" }}>
              <Line data={balanceChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Gráfico de Valor das Parcelas */}
        <div className="col-lg-6">
          <div className="chart-card">
            <div style={{ height: "300px" }}>
              <Line
                data={installmentChartData}
                options={installmentChartOptions}
              />
            </div>
          </div>
        </div>

        {/* Gráfico de Composição */}
        {system !== "COMPARE" && (
          <div className="col-lg-6">
            <div className="chart-card">
              <div style={{ height: "300px" }}>
                <Doughnut
                  data={getCompositionData(
                    system === "SAC" ? sacData : priceData
                  )}
                  options={compositionChartOptions}
                />
              </div>
            </div>
          </div>
        )}

        {/* Gráfico de Juros vs Amortização */}
        {system !== "COMPARE" && (
          <div className="col-lg-6">
            <div className="chart-card">
              <div style={{ height: "300px" }}>
                <Bar
                  data={getInterestVsAmortizationData(
                    system === "SAC" ? sacData : priceData
                  )}
                  options={barChartOptions}
                />
              </div>
            </div>
          </div>
        )}

        {/* Gráficos de Comparação */}
        {system === "COMPARE" && (
          <>
            <div className="col-lg-6">
              <div className="chart-card">
                <div style={{ height: "300px" }}>
                  <Doughnut
                    data={getCompositionData(sacData)}
                    options={{
                      ...compositionChartOptions,
                      plugins: {
                        ...compositionChartOptions.plugins,
                        title: {
                          ...compositionChartOptions.plugins.title,
                          text: "Composição SAC",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="chart-card">
                <div style={{ height: "300px" }}>
                  <Doughnut
                    data={getCompositionData(priceData)}
                    options={{
                      ...compositionChartOptions,
                      plugins: {
                        ...compositionChartOptions.plugins,
                        title: {
                          ...compositionChartOptions.plugins.title,
                          text: "Composição PRICE",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialCharts;
