// Função para calcular o valor das prestações no sistema SAC
function calcularSac() {
  const principal = parseFloat(document.getElementById("financiamento").value);
  const taxaAnual = parseFloat(document.getElementById("taxa_juros").value);
  const anos = parseInt(document.getElementById("prazo").value);

  const taxa = taxaAnual / 100;
  const amortizacao = principal / anos;
  let saldoDevedor = principal;
  let tabela = [];
  let meses = [];
  let amortizacaoValores = [];
  let jurosValores = [];
  let saldoDevedorValores = [];

  for (let periodo = 1; periodo <= anos; periodo++) {
    const juros = saldoDevedor * taxa;
    const prestacao = amortizacao + juros;
    saldoDevedor -= amortizacao;
    tabela.push([
      periodo,
      juros.toFixed(2),
      amortizacao.toFixed(2),
      prestacao.toFixed(2),
      saldoDevedor.toFixed(2),
    ]);

    // Adicionando dados para o gráfico
    meses.push(periodo);
    jurosValores.push(parseFloat(juros.toFixed(2)));
    amortizacaoValores.push(parseFloat(amortizacao.toFixed(2)));
    saldoDevedorValores.push(parseFloat(saldoDevedor.toFixed(2)));
  }

  mostrarTabela(tabela);
  mostrarGrafico(meses, jurosValores, amortizacaoValores, saldoDevedorValores);
  document.getElementById("resultado").textContent =
    "Tabela de Amortização (SAC) Calculada";
}

// Função para calcular a tabela das três primeiras prestações no sistema Price
function calcularPriceTabela() {
  const principal = parseFloat(document.getElementById("financiamento").value);
  const taxaMensal =
    parseFloat(document.getElementById("taxa_juros").value) / 12;
  const meses = 3;

  const taxa = taxaMensal / 100;
  const prestacao = (principal * taxa) / (1 - Math.pow(1 + taxa, -meses));
  let saldoDevedor = principal;
  let tabela = [];
  let mesesValores = [];
  let jurosValores = [];
  let amortizacaoValores = [];
  let saldoDevedorValores = [];

  for (let mes = 1; mes <= meses; mes++) {
    const juros = saldoDevedor * taxa;
    const amortizacao = prestacao - juros;
    saldoDevedor -= amortizacao;
    tabela.push([
      mes,
      juros.toFixed(2),
      amortizacao.toFixed(2),
      prestacao.toFixed(2),
      saldoDevedor.toFixed(2),
    ]);

    // Adicionando dados para o gráfico
    mesesValores.push(mes);
    jurosValores.push(parseFloat(juros.toFixed(2)));
    amortizacaoValores.push(parseFloat(amortizacao.toFixed(2)));
    saldoDevedorValores.push(parseFloat(saldoDevedor.toFixed(2)));
  }

  mostrarTabela(tabela);
  mostrarGrafico(
    mesesValores,
    jurosValores,
    amortizacaoValores,
    saldoDevedorValores
  );
  document.getElementById("resultado").textContent =
    "Tabela Price (3 primeiros meses) Calculada";
}

// Função para análise detalhada do sistema Price
function calcularPriceDetalhado() {
  const principal = parseFloat(document.getElementById("financiamento").value);
  const taxaMensal =
    parseFloat(document.getElementById("taxa_juros").value) / 12;
  const meses = parseInt(document.getElementById("prazo").value) * 12;

  const taxa = taxaMensal / 100;
  const prestacao = (principal * taxa) / (1 - Math.pow(1 + taxa, -meses));
  let saldoDevedor = principal;
  let totalJuros = 0;
  let tabela12Meses = [];
  let mesesValores = [];
  let jurosValores = [];
  let amortizacaoValores = [];
  let saldoDevedorValores = [];

  for (let mes = 1; mes <= meses; mes++) {
    const juros = saldoDevedor * taxa;
    const amortizacao = prestacao - juros;
    saldoDevedor -= amortizacao;
    totalJuros += juros;

    if (mes <= 12) {
      tabela12Meses.push([
        mes,
        prestacao.toFixed(2),
        juros.toFixed(2),
        amortizacao.toFixed(2),
        saldoDevedor.toFixed(2),
      ]);
    }

    // Adicionando dados para o gráfico
    mesesValores.push(mes);
    jurosValores.push(parseFloat(juros.toFixed(2)));
    amortizacaoValores.push(parseFloat(amortizacao.toFixed(2)));
    saldoDevedorValores.push(parseFloat(saldoDevedor.toFixed(2)));
  }

  mostrarTabela(tabela12Meses);
  mostrarGrafico(
    mesesValores,
    jurosValores,
    amortizacaoValores,
    saldoDevedorValores
  );
  document.getElementById(
    "resultado"
  ).textContent = `Preço da prestação: R$ ${prestacao.toFixed(
    2
  )} | Total de juros: R$ ${totalJuros.toFixed(2)}`;
}

// Função para mostrar a tabela no HTML
function mostrarTabela(tabela) {
  const tabelaHTML = tabela
    .map((linha) => {
      return `<tr>
                    <td>${linha[0]}</td>
                    <td>R$ ${linha[1]}</td>
                    <td>R$ ${linha[2]}</td>
                    <td>R$ ${linha[3]}</td>
                    <td>R$ ${linha[4]}</td>
                </tr>`;
    })
    .join("");

  document.getElementById("tabela").innerHTML = `<table>
        <tr>
            <th>Mês/Ano</th>
            <th>Juros</th>
            <th>Amortização</th>
            <th>Prestação</th>
            <th>Saldo Devedor</th>
        </tr>
        ${tabelaHTML}
    </table>`;
}

// Função para mostrar gráfico utilizando Chart.js
function mostrarGrafico(meses, juros, amortizacao, saldoDevedor) {
  const ctx = document.getElementById("grafico").getContext("2d");
  if (window.barChart) {
    window.barChart.destroy(); // Limpar gráfico anterior
  }
  window.barChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: meses,
      datasets: [
        {
          label: "Juros",
          data: juros,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
        {
          label: "Amortização",
          data: amortizacao,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
        {
          label: "Saldo Devedor",
          data: saldoDevedor,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
    },
  });
}
