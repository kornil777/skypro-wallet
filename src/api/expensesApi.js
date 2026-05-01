const STORAGE_PREFIX = "skypro_wallet_expenses_";

const defaultExpenses = [
  {
    id: 1,
    description: "Продукты",
    category: "Еда",
    date: "2026-03-15",
    amount: 500,
  },
  {
    id: 2,
    description: "Такси",
    category: "транспорт",
    date: "2026-03-16",
    amount: 200,
  },
  {
    id: 3,
    description: "Кино",
    category: "развлечение",
    date: "2026-03-14",
    amount: 1500,
  },
  {
    id: 4,
    description: "Аренда",
    category: "жилье",
    date: "2026-03-01",
    amount: 30000,
  },
  {
    id: 5,
    description: "Курсы",
    category: "образование",
    date: "2026-03-10",
    amount: 5000,
  },
  {
    id: 6,
    description: "Бензин",
    category: "транспорт",
    date: "2026-03-12",
    amount: 1000,
  },
  {
    id: 7,
    description: "Ресторан",
    category: "Еда",
    date: "2026-03-13",
    amount: 2500,
  },
  {
    id: 8,
    description: "Кофе",
    category: "Еда",
    date: "2026-03-17",
    amount: 300,
  },
  {
    id: 9,
    description: "Метро",
    category: "транспорт",
    date: "2026-03-17",
    amount: 65,
  },
  {
    id: 10,
    description: "Книги",
    category: "образование",
    date: "2026-03-17",
    amount: 1200,
  },
  {
    id: 11,
    description: "Комуналка",
    category: "жилье",
    date: "2026-03-17",
    amount: 4500,
  },
  {
    id: 12,
    description: "Пицца",
    category: "Еда",
    date: "2026-03-18",
    amount: 800,
  },
  {
    id: 13,
    description: "Такси",
    category: "транспорт",
    date: "2026-03-18",
    amount: 350,
  },
  {
    id: 14,
    description: "Кино",
    category: "развлечение",
    date: "2026-03-18",
    amount: 600,
  },
];

let currentUserEmail = null;

export const setUser = (email) => {
  currentUserEmail = email;
};

const getStorageKey = () => {
  if (!currentUserEmail) {
    throw new Error("Пользователь не авторизован");
  }
  return `${STORAGE_PREFIX}${currentUserEmail}`;
};

const initializeStorage = () => {
  const key = getStorageKey();
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(defaultExpenses));
  }
};

export const getExpenses = async () => {
  if (!currentUserEmail) {
    return [];
  }
  const key = getStorageKey();
  initializeStorage();
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = JSON.parse(localStorage.getItem(key));
      resolve(data);
    }, 100);
  });
};

export const addExpense = async (expense) => {
  const key = getStorageKey();
  const expenses = await getExpenses();
  const newExpense = { ...expense, id: Date.now() };
  const updated = [newExpense, ...expenses];
  localStorage.setItem(key, JSON.stringify(updated));
  return newExpense;
};

export const deleteExpense = async (id) => {
  const key = getStorageKey();
  const expenses = await getExpenses();
  const updated = expenses.filter((exp) => exp.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
};

export const clearUserData = () => {
  if (currentUserEmail) {
    const key = getStorageKey();
    localStorage.removeItem(key);
  }
  currentUserEmail = null;
};
//test1//
