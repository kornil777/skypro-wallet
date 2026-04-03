import { useState } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './Calendar.module.css';

const CalendarView = ({ selectedPeriod, onPeriodChange }) => {
  const [mode, setMode] = useState('month'); // 'day', 'week', 'month', 'year'

  const handlePrev = () => {
    let newStart, newEnd;
    switch (mode) {
      case 'day':
        newStart = new Date(selectedPeriod.start);
        newStart.setDate(newStart.getDate() - 1);
        newEnd = new Date(newStart);
        break;
      case 'week':
        newStart = subWeeks(selectedPeriod.start, 1);
        newEnd = endOfWeek(newStart, { locale: ru });
        break;
      case 'month':
        newStart = subMonths(selectedPeriod.start, 1);
        newEnd = endOfMonth(newStart);
        break;
      case 'year':
        newStart = subYears(selectedPeriod.start, 1);
        newEnd = endOfYear(newStart);
        break;
      default:
        return;
    }
    onPeriodChange({ start: newStart, end: newEnd });
  };

  const handleNext = () => {
    let newStart, newEnd;
    switch (mode) {
      case 'day':
        newStart = new Date(selectedPeriod.start);
        newStart.setDate(newStart.getDate() + 1);
        newEnd = new Date(newStart);
        break;
      case 'week':
        newStart = addWeeks(selectedPeriod.start, 1);
        newEnd = endOfWeek(newStart, { locale: ru });
        break;
      case 'month':
        newStart = addMonths(selectedPeriod.start, 1);
        newEnd = endOfMonth(newStart);
        break;
      case 'year':
        newStart = addYears(selectedPeriod.start, 1);
        newEnd = endOfYear(newStart);
        break;
      default:
        return;
    }
    onPeriodChange({ start: newStart, end: newEnd });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Сбросить период в соответствии с новым режимом относительно текущей даты
    const today = new Date();
    let start, end;
    switch (newMode) {
      case 'day':
        start = today;
        end = today;
        break;
      case 'week':
        start = startOfWeek(today, { locale: ru });
        end = endOfWeek(today, { locale: ru });
        break;
      case 'month':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case 'year':
        start = startOfYear(today);
        end = endOfYear(today);
        break;
      default:
        return;
    }
    onPeriodChange({ start, end });
  };

  const formatRange = () => {
    if (mode === 'day') {
      return format(selectedPeriod.start, 'd MMMM yyyy', { locale: ru });
    } else {
      return `${format(selectedPeriod.start, 'd MMM', { locale: ru })} — ${format(selectedPeriod.end, 'd MMM yyyy', { locale: ru })}`;
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.controls}>
        <button onClick={handlePrev}>&lt;</button>
        <span className={styles.range}>{formatRange()}</span>
        <button onClick={handleNext}>&gt;</button>
      </div>
      <div className={styles.modes}>
        {['day', 'week', 'month', 'year'].map((m) => (
          <button
            key={m}
            className={mode === m ? styles.active : ''}
            onClick={() => handleModeChange(m)}
          >
            {m === 'day' ? 'День' : m === 'week' ? 'Неделя' : m === 'month' ? 'Месяц' : 'Год'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;