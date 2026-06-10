const form = document.getElementById("expense-form");
const totalAmount = document.getElementById("total-amount");
const expenseCount = document.getElementById("expense-count");
const highestExpense = document.getElementById("highest-expense");
const descriptionInput = document.getElementById("description");
const amountInput= document.getElementById("amount");
const categoryInput = document.getElementById("category");
const clearAll = document.getElementById("clear-all");
const emptyState = document.getElementById("empty-state");
const expenseList= document.getElementById("expense-list");
const formError = document.getElementById("form-error");
const filterButtons = document.querySelectorAll(".filter-btn");

let expenses=[
    {
        id: 1, description: "Coffee", amount : 4.5, category: "food" 
    },
    {
        id: 2, description: "Bus Ticket", amount: 7.5, category:"transport" 
    }
];

let nextId=3;
let activeFilter= "all";

function demonstrateVarScope(){
    if(true){
        var legacyCounter = 0;
        legacyCounter += 1;
    }
    return legacyCounter;
}

const formatCurrency=(amount)=>{

  const currencySymbol = "$"; // string
  const numericAmount = Number(amount); // number
  const isValid = !Number.isNaN(numericAmount) && numericAmount >= 0; // boolean
  if (!isValid) return null;
  return `${currencySymbol}${numericAmount.toFixed(2)}`;
    
}
// --- Operators ---
// arithmetic (+), comparison (===, >), logical (&&, ||)
const isOverBudget = (total, limit = 100) => total > limit;

const validateExpense = ({ description, amount, category }) => {
  const trimmed = description.trim();
  const parsedAmount = parseFloat(amount);

  if (!trimmed || trimmed.length < 2) {
    return { valid: false, message: "Description must be at least 2 characters." };
  }
  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    return { valid: false, message: "Amount must be a positive number." };
  }

  const allowedCategories = ["food", "transport", "other"];
  if (!allowedCategories.includes(category)) {
    return { valid: false, message: "Please select a valid category." };
  }

  return { valid: true, data: { description: trimmed, amount: parsedAmount, category } };
};

// --- Functions & ES6: arrow functions, default parameters, destructuring ---
const getCategoryTagClass = (category = "other") => {
    switch (category) {
      case "food":
        return "tag-food";
      case "transport":
        return "tag-transport";
      default:
        return "tag-other";
    }
  };

  const getTotal = (list) => list.reduce((sum, expense) => sum + expense.amount, 0);

  const getHighestExpense = (list) => {
    if (list.length === 0) return null;
  
    let highest = list[0];
    let i = 1;
    while (i < list.length) {
      if (list[i].amount > highest.amount) {
        highest = list[i];
      }
      i += 1;
    }
    return highest;
  };

  const filterExpenses = (list, filter) => {
    if (filter === "all") return list;
    return list.filter((expense) => expense.category === filter);
  };

  const addExpense = ({ description, amount, category }) => {
    const newExpense = { id: nextId, description, amount, category };
    nextId += 1;
    expenses = [...expenses, newExpense];
    return newExpense;
  };

  const deleteExpense = (id) => {
    expenses = expenses.filter((expense) => expense.id !== id);
  };
  
  const showFormError = (message = "") => {
    if (message) {
      formError.textContent = message;
      formError.hidden = false;
    } else {
      formError.textContent = "";
      formError.hidden = true;
    }
  };

// --- DOM manipulation ---
const createExpenseElement = (expense) => {
    const { id, description, amount, category } = expense;
  
    const li = document.createElement("li");
    li.className = "expense-item";
    li.dataset.id = String(id);
  
    const info = document.createElement("div");
    info.className = "expense-info";
  
    const title = document.createElement("div");
    title.className = "expense-description";
    title.textContent = description;
  
    const meta = document.createElement("div");
    meta.className = "expense-meta";
  
    const tag = document.createElement("span");
    tag.className = `tag ${getCategoryTagClass(category)}`;
    tag.textContent = category;
  
    meta.appendChild(tag);
  
    const amountEl = document.createElement("span");
    amountEl.className = "expense-amount";
    amountEl.textContent = formatCurrency(amount);
  
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteExpense(id);
      render();
    });
  
    info.appendChild(title);
    info.appendChild(meta);
  
    li.appendChild(info);
    li.appendChild(amountEl);
    li.appendChild(deleteBtn);
  
    return li;
  };
  
  const renderExpenseList = (list) => {
    expenseList.innerHTML = "";
  
    for (const expense of list) {
      expenseList.appendChild(createExpenseElement(expense));
    }
  
    const hasItems = list.length > 0;
    emptyState.hidden = hasItems;
    expenseList.hidden = !hasItems;
  };
  
  const renderSummary = (list) => {
    const total = getTotal(list);
    const count = list.length;
    const highest = getHighestExpense(list);
  
    totalAmount.textContent = formatCurrency(total) ?? "$0.00";
    expenseCount.textContent = String(count);
  
    if (highest) {
      const { description, amount } = highest;
      highestExpense.textContent = `${description} (${formatCurrency(amount)})`;
    } else {
      highestExpense.textContent = "—";
    }
  
    if (isOverBudget(total)) {
      totalAmount.style.color = "#b91c1c";
    } else {
      totalAmount.style.color = "";
    }
  };
  
  const updateFilterButtons = () => {
    filterButtons.forEach((button) => {
      const { filter } = button.dataset;
      button.classList.toggle("active", filter === activeFilter);
    });
  };
  
  const render = () => {
    const visible = filterExpenses(expenses, activeFilter);
    renderExpenseList(visible);
    renderSummary(expenses);
    updateFilterButtons();
  };
  
  // --- Events and event listeners ---
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const result = validateExpense({
      description: descriptionInput.value,
      amount: amountInput.value,
      category: categoryInput.value,
    });
  
    if (!result.valid) {
      showFormError(result.message);
      return;
    }
  
    showFormError();
    addExpense(result.data);
    form.reset();
    render();
  });
  
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter ?? "all";
      render();
    });
  });
  
  clearAll.addEventListener("click", () => {
    if (expenses.length === 0) return;
  
    const shouldClear = window.confirm("Delete all expenses?");
    if (shouldClear) {
      expenses = [];
      render();
    }
  });
  
  // Initial render
  demonstrateVarScope();
  render();
  