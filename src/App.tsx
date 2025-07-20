import React, { useState } from "react";
import {
  calculateSAC,
  calculatePrice,
  calculateFinancialSummary,
  exportToCSV,
  exportToPDF,
  saveToHistory,
  parseCurrency,
  parsePercentage,
  formatCurrencyInput,
  formatPercentageInput,
  formatIntegerInput,
} from "./utils";
import type { AmortizationRow, FinancialSummary } from "./utils";
import AmortizationTable from "./components/AmortizationTable";
import ComparisonTable from "./components/ComparisonTable";
import FinancialCharts from "./components/FinancialCharts";
import FinancialSummaryCard from "./components/FinancialSummaryCard";

function App() {
  const [formData, setFormData] = useState({
    loanAmount: "",
    interestRate: "",
    numberOfInstallments: "",
    interestPeriod: "monthly" as "monthly" | "yearly",
    installmentPeriod: "monthly" as "monthly" | "yearly",
    amortizationSystem: "SAC" as "SAC" | "PRICE" | "COMPARE",
  });

  const [results, setResults] = useState<{
    sac: AmortizationRow[];
    price: AmortizationRow[];
    summary: FinancialSummary | null;
  }>({
    sac: [],
    price: [],
    summary: null,
  });

  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (
    field: string,
    value: string | "monthly" | "yearly"
  ) => {
    let formattedValue = value;

    // Aplicar formatação baseada no tipo de campo
    if (typeof value === "string") {
      switch (field) {
        case "loanAmount":
          formattedValue = formatCurrencyInput(value);
          break;
        case "interestRate":
          formattedValue = formatPercentageInput(value);
          break;
        case "numberOfInstallments":
          formattedValue = formatIntegerInput(value);
          break;
        default:
          formattedValue = value;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      const loanAmount = parseCurrency(formData.loanAmount);
      const interestRate = parsePercentage(formData.interestRate);
      const numberOfInstallments = parseInt(formData.numberOfInstallments) || 0;

      if (loanAmount <= 0 || interestRate <= 0 || numberOfInstallments <= 0) {
        alert("Por favor, preencha todos os campos com valores válidos.");
        setIsCalculating(false);
        return;
      }

      const sacResults = calculateSAC(
        loanAmount,
        interestRate,
        numberOfInstallments,
        formData.interestPeriod,
        formData.installmentPeriod
      );

      const priceResults = calculatePrice(
        loanAmount,
        interestRate,
        numberOfInstallments,
        formData.interestPeriod,
        formData.installmentPeriod
      );

      const summary = calculateFinancialSummary(
        formData.amortizationSystem === "SAC" ? sacResults : priceResults
      );

      setResults({
        sac: sacResults,
        price: priceResults,
        summary,
      });

      setShowResults(true);

      // Salvar no histórico
      if (formData.amortizationSystem === "SAC") {
        saveToHistory(sacResults, "SAC", summary);
      } else if (formData.amortizationSystem === "PRICE") {
        saveToHistory(priceResults, "PRICE", summary);
      }
    } catch (error) {
      console.error("Erro no cálculo:", error);
      alert("Erro ao calcular a amortização. Verifique os dados inseridos.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleExportCSV = () => {
    if (formData.amortizationSystem === "SAC") {
      exportToCSV(results.sac, "SAC");
    } else if (formData.amortizationSystem === "PRICE") {
      exportToCSV(results.price, "PRICE");
    }
  };

  const handleExportPDF = async () => {
    if (!results.summary) return;

    if (formData.amortizationSystem === "SAC") {
      await exportToPDF(results.sac, "SAC", results.summary);
    } else if (formData.amortizationSystem === "PRICE") {
      await exportToPDF(results.price, "PRICE", results.summary);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <a
            className="navbar-brand"
            href="#"
            aria-label="Calculadora de Amortização"
          >
            <i className="bi bi-calculator"></i>
            Calculadora de Matemática Financeira
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="btn btn-outline-light"
                  aria-label="Alternar tema"
                >
                  <i className="bi bi-moon-stars"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main>
        <div className="container py-5">
          <h1 className="display-4 text-center mb-5">
            Calculadora de Matemática Financeira
          </h1>

          {/* Formulário */}
          <div className="form-container">
            <h3 className="form-title">
              <i className="bi bi-calculator me-2"></i>
              Dados do Empréstimo
            </h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                {/* Valor do Empréstimo */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="loanAmount" className="form-label">
                      <i className="bi bi-currency-dollar me-1"></i>
                      Valor do Empréstimo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="loanAmount"
                      placeholder="0,00"
                      value={formData.loanAmount}
                      onChange={(e) =>
                        handleInputChange("loanAmount", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Taxa de Juros */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="interestRate" className="form-label">
                      <i className="bi bi-percent me-1"></i>
                      Taxa de Juros
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="interestRate"
                        placeholder="0,00%"
                        value={formData.interestRate}
                        onChange={(e) =>
                          handleInputChange("interestRate", e.target.value)
                        }
                        required
                      />
                      <select
                        className="form-select"
                        value={formData.interestPeriod}
                        onChange={(e) =>
                          handleInputChange(
                            "interestPeriod",
                            e.target.value as "monthly" | "yearly"
                          )
                        }
                        aria-label="Período da taxa de juros"
                      >
                        <option value="monthly">Mensal</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Número de Parcelas */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label
                      htmlFor="numberOfInstallments"
                      className="form-label"
                    >
                      <i className="bi bi-calendar-check me-1"></i>
                      Número de Parcelas
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="numberOfInstallments"
                        placeholder="0"
                        value={formData.numberOfInstallments}
                        onChange={(e) =>
                          handleInputChange(
                            "numberOfInstallments",
                            e.target.value
                          )
                        }
                        required
                      />
                      <select
                        className="form-select"
                        value={formData.installmentPeriod}
                        onChange={(e) =>
                          handleInputChange(
                            "installmentPeriod",
                            e.target.value as "monthly" | "yearly"
                          )
                        }
                        aria-label="Período das parcelas"
                      >
                        <option value="monthly">Mensal</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sistema de Amortização */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="amortizationSystem" className="form-label">
                      <i className="bi bi-gear me-1"></i>
                      Sistema de Amortização
                    </label>
                    <select
                      className="form-select"
                      id="amortizationSystem"
                      value={formData.amortizationSystem}
                      onChange={(e) =>
                        handleInputChange(
                          "amortizationSystem",
                          e.target.value as "SAC" | "PRICE" | "COMPARE"
                        )
                      }
                      required
                      aria-label="Sistema de amortização"
                    >
                      <option value="SAC">SAC</option>
                      <option value="PRICE">PRICE</option>
                      <option value="COMPARE">Comparar SAC e PRICE</option>
                    </select>
                  </div>
                </div>

                {/* Botões */}
                <div className="col-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Calculando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calculator me-2"></i>
                        Calcular
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Resultados */}
          {showResults && results.summary && (
            <div>
              {/* Resumo Financeiro */}
              <FinancialSummaryCard
                summary={results.summary}
                system={formData.amortizationSystem}
              />

              {/* Tabela de Amortização */}
              {formData.amortizationSystem !== "COMPARE" && (
                <AmortizationTable
                  data={
                    formData.amortizationSystem === "SAC"
                      ? results.sac
                      : results.price
                  }
                  system={formData.amortizationSystem}
                />
              )}

              {/* Tabela de Comparação */}
              {formData.amortizationSystem === "COMPARE" && (
                <ComparisonTable
                  sacData={results.sac}
                  priceData={results.price}
                />
              )}

              {/* Gráficos */}
              <FinancialCharts
                sacData={results.sac}
                priceData={results.price}
                system={formData.amortizationSystem}
              />

              {/* Botões de Exportação */}
              <div className="export-buttons">
                <button
                  className="btn btn-outline-success"
                  onClick={handleExportCSV}
                >
                  <i className="bi bi-file-earmark-excel me-2"></i>
                  Exportar CSV
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleExportPDF}
                >
                  <i className="bi bi-file-earmark-pdf me-2"></i>
                  Exportar PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="container text-center">
          <p className="mb-0">
            &copy; 2025 Calculadora de Matemática Financeira. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
