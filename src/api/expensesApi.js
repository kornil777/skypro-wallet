import { getExpenses as apiGet, addExpense as apiAdd, deleteExpense as apiDelete } from './transactionsApi';


export const getExpenses = apiGet;

export const addExpense = async (expense) => {
  const added = await apiAdd(expense);
  return added; 
};

export const deleteExpense = async (id) => {
  await apiDelete(id);
};


export const setUser = (email) => {
  // не требуется
};

export const clearUserData = () => {
  
};