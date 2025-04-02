// Configuração do Chart.js
Chart.defaults.font.family = "Poppins, sans-serif";
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.backgroundColor = "rgba(0, 0, 0, 0.8)";
Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: "bold" };
Chart.defaults.plugins.tooltip.bodyFont = { size: 13 };

// Variáveis globais para os gráficos
let balanceChart = null;
let compositionChart = null;

// Elementos do DOM
const form = document.getElementById("amortizationForm");
const results = document.getElementById("results");
const tableBody = document.getElementById("amortizationTableBody");
const toggleTheme = document.getElementById("toggleTheme");
const exportCSV = document.getElementById("exportCSV");
const exportPDF = document.getElementById("exportPDF");

// Elementos dos inputs
const loanAmountInput = document.getElementById("loanAmount");
const interestRateInput = document.getElementById("interestRate");
const numberOfInstallmentsInput = document.getElementById(
  "numberOfInstallments"
);

// Configuração do tema escuro
const isDarkMode = localStorage.getItem("darkMode") === "true";
if (isDarkMode) {
  document.documentElement.setAttribute("data-bs-theme", "dark");
}

// Event Listeners
form.addEventListener("submit", handleSubmit);
toggleTheme.addEventListener("click", toggleDarkMode);
exportCSV.addEventListener("click", handleExportCSV);
exportPDF.addEventListener("click", handleExportPDF);

// Formatação automática dos inputs
loanAmountInput.addEventListener("input", formatCurrencyInput);
interestRateInput.addEventListener("input", formatPercentageInput);
numberOfInstallmentsInput.addEventListener("input", formatNumberInput);

// Função para formatar input de moeda
function formatCurrencyInput(e) {
  try {
    let value = e.target.value.replace(/\D/g, "");
    value = (parseInt(value) / 100).toFixed(2);
    e.target.value = window.utils.formatCurrency(value);
  } catch (error) {
    console.error("Erro ao formatar moeda:", error);
    e.target.value = window.utils.formatCurrency(0);
  }
}

// Função para formatar input de percentual
function formatPercentageInput(e) {
  try {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    value = (parseInt(value) / 100).toFixed(2);
    e.target.value = value + "%";
  } catch (error) {
    console.error("Erro ao formatar percentual:", error);
    e.target.value = "0,00%";
  }
}

// Função para formatar input de número
function formatNumberInput(e) {
  try {
    let value = e.target.value.replace(/\D/g, "");
    e.target.value = value;
  } catch (error) {
    console.error("Erro ao formatar número:", error);
    e.target.value = "";
  }
}

// Função para alternar o tema
function toggleDarkMode() {
  try {
    const isDark =
      document.documentElement.getAttribute("data-bs-theme") === "dark";
    document.documentElement.setAttribute(
      "data-bs-theme",
      isDark ? "light" : "dark"
    );
    localStorage.setItem("darkMode", !isDark);
  } catch (error) {
    console.error("Erro ao alternar tema:", error);
  }
}

// Função para manipular o envio do formulário
function handleSubmit(e) {
  e.preventDefault();

  try {
    // Remover formatação antes de processar os valores
    const loanAmount = parseFloat(
      loanAmountInput.value.replace(/[^\d,-]/g, "").replace(",", ".")
    );
    const interestRate = parseFloat(interestRateInput.value.replace("%", ""));
    const numberOfInstallments = parseInt(numberOfInstallmentsInput.value);
    const system = document.getElementById("amortizationSystem").value;
    const interestPeriod = document.getElementById("interestPeriod").value;
    const installmentPeriod =
      document.getElementById("installmentPeriod").value;

    // Validação dos inputs
    if (loanAmount <= 0 || interestRate <= 0 || numberOfInstallments <= 0) {
      alert("Por favor, preencha todos os campos com valores positivos.");
      return;
    }

    // Cálculo da amortização
    let data;
    if (system === "SAC") {
      data = window.utils.calculateSAC(
        loanAmount,
        interestRate,
        numberOfInstallments,
        interestPeriod,
        installmentPeriod
      );
    } else if (system === "PRICE") {
      data = window.utils.calculatePrice(
        loanAmount,
        interestRate,
        numberOfInstallments,
        interestPeriod,
        installmentPeriod
      );
    } else {
      // Para comparação, usamos os dados do SAC como base
      data = window.utils.calculateSAC(
        loanAmount,
        interestRate,
        numberOfInstallments,
        interestPeriod,
        installmentPeriod
      );
    }

    // Salvamento no histórico
    window.utils.saveToHistory(data, system);

    // Exibição dos resultados
    displayResults(data);
  } catch (error) {
    console.error("Erro ao processar formulário:", error);
    alert("Ocorreu um erro ao processar os dados. Por favor, tente novamente.");
  }
}

// Função para exibir os resultados
function displayResults(data) {
  try {
    const resultsDiv = document.getElementById("results");
    const comparisonTable = document.getElementById("comparisonTable");
    const amortizationTable = document.getElementById("amortizationTable");
    const amortizationTableBody = document.getElementById(
      "amortizationTableBody"
    );
    const comparisonTableBody = document.getElementById("comparisonTableBody");
    const system = document.getElementById("amortizationSystem").value;

    // Limpar resultados anteriores
    amortizationTableBody.innerHTML = "";
    comparisonTableBody.innerHTML = "";

    // Mostrar/ocultar tabelas baseado no sistema selecionado
    if (system === "COMPARE") {
      amortizationTable.classList.add("d-none");
      comparisonTable.classList.remove("d-none");
      displayComparisonTable(data);
    } else {
      amortizationTable.classList.remove("d-none");
      comparisonTable.classList.add("d-none");
      displaySingleSystemTable(data);
    }

    // Atualizar gráficos
    updateCharts(data);

    // Mostrar resultados
    resultsDiv.classList.remove("d-none");
    resultsDiv.classList.add("fade-in");
  } catch (error) {
    console.error("Erro ao exibir resultados:", error);
    alert(
      "Ocorreu um erro ao exibir os resultados. Por favor, tente novamente."
    );
  }
}

// Função para exibir tabela de sistema único
function displaySingleSystemTable(data) {
  try {
    const amortizationTableBody = document.getElementById(
      "amortizationTableBody"
    );

    data.forEach((row, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${window.utils.formatCurrency(row.installmentValue)}</td>
        <td>${window.utils.formatCurrency(row.amortization)}</td>
        <td>${window.utils.formatCurrency(row.interest)}</td>
        <td>${window.utils.formatCurrency(row.balance)}</td>
      `;
      amortizationTableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao exibir tabela única:", error);
    throw error;
  }
}

// Função para exibir tabela de comparação
function displayComparisonTable(data) {
  try {
    const comparisonTableBody = document.getElementById("comparisonTableBody");
    const loanAmount = parseFloat(
      document
        .getElementById("loanAmount")
        .value.replace(/[^\d,-]/g, "")
        .replace(",", ".")
    );
    const interestRate = parseFloat(
      document.getElementById("interestRate").value.replace("%", "")
    );
    const numberOfInstallments = parseInt(
      document.getElementById("numberOfInstallments").value
    );
    const interestPeriod = document.getElementById("interestPeriod").value;
    const installmentPeriod =
      document.getElementById("installmentPeriod").value;

    // Calcular dados do SAC
    const sacData = window.utils.calculateSAC(
      loanAmount,
      interestRate,
      numberOfInstallments,
      interestPeriod,
      installmentPeriod
    );

    // Calcular dados do PRICE
    const priceData = window.utils.calculatePrice(
      loanAmount,
      interestRate,
      numberOfInstallments,
      interestPeriod,
      installmentPeriod
    );

    // Criar tabela de comparação
    for (let i = 0; i < numberOfInstallments; i++) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${window.utils.formatCurrency(sacData[i].installmentValue)}</td>
        <td>${window.utils.formatCurrency(priceData[i].installmentValue)}</td>
        <td>${window.utils.formatCurrency(sacData[i].amortization)}</td>
        <td>${window.utils.formatCurrency(priceData[i].amortization)}</td>
        <td>${window.utils.formatCurrency(sacData[i].interest)}</td>
        <td>${window.utils.formatCurrency(priceData[i].interest)}</td>
        <td>${window.utils.formatCurrency(sacData[i].balance)}</td>
        <td>${window.utils.formatCurrency(priceData[i].balance)}</td>
      `;
      comparisonTableBody.appendChild(tr);
    }
  } catch (error) {
    console.error("Erro ao exibir tabela de comparação:", error);
    throw error;
  }
}

// Função para alternar o tipo de gráfico
function toggleChartType(chartId) {
  try {
    const chart = chartId === "balance" ? balanceChart : compositionChart;
    if (!chart) return;

    const currentType = chart.config.type;
    const newType = currentType === "line" ? "bar" : "line";

    chart.config.type = newType;
    chart.update();
  } catch (error) {
    console.error("Erro ao alternar tipo de gráfico:", error);
  }
}

// Função para atualizar os gráficos
function updateCharts(data) {
  try {
    const system = document.getElementById("amortizationSystem").value;
    const loanAmount = parseFloat(
      document
        .getElementById("loanAmount")
        .value.replace(/[^\d,-]/g, "")
        .replace(",", ".")
    );
    const interestRate = parseFloat(
      document.getElementById("interestRate").value.replace("%", "")
    );
    const numberOfInstallments = parseInt(
      document.getElementById("numberOfInstallments").value
    );
    const interestPeriod = document.getElementById("interestPeriod").value;
    const installmentPeriod =
      document.getElementById("installmentPeriod").value;

    // Destruir gráficos existentes
    if (balanceChart instanceof Chart) {
      balanceChart.destroy();
    }
    if (compositionChart instanceof Chart) {
      compositionChart.destroy();
    }

    // Preparar dados para os gráficos
    let labels = Array.from({ length: numberOfInstallments }, (_, i) => i + 1);

    if (system === "COMPARE") {
      const sacData = window.utils.calculateSAC(
        loanAmount,
        interestRate,
        numberOfInstallments,
        interestPeriod,
        installmentPeriod
      );
      const priceData = window.utils.calculatePrice(
        loanAmount,
        interestRate,
        numberOfInstallments,
        interestPeriod,
        installmentPeriod
      );

      // Gráfico de saldo devedor
      const balanceCtx = document
        .getElementById("balanceChart")
        .getContext("2d");
      balanceChart = new Chart(balanceCtx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "SAC",
              data: sacData.map((row) => row.balance),
              borderColor: "#28a745",
              backgroundColor: "rgba(40, 167, 69, 0.1)",
              fill: true,
              tension: 0.4,
              borderWidth: 2,
            },
            {
              label: "PRICE",
              data: priceData.map((row) => row.balance),
              borderColor: "#dc3545",
              backgroundColor: "rgba(220, 53, 69, 0.1)",
              fill: true,
              tension: 0.4,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Comparação do Saldo Devedor",
              font: {
                size: 16,
                weight: "bold",
              },
            },
            legend: {
              position: "top",
              labels: {
                padding: 20,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => window.utils.formatCurrency(value),
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });

      // Gráfico de composição
      const compositionCtx = document
        .getElementById("compositionChart")
        .getContext("2d");
      compositionChart = new Chart(compositionCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Amortização SAC",
              data: sacData.map((row) => row.amortization),
              backgroundColor: "rgba(40, 167, 69, 0.7)",
              borderColor: "#28a745",
              borderWidth: 1,
            },
            {
              label: "Juros SAC",
              data: sacData.map((row) => row.interest),
              backgroundColor: "rgba(40, 167, 69, 0.3)",
              borderColor: "#28a745",
              borderWidth: 1,
            },
            {
              label: "Amortização PRICE",
              data: priceData.map((row) => row.amortization),
              backgroundColor: "rgba(220, 53, 69, 0.7)",
              borderColor: "#dc3545",
              borderWidth: 1,
            },
            {
              label: "Juros PRICE",
              data: priceData.map((row) => row.interest),
              backgroundColor: "rgba(220, 53, 69, 0.3)",
              borderColor: "#dc3545",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Composição das Parcelas",
              font: {
                size: 16,
                weight: "bold",
              },
            },
            legend: {
              position: "top",
              labels: {
                padding: 20,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
              ticks: {
                callback: (value) => window.utils.formatCurrency(value),
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              stacked: true,
              grid: {
                display: false,
              },
            },
          },
        },
      });
    } else {
      // Gráfico de saldo devedor para sistema único
      const balanceCtx = document
        .getElementById("balanceChart")
        .getContext("2d");
      balanceChart = new Chart(balanceCtx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Saldo Devedor",
              data: data.map((row) => row.balance),
              borderColor: "#28a745",
              backgroundColor: "rgba(40, 167, 69, 0.1)",
              fill: true,
              tension: 0.4,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Evolução do Saldo Devedor",
              font: {
                size: 16,
                weight: "bold",
              },
            },
            legend: {
              position: "top",
              labels: {
                padding: 20,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => window.utils.formatCurrency(value),
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });

      // Gráfico de composição para sistema único
      const compositionCtx = document
        .getElementById("compositionChart")
        .getContext("2d");
      compositionChart = new Chart(compositionCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Amortização",
              data: data.map((row) => row.amortization),
              backgroundColor: "rgba(40, 167, 69, 0.7)",
              borderColor: "#28a745",
              borderWidth: 1,
            },
            {
              label: "Juros",
              data: data.map((row) => row.interest),
              backgroundColor: "rgba(40, 167, 69, 0.3)",
              borderColor: "#28a745",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Composição das Parcelas",
              font: {
                size: 16,
                weight: "bold",
              },
            },
            legend: {
              position: "top",
              labels: {
                padding: 20,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
              ticks: {
                callback: (value) => window.utils.formatCurrency(value),
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              stacked: true,
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("Erro ao atualizar gráficos:", error);
    alert(
      "Ocorreu um erro ao atualizar os gráficos. Por favor, tente novamente."
    );
  }
}

// Função para exportar CSV
function handleExportCSV() {
  try {
    const system = document.getElementById("amortizationSystem").value;
    const data = window.utils.getHistory().pop().data;
    window.utils.exportToCSV(data, system);
  } catch (error) {
    console.error("Erro ao exportar CSV:", error);
    alert(
      "Ocorreu um erro ao exportar o arquivo CSV. Por favor, tente novamente."
    );
  }
}

// Função para exportar PDF
function handleExportPDF() {
  try {
    const system = document.getElementById("amortizationSystem").value;
    const data = window.utils.getHistory().pop().data;
    window.utils.exportToPDF(data, system);
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
    alert(
      "Ocorreu um erro ao exportar o arquivo PDF. Por favor, tente novamente."
    );
  }
}
