import { useState } from 'react';
import styles from './Expenses.module.css';

const EditExpenseForm = ({ expense, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: expense.id,
    date: expense.date,
    category: expense.category,
    amount: expense.amount,
    description: expense.description,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <select name="category" value={formData.category} onChange={handleChange} required>
        <option value="еда">еда</option>
        <option value="транспорт">транспорт</option>
        <option value="развлечения">развлечения</option>
        <option value="здоровье">здоровье</option>
        <option value="другое">другое</option>
      </select>
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Сумма"
        min="0"
        required
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Описание"
      />
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveBtn}>Сохранить</button>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>Отмена</button>
      </div>
    </form>
  );
};

export default EditExpenseForm;