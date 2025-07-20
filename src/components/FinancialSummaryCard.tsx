import React from "react";
import { formatCurrency } from "../utils";
import type { FinancialSummary } from "../utils";

interface FinancialSummaryCardProps {
  summary: FinancialSummary;
  system: "SAC" | "PRICE" | "COMPARE";
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  summary,
  system,
}) => {
  return (
    <div className="financial-summary">
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="summary-item">
            <div className="summary-value text-warning">
              {formatCurrency(summary.totalAmount)}
            </div>
            <div className="summary-label">Valor Total</div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="summary-item">
            <div className="summary-value text-danger">
              {formatCurrency(summary.totalInterest)}
            </div>
            <div className="summary-label">Total de Juros</div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="summary-item">
            <div className="summary-value text-success">
              {formatCurrency(summary.averageInstallment)}
            </div>
            <div className="summary-label">Parcela Média</div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="summary-item">
            <div className="summary-value text-info">
              {formatCurrency(summary.firstInstallment)}
            </div>
            <div className="summary-label">Primeira Parcela</div>
          </div>
        </div>
      </div>
      {system !== "COMPARE" && (
        <div className="row mt-3">
          <div className="col-12">
            <div className="alert alert-info mb-0">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Diferença entre primeira e última parcela:</strong>{" "}
              {formatCurrency(
                summary.firstInstallment - summary.lastInstallment
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialSummaryCard;
