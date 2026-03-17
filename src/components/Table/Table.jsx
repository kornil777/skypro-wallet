import { useState } from 'react';
import styles from './Table.module.css';

// Используем те же моковые данные
const mockExpenses = [
  { id: 1, date: '2026-03-15', category: 'еда', amount: 500, description: 'Продукты' },
  { id: 2, date: '2026-03-16', category: 'транспорт', amount: 200, description: 'Такси' },
  { id: 3, date: '2026-03-14', category: 'развлечения', amount: 1500, description: 'Кино' },
];

const Table = () => {
  const [expenses] = useState(mockExpenses);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className={styles.container}>
      <h2>Таблица расходов</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Категория</th>
            <th>Сумма</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr
              key={exp.id}
              className={selectedId === exp.id ? styles.selectedRow : ''}
              onClick={() => setSelectedId(exp.id)}
            >
              <td>{exp.date}</td>
              <td>{exp.category}</td>
              <td>{exp.amount} руб.</td>
              <td>{exp.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;