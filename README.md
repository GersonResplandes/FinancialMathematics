# 🧮 Calculadora de Matemática Financeira

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?color=00BFFF&size=30&center=true&vCenter=true&width=900&lines=Calculadora+Financeira+com+React+e+TypeScript;Sistemas+SAC+e+PRICE+com+Gráficos+Interativos;Exportação+de+Dados+e+Interface+Responsiva"/>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white"/>
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
</div>

---

## 🚀 Funcionalidades

### 📊 Cálculos Financeiros

- **Sistema SAC (Sistema de Amortização Constante)**
- **Sistema PRICE (Sistema Francês)**
- **Comparação entre sistemas**
- **Cálculo de juros compostos**
- **Valor presente e futuro**
- **Taxa Interna de Retorno (TIR)**

### 📈 Visualizações

- Gráficos interativos de evolução do saldo devedor
- Comparação de valores de parcelas
- Composição de amortização vs juros
- Gráficos de barras para comparação de sistemas

### 💾 Exportação

- Exportação para CSV
- Exportação para PDF
- Histórico de cálculos no localStorage

### 🎨 Interface

- Design responsivo com Bootstrap 5
- Tema escuro/claro
- Formulários intuitivos
- Tabelas detalhadas de amortização

---

## 🛠️ Tecnologias Utilizadas

<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white"/>
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/jsPDF-000000?style=for-the-badge&logo=javascript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
</div>

---

## 📦 Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta do projeto
cd FinancialMathematics

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

---

## 🎯 Como Usar

### 1. **Preencha os dados do empréstimo:**
   - Valor do empréstimo
   - Taxa de juros (mensal ou anual)
   - Número de parcelas
   - Período das parcelas

### 2. **Escolha o sistema de amortização:**
   - SAC: Parcelas decrescentes
   - PRICE: Parcelas fixas
   - Comparar: Análise de ambos os sistemas

### 3. **Visualize os resultados:**
   - Tabela detalhada de amortização
   - Resumo financeiro
   - Gráficos interativos
   - Comparações visuais

### 4. **Exporte os dados:**
   - CSV para análise em Excel
   - PDF para documentação

---

## 📋 Estrutura do Projeto

```text
src/
├── components/
│   ├── AmortizationTable.tsx    # Tabela de amortização
│   ├── ComparisonTable.tsx       # Comparação SAC vs PRICE
│   ├── FinancialCharts.tsx       # Gráficos interativos
│   └── FinancialSummaryCard.tsx  # Resumo financeiro
├── utils.ts                      # Funções de cálculo
├── App.tsx                       # Componente principal
└── main.tsx                      # Ponto de entrada
```

---

## 🧮 Fórmulas Implementadas

### Sistema SAC

```
Amortização = Valor do Empréstimo / Número de Parcelas
Juros = Saldo Devedor × Taxa de Juros
Parcela = Amortização + Juros
```

### Sistema PRICE

```
Parcela = PV × i × (1 + i)^n / ((1 + i)^n - 1)
Onde:
- PV = Valor Presente
- i = Taxa de juros por período
- n = Número de períodos
```

### Juros Compostos

```
FV = PV × (1 + r)^n
Onde:
- FV = Valor Futuro
- PV = Valor Presente
- r = Taxa de juros
- n = Número de períodos
```

---

## 🎨 Personalização

O projeto utiliza Bootstrap 5 e pode ser facilmente personalizado:

- **Cores:** Modifique as variáveis CSS do Bootstrap
- **Layout:** Ajuste os componentes React
- **Gráficos:** Personalize as opções do Chart.js
- **Exportação:** Configure os templates de PDF

---

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

---

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Visualiza o build de produção
npm run lint     # Executa o linter
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=footer&animation=fadeIn"/>
  <sub>Desenvolvido com ❤️ para facilitar cálculos financeiros</sub>
</div>
