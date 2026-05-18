import { getExpenses as apiGet, addExpense as apiAdd, deleteExpense as apiDelete } from './transactionsApi';

export const getExpenses = apiGet;
export const addExpense = async (expense) => {
  const newList = await apiAdd(expense);
  return newList;
};
export const deleteExpense = apiDelete;


export const setUser = () => {};
export const clearUserData = () => {};