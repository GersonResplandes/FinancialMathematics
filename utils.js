// Funções auxiliares para cálculos financeiros e manipulação de dados

// Formatação de valores monetários
const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Formatação de percentuais
const formatPercentage = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Conversão de taxa anual para mensal
const convertYearlyToMonthly = (yearlyRate) => {
  return (Math.pow(1 + yearlyRate / 100, 1 / 12) - 1) * 100;
};

// Conversão de taxa mensal para anual
const convertMonthlyToYearly = (monthlyRate) => {
  return (Math.pow(1 + monthlyRate / 100, 12) - 1) * 100;
};

// Cálculo do sistema SAC
const calculateSAC = (
  loanAmount,
  interestRate,
  numberOfInstallments,
  interestPeriod,
  installmentPeriod
) => {
  // Converter taxa de juros para mensal se for anual
  let monthlyRate = interestRate / 100;
  if (interestPeriod === "YEARLY") {
    monthlyRate = (1 + interestRate / 100) ** (1 / 12) - 1;
  }

  // Ajustar número de parcelas se for anual
  let totalInstallments = numberOfInstallments;
  if (installmentPeriod === "YEARLY") {
    totalInstallments = numberOfInstallments * 12;
  }

  const amortization = loanAmount / totalInstallments;
  const result = [];

  for (let i = 0; i < totalInstallments; i++) {
    const balance = loanAmount - amortization * i;
    const interest = balance * monthlyRate;
    const installmentValue = amortization + interest;

    result.push({
      installmentNumber: i + 1,
      installmentValue,
      amortization,
      interest,
      balance: Math.max(0, balance - amortization),
    });
  }

  return result;
};

// Cálculo do sistema Price
const calculatePrice = (
  loanAmount,
  interestRate,
  numberOfInstallments,
  interestPeriod,
  installmentPeriod
) => {
  // Converter taxa de juros para mensal se for anual
  let monthlyRate = interestRate / 100;
  if (interestPeriod === "YEARLY") {
    monthlyRate = (1 + interestRate / 100) ** (1 / 12) - 1;
  }

  // Ajustar número de parcelas se for anual
  let totalInstallments = numberOfInstallments;
  if (installmentPeriod === "YEARLY") {
    totalInstallments = numberOfInstallments * 12;
  }

  const result = [];
  let balance = loanAmount;

  // Calcular valor da parcela
  const installmentValue =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalInstallments)) /
    (Math.pow(1 + monthlyRate, totalInstallments) - 1);

  for (let i = 0; i < totalInstallments; i++) {
    const interest = balance * monthlyRate;
    const amortization = installmentValue - interest;
    balance = Math.max(0, balance - amortization);

    result.push({
      installmentNumber: i + 1,
      installmentValue,
      amortization,
      interest,
      balance,
    });
  }

  return result;
};

// Exportação para CSV
const exportToCSV = (data, system) => {
  const headers = [
    "Parcela",
    "Valor da Parcela",
    "Amortização",
    "Juros",
    "Saldo Devedor",
  ];
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        row.installmentNumber,
        row.installmentValue,
        row.amortization,
        row.interest,
        row.balance,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `amortizacao_${system}_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  link.click();
};

// Exportação para PDF
const exportToPDF = (data, system) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.text(`Tabela de Amortização - Sistema ${system}`, 20, 20);

  // Cabeçalho da tabela
  doc.setFontSize(12);
  const headers = ["Parcela", "Valor", "Amortização", "Juros", "Saldo"];
  let x = 20;
  headers.forEach((header) => {
    doc.text(header, x, 30);
    x += 35;
  });

  // Dados da tabela
  let y = 40;
  data.forEach((row) => {
    x = 20;
    doc.text(row.installmentNumber.toString(), x, y);
    doc.text(formatCurrency(row.installmentValue), x + 35, y);
    doc.text(formatCurrency(row.amortization), x + 70, y);
    doc.text(formatCurrency(row.interest), x + 105, y);
    doc.text(formatCurrency(row.balance), x + 140, y);
    y += 10;
  });

  // Download do PDF
  doc.save(
    `amortizacao_${system}_${new Date().toISOString().split("T")[0]}.pdf`
  );
};

// Armazenamento no localStorage
const saveToHistory = (data, system) => {
  const history = JSON.parse(
    localStorage.getItem("amortizationHistory") || "[]"
  );
  history.push({
    date: new Date().toISOString(),
    system,
    data,
  });
  localStorage.setItem("amortizationHistory", JSON.stringify(history));
};

// Recuperação do histórico
const getHistory = () => {
  return JSON.parse(localStorage.getItem("amortizationHistory") || "[]");
};

// Limpeza do histórico
const clearHistory = () => {
  localStorage.removeItem("amortizationHistory");
};

// Exportação das funções
window.utils = {
  formatCurrency,
  formatPercentage,
  convertYearlyToMonthly,
  convertMonthlyToYearly,
  calculateSAC,
  calculatePrice,
  exportToCSV,
  exportToPDF,
  saveToHistory,
  getHistory,
  clearHistory,
};
