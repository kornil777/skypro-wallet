import { get, post, del } from './client';


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

const adaptFromApi = (t) => ({
  id: t._id,
  description: t.description,
  category: categoryMapFromApi[t.category] || t.category,
  date: t.date.split('T')[0],
  amount: t.sum,
});

const adaptToApi = (t) => ({
  description: t.description,
  sum: t.amount,
  category: categoryMapToApi[t.category] || t.category,
  date: t.date,
});

export const getExpenses = async () => {
  const data = await get('/transactions');
  return data.map(adaptFromApi);
};

export const addExpense = async (expense) => {
  const payload = adaptToApi(expense);
  await post('/transactions', payload);
  // Запрашиваем свежий список и возвращаем его
  const newList = await getExpenses();
  return newList;
};

export const deleteExpense = async (id) => {
  await del(`/transactions/${id}`);
};