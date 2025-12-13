const formEl = document.querySelector("form");
const transactionDescEl = document.querySelector("#transaction-desc");
const transactionAmountEl = document.querySelector("#transaction-amount");
const transactionListEl = document.querySelector(".transaction-list");

const balanceAmountEl = document.querySelector("#balance-amount");
const incomeAmountEl = document.querySelector(".income-amount");
const expenseAmountEl = document.querySelector(".expense-amount");

// Transactions
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Initial render
render();

formEl.addEventListener("submit", addTransaction);
transactionListEl.addEventListener("click", handleDelete);

// Add transactions
function addTransaction(e) {
  e.preventDefault();

  const description = transactionDescEl.value.trim();
  const amount = Number(transactionAmountEl.value);

  if (!description) {
    alert("Please enter a valid description!");
    return;
  }

  if (isNaN(amount) || amount === 0) {
    alert("Amount must be a number and cannot be zero!");
    return;
  }

  const transaction = {
    id: Date.now(),
    description,
    amount,
  };

  transactions.unshift(transaction);
  saveTransactions();

  render();
  formEl.reset();
}

// Remove transaction
function handleDelete(e) {
  if (!e.target.classList.contains("transaction-item__delete-btn")) return;

  const li = e.target.closest(".transaction-item");
  const id = Number(li.dataset.id);

  transactions = transactions.filter((t) => t.id !== id);
  saveTransactions();

  render();
}

// render
function render() {
  transactionListEl.innerHTML = "";

  transactions.forEach((t) => {
    transactionListEl.appendChild(createTransactionEl(t));
  });

  updateBalance();
}

// Create transaction
function createTransactionEl({ id, description, amount }) {
  const li = document.createElement("li");
  li.classList.add("transaction-item");
  li.classList.add(amount > 0 ? "income" : "expense");

  li.dataset.id = id;

  li.innerHTML = `
    <span class="transaction-item__desc">${description}</span>
    <span class="transaction-item__amount">
      ${amount}
      <button class="transaction-item__delete-btn">X</button>
    </span>
  `;

  return li;
}

// Update balance
function updateBalance() {
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.amount > 0) income += t.amount;
    else expense += t.amount;
  });

  incomeAmountEl.textContent = income;
  expenseAmountEl.textContent = expense;
  balanceAmountEl.textContent = income + expense;
}

// Save transaction
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
