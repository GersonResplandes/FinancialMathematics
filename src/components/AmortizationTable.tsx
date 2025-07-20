import React from "react";
import { formatCurrency } from "../utils";
import type { AmortizationRow } from "../utils";

interface AmortizationTableProps {
  data: AmortizationRow[];
  system: "SAC" | "PRICE";
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({
  data,
  system,
}) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title mb-4">Tabela de Amortização - {system}</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Parcela</th>
                <th>Valor da Parcela</th>
                <th>Amortização</th>
                <th>Juros</th>
                <th>Saldo Devedor</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.installmentNumber}>
                  <td>{row.installmentNumber}</td>
                  <td>{formatCurrency(row.installmentValue)}</td>
                  <td>{formatCurrency(row.amortization)}</td>
                  <td>{formatCurrency(row.interest)}</td>
                  <td>{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AmortizationTable;
