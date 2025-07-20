// Funções auxiliares para cálculos financeiros e manipulação de dados

// Formatação de valores monetários
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Formatação de percentuais
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Formatação de input de moeda (formata enquanto digita)
export const formatCurrencyInput = (value: string): string => {
  // Remove tudo exceto números
  const numericValue = value.replace(/\D/g, "");

  if (numericValue === "") return "";

  // Converte para número e divide por 100 para considerar centavos
  const numberValue = parseFloat(numericValue) / 100;

  // Formata como moeda
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

// Formatação de input de percentual (formata enquanto digita)
export const formatPercentageInput = (value: string): string => {
  // Remove tudo exceto números e vírgula
  const numericValue = value.replace(/[^\d,]/g, "");

  if (numericValue === "") return "";

  // Substitui vírgula por ponto para conversão
  const normalizedValue = numericValue.replace(",", ".");

  // Converte para número
  const numberValue = parseFloat(normalizedValue);

  if (isNaN(numberValue)) return "";

  // Formata como percentual
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(numberValue / 100);
};

// Formatação de input de número inteiro
export const formatIntegerInput = (value: string): string => {
  // Remove tudo exceto números
  const numericValue = value.replace(/\D/g, "");

  if (numericValue === "") return "";

  // Converte para número
  const numberValue = parseInt(numericValue);

  if (isNaN(numberValue)) return "";

  // Formata com separadores de milhares
  return new Intl.NumberFormat("pt-BR").format(numberValue);
};

// Conversão de taxa anual para mensal
export const convertYearlyToMonthly = (yearlyRate: number): number => {
  return (Math.pow(1 + yearlyRate / 100, 1 / 12) - 1) * 100;
};

// Conversão de taxa mensal para anual
export const convertMonthlyToYearly = (monthlyRate: number): number => {
  return (Math.pow(1 + monthlyRate / 100, 12) - 1) * 100;
};

// Tipos para amortização
export interface AmortizationRow {
  installmentNumber: number;
  installmentValue: number;
  amortization: number;
  interest: number;
  balance: number;
}

export interface FinancialSummary {
  totalInterest: number;
  totalAmount: number;
  averageInstallment: number;
  firstInstallment: number;
  lastInstallment: number;
}

// Cálculo do sistema SAC
export const calculateSAC = (
  loanAmount: number,
  interestRate: number,
  numberOfInstallments: number,
  interestPeriod: "monthly" | "yearly",
  installmentPeriod: "monthly" | "yearly"
): AmortizationRow[] => {
  let monthlyRate = interestRate / 100;
  if (interestPeriod === "yearly") {
    monthlyRate = (1 + interestRate / 100) ** (1 / 12) - 1;
  }
  let totalInstallments = numberOfInstallments;
  if (installmentPeriod === "yearly") {
    totalInstallments = numberOfInstallments * 12;
  }
  const amortization = loanAmount / totalInstallments;
  const result: AmortizationRow[] = [];
  let balance = loanAmount;

  for (let i = 0; i < totalInstallments; i++) {
    const interest = balance * monthlyRate;
    const installmentValue = amortization + interest;
    result.push({
      installmentNumber: i + 1,
      installmentValue,
      amortization,
      interest,
      balance: Math.max(0, balance - amortization),
    });
    balance = Math.max(0, balance - amortization);
  }
  return result;
};

// Cálculo do sistema Price
export const calculatePrice = (
  loanAmount: number,
  interestRate: number,
  numberOfInstallments: number,
  interestPeriod: "monthly" | "yearly",
  installmentPeriod: "monthly" | "yearly"
): AmortizationRow[] => {
  let monthlyRate = interestRate / 100;
  if (interestPeriod === "yearly") {
    monthlyRate = (1 + interestRate / 100) ** (1 / 12) - 1;
  }
  let totalInstallments = numberOfInstallments;
  if (installmentPeriod === "yearly") {
    totalInstallments = numberOfInstallments * 12;
  }

  const installmentValue =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalInstallments)) /
    (Math.pow(1 + monthlyRate, totalInstallments) - 1);

  const result: AmortizationRow[] = [];
  let balance = loanAmount;

  for (let i = 0; i < totalInstallments; i++) {
    const interest = balance * monthlyRate;
    const amortization = installmentValue - interest;
    result.push({
      installmentNumber: i + 1,
      installmentValue,
      amortization,
      interest,
      balance: Math.max(0, balance - amortization),
    });
    balance = Math.max(0, balance - amortization);
  }
  return result;
};

// Cálculo de juros compostos
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  time: number,
  frequency: "monthly" | "yearly" = "yearly"
): number => {
  const periodsPerYear = frequency === "monthly" ? 12 : 1;
  const ratePerPeriod = rate / (100 * periodsPerYear);
  const totalPeriods = time * periodsPerYear;
  return principal * Math.pow(1 + ratePerPeriod, totalPeriods);
};

// Cálculo de valor presente
export const calculatePresentValue = (
  futureValue: number,
  rate: number,
  time: number,
  frequency: "monthly" | "yearly" = "yearly"
): number => {
  const periodsPerYear = frequency === "monthly" ? 12 : 1;
  const ratePerPeriod = rate / (100 * periodsPerYear);
  const totalPeriods = time * periodsPerYear;
  return futureValue / Math.pow(1 + ratePerPeriod, totalPeriods);
};

// Cálculo de valor futuro
export const calculateFutureValue = (
  presentValue: number,
  rate: number,
  time: number,
  frequency: "monthly" | "yearly" = "yearly"
): number => {
  const periodsPerYear = frequency === "monthly" ? 12 : 1;
  const ratePerPeriod = rate / (100 * periodsPerYear);
  const totalPeriods = time * periodsPerYear;
  return presentValue * Math.pow(1 + ratePerPeriod, totalPeriods);
};

// Cálculo de TIR (Taxa Interna de Retorno)
export const calculateIRR = (cashFlows: number[]): number => {
  const tolerance = 0.0001;
  const maxIterations = 100;
  let guess = 0.1;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      const factor = Math.pow(1 + guess, j);
      npv += cashFlows[j] / factor;
      if (j > 0) {
        derivative -= (j * cashFlows[j]) / (factor * (1 + guess));
      }
    }

    const newGuess = guess - npv / derivative;
    if (Math.abs(newGuess - guess) < tolerance) {
      return newGuess * 100;
    }
    guess = newGuess;
  }

  return NaN;
};

// Cálculo de resumo financeiro
export const calculateFinancialSummary = (
  data: AmortizationRow[]
): FinancialSummary => {
  const totalInterest = data.reduce((sum, row) => sum + row.interest, 0);
  const totalAmount = data.reduce((sum, row) => sum + row.installmentValue, 0);
  const averageInstallment = totalAmount / data.length;
  const firstInstallment = data[0]?.installmentValue || 0;
  const lastInstallment = data[data.length - 1]?.installmentValue || 0;

  return {
    totalInterest,
    totalAmount,
    averageInstallment,
    firstInstallment,
    lastInstallment,
  };
};

// Exportação para CSV
export const exportToCSV = (data: AmortizationRow[], system: string) => {
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
        formatCurrency(row.installmentValue),
        formatCurrency(row.amortization),
        formatCurrency(row.interest),
        formatCurrency(row.balance),
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
export const exportToPDF = async (
  data: AmortizationRow[],
  system: string,
  summary: FinancialSummary
) => {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.text(`Tabela de Amortização - ${system}`, 20, 20);

  // Resumo
  doc.setFontSize(12);
  doc.text(`Total de Juros: ${formatCurrency(summary.totalInterest)}`, 20, 40);
  doc.text(`Valor Total: ${formatCurrency(summary.totalAmount)}`, 20, 50);
  doc.text(
    `Parcela Média: ${formatCurrency(summary.averageInstallment)}`,
    20,
    60
  );

  // Tabela
  const tableData = data.map((row) => [
    row.installmentNumber,
    formatCurrency(row.installmentValue),
    formatCurrency(row.amortization),
    formatCurrency(row.interest),
    formatCurrency(row.balance),
  ]);

  autoTable(doc, {
    head: [
      ["Parcela", "Valor da Parcela", "Amortização", "Juros", "Saldo Devedor"],
    ],
    body: tableData,
    startY: 80,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  });

  doc.save(
    `amortizacao_${system}_${new Date().toISOString().split("T")[0]}.pdf`
  );
};

// Armazenamento no localStorage
export const saveToHistory = (
  data: AmortizationRow[],
  system: string,
  summary: FinancialSummary
) => {
  const history = JSON.parse(
    localStorage.getItem("amortizationHistory") || "[]"
  );
  history.push({
    date: new Date().toISOString(),
    system,
    data,
    summary,
  });
  localStorage.setItem("amortizationHistory", JSON.stringify(history));
};

export const getHistory = () => {
  return JSON.parse(localStorage.getItem("amortizationHistory") || "[]");
};

// Validação de entrada
export const validateInput = (value: string): number => {
  const num = parseFloat(value.replace(/[^\d,.-]/g, "").replace(",", "."));
  return isNaN(num) ? 0 : num;
};

// Conversão de string para número
export const parseCurrency = (value: string): number => {
  return validateInput(value);
};

// Conversão de string para percentual
export const parsePercentage = (value: string): number => {
  return validateInput(value);
};
