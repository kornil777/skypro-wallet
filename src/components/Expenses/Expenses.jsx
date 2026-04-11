import { useState, useEffect } from 'react';
import ExpenseItem from './ExpenseItem';
import EditExpenseForm from './EditExpenseForm';
import CalendarView from '../Calendar/CalendarView';
import styles from './Expenses.module.css';

// Моковые данные
const mockExpenses = [
  { id: 1, date: '2026-03-15', category: 'еда', amount: 500, description: 'Продукты' },
  { id: 2, date: '2026-03-16', category: 'транспорт', amount: 200, description: 'Такси' },
  { id: 3, date: '2026-03-14', category: 'развлечения', amount: 1500, description: 'Кино' },
  { id: 4, date: '2026-03-10', category: 'еда', amount: 800, description: 'Ресторан' },
];

const categories = ['еда', 'транспорт', 'развлечения', 'здоровье', 'другое'];

const Expenses = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [filterCategory, setFilterCategory] = useState('все');
  const [sortBy, setSortBy] = useState('date'); // 'date' или 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' или 'desc'
  const [selectedPeriod, setSelectedPeriod] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // начало месяца
    end: new Date(),
  });
  const [editingId, setEditingId] = useState(null); // id редактируемого расхода
  const [selectedId, setSelectedId] = useState(null); // выделенный элемент в таблице

  // Фильтрация по категории и периоду
  const filteredExpenses = expenses.filter((exp) => {
    const categoryMatch = filterCategory === 'все' || exp.category === filterCategory;
    const expDate = new Date(exp.date);
    const periodMatch = expDate >= selectedPeriod.start && expDate <= selectedPeriod.end;
    return categoryMatch && periodMatch;
  });

  // Сортировка
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  // Общая сумма за период
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Суммы по категориям
  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  // Редактирование
  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = (updatedExpense) => {
    setExpenses(expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Удаление
  const handleDelete = (id) => {
    if (window.confirm('Удалить расход?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  // Выбор элемента (подсветка)
  const handleSelect = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  return (
    <div className={styles.expenses}>
      <h2>Учет расходов</h2>

      {/* Календарь для выбора периода */}
      <CalendarView
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* Фильтр по категориям */}
      <div className={styles.filters}>
        <label>
          Категория:
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="все">Все</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        {/* Сортировка */}
        <label>
          Сортировать по:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Дате</option>
            <option value="amount">Сумме</option>
          </select>
        </label>
        <label>
          Порядок:
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">По убыванию</option>
            <option value="asc">По возрастанию</option>
          </select>
        </label>
      </div>

      {/* Итоги */}
      <div className={styles.totals}>
        <p>Общая сумма за период: <strong>{totalAmount} руб.</strong></p>
        <div className={styles.categoryTotals}>
          <h4>По категориям:</h4>
          <ul>
            {Object.entries(categoryTotals).map(([cat, sum]) => (
              <li key={cat}>{cat}: {sum} руб.</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Список расходов */}
      <div className={styles.list}>
        {sortedExpenses.length === 0 ? (
          <p>Нет расходов за выбранный период</p>
        ) : (
          sortedExpenses.map(expense => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              isEditing={editingId === expense.id}
              isSelected={selectedId === expense.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              onSelect={handleSelect}
            />
          ))
        )}
      </div>

      {/* Кнопка добавления нового расхода */}
      <button
        className={styles.addBtn}
        onClick={() => {
          const newExpense = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            category: 'еда',
            amount: 0,
            description: '',
          };
          setExpenses([newExpense, ...expenses]);
          setEditingId(newExpense.id);
        }}
      >
        + Добавить расход
      </button>
    </div>
  );
};

export default Expenses;