import React from "react";
import { formatCurrency } from "../utils";
import type { AmortizationRow } from "../utils";

interface ComparisonTableProps {
  sacData: AmortizationRow[];
  priceData: AmortizationRow[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  sacData,
  priceData,
}) => {
  const maxLength = Math.max(sacData.length, priceData.length);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title mb-4">Comparação entre Sistemas</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th rowSpan={2}>Parcela</th>
                <th colSpan={2}>Valor da Parcela</th>
                <th colSpan={2}>Amortização</th>
                <th colSpan={2}>Juros</th>
                <th colSpan={2}>Saldo Devedor</th>
              </tr>
              <tr>
                <th>SAC</th>
                <th>PRICE</th>
                <th>SAC</th>
                <th>PRICE</th>
                <th>SAC</th>
                <th>PRICE</th>
                <th>SAC</th>
                <th>PRICE</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxLength }, (_, index) => {
                const sacRow = sacData[index];
                const priceRow = priceData[index];

                return (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td>
                      {sacRow ? formatCurrency(sacRow.installmentValue) : "-"}
                    </td>
                    <td>
                      {priceRow
                        ? formatCurrency(priceRow.installmentValue)
                        : "-"}
                    </td>
                    <td>
                      {sacRow ? formatCurrency(sacRow.amortization) : "-"}
                    </td>
                    <td>
                      {priceRow ? formatCurrency(priceRow.amortization) : "-"}
                    </td>
                    <td>{sacRow ? formatCurrency(sacRow.interest) : "-"}</td>
                    <td>
                      {priceRow ? formatCurrency(priceRow.interest) : "-"}
                    </td>
                    <td>{sacRow ? formatCurrency(sacRow.balance) : "-"}</td>
                    <td>{priceRow ? formatCurrency(priceRow.balance) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
