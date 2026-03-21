import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import styles from './ExpensesPage.module.css';

// Иконки для категорий
import { FaUtensils, FaHome, FaGraduationCap, FaCar, FaFilm, FaEllipsisH } from 'react-icons/fa';

const mockExpenses = [
  { id: 1, description: 'Продукты', category: 'Еда', date: '2026-03-15', amount: 500 },
  { id: 2, description: 'Такси', category: 'транспорт', date: '2026-03-16', amount: 200 },
  { id: 3, description: 'Кино', category: 'развлечение', date: '2026-03-14', amount: 1500 },
  // добавим ещё для проверки прокрутки
  { id: 4, description: 'Аренда', category: 'жилье', date: '2026-03-01', amount: 30000 },
  { id: 5, description: 'Курсы', category: 'образование', date: '2026-03-10', amount: 5000 },
  { id: 6, description: 'Бензин', category: 'транспорт', date: '2026-03-12', amount: 1000 },
  { id: 7, description: 'Ресторан', category: 'Еда', date: '2026-03-13', amount: 2500 },
];

const categories = [
  { name: 'Еда', icon: <FaUtensils /> },
  { name: 'транспорт', icon: <FaHome /> },
  { name: 'жилье', icon: <FaGraduationCap /> },
  { name: 'развлечение', icon: <FaCar /> },
  { name: 'образование', icon: <FaFilm /> },
  { name: 'другое', icon: <FaEllipsisH /> },
];

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: '',
    date: '',
    amount: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category) => {
    setNewExpense(prev => ({ ...prev, category }));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.category || !newExpense.date || !newExpense.amount) {
      alert('Заполните все поля');
      return;
    }
    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
    };
    setExpenses([expense, ...expenses]);
    setNewExpense({ description: '', category: '', date: '', amount: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить расход?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Мои расходы</h1>
      <div className={styles.container}>
        {/* Левая часть — таблица */}
        <div className={styles.tableContainer}>
          <h3 className={styles.tableTitle}>Таблица расходов</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Описание</th>
                  <th>Категория</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id}>
                    <td>{exp.description}</td>
                    <td>{exp.category}</td>
                    <td>{exp.date}</td>
                    <td>{exp.amount} ₽</td>
                    <td>
                      <FiTrash2
                        className={styles.deleteIcon}
                        onClick={() => handleDelete(exp.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Правая часть — форма нового расхода */}
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Новый расход</h2>
          <form onSubmit={handleAddExpense}>
            <div className={styles.field}>
              <label className={styles.label}>Описание</label>
              <input
                type="text"
                name="description"
                placeholder="Введите описание"
                value={newExpense.description}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Категория</label>
              <div className={styles.categories}>
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    type="button"
                    className={`${styles.categoryBtn} ${newExpense.category === cat.name ? styles.categoryBtnActive : ''}`}
                    onClick={() => handleCategorySelect(cat.name)}
                  >
                    <span className={styles.categoryIcon}>{cat.icon}</span>
                    <span className={styles.categoryName}>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Дата</label>
              <input
                
                name="date"
                placeholder="Введите дату"
                value={newExpense.date}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Сумма</label>
              <input
                type="number"
                name="amount"
                placeholder="0 ₽"
                value={newExpense.amount}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.addBtn}>
              Добавить новый расход
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;