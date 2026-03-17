import { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import EditExpenseForm from './EditExpenseForm';
import styles from './Expenses.module.css';

const ExpenseItem = ({
  expense,
  isEditing,
  isSelected,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onSelect,
}) => {
  const handleClick = () => {
    onSelect(expense.id);
  };

  if (isEditing) {
    return (
      <EditExpenseForm
        expense={expense}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div
      className={`${styles.item} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.itemInfo}>
        <span className={styles.date}>{expense.date}</span>
        <span className={styles.category}>{expense.category}</span>
        <span className={styles.amount}>{expense.amount} руб.</span>
        <span className={styles.description}>{expense.description}</span>
      </div>
      <div className={styles.actions}>
        <FiEdit
          className={styles.icon}
          onClick={(e) => { e.stopPropagation(); onEdit(expense.id); }}
        />
        <FiTrash2
          className={styles.icon}
          onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }}
        />
      </div>
    </div>
  );
};

export default ExpenseItem;