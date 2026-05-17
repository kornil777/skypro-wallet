// ⚠️ ВСТАВИТЬ СЮДА РЕАЛЬНЫЙ ТОКЕН
const FIXED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // замените!

const BASE_URL = 'https://wedev-api.sky.pro/api';


const categoryMapToApi = {
  'Еда': 'food',
  'транспорт': 'transport',
  'жилье': 'housing',
  'развлечение': 'joy',
  'образование': 'education',
  'другое': 'others',
};

const categoryMapFromApi = {
  'food': 'Еда',
  'transport': 'транспорт',
  'housing': 'жилье',
  'joy': 'развлечение',
  'education': 'образование',
  'others': 'другое',
};


const adaptTransactionFromApi = (apiTransaction) => ({
  id: apiTransaction._id,
  description: apiTransaction.description,
  category: categoryMapFromApi[apiTransaction.category] || apiTransaction.category,
  date: apiTransaction.date.split('T')[0], // YYYY-MM-DD
  amount: apiTransaction.sum,
});


const adaptTransactionToApi = (transaction) => ({
  description: transaction.description,
  sum: transaction.amount,
  category: categoryMapToApi[transaction.category] || transaction.category,
  date: transaction.date,
});


const request = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${FIXED_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Ошибка ${response.status}`);
  }

  
  if (response.status === 204) return null;
  return response.json();
};

export const getExpenses = async () => {
  const data = await request('/transactions');
  return data.map(adaptTransactionFromApi);
};

export const addExpense = async (expense) => {
  const payload = adaptTransactionToApi(expense);
 
  const updatedList = await request('/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const newList = updatedList.map(adaptTransactionFromApi);
  
  const added = newList.reduce((latest, curr) => (curr.id > latest.id ? curr : latest), newList[0]);
  return added;
};

export const deleteExpense = async (id) => {
  await request(`/transactions/${id}`, { method: 'DELETE' });
};