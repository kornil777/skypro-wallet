import { useState, useEffect, useRef } from 'react';
import styles from './Analysis.module.css';

// Моковые данные расходов
const mockExpenses = [
  { id: 1, description: 'Продукты', category: 'Еда', date: '2026-03-15', amount: 500 },
  { id: 2, description: 'Такси', category: 'транспорт', date: '2026-03-16', amount: 200 },
  { id: 3, description: 'Кино', category: 'развлечение', date: '2026-03-14', amount: 1500 },
  { id: 4, description: 'Аренда', category: 'жилье', date: '2026-03-01', amount: 30000 },
  { id: 5, description: 'Курсы', category: 'образование', date: '2026-03-10', amount: 5000 },
  { id: 6, description: 'Бензин', category: 'транспорт', date: '2026-03-12', amount: 1000 },
  { id: 7, description: 'Ресторан', category: 'Еда', date: '2026-03-13', amount: 2500 },
  { id: 8, description: 'Кофе', category: 'Еда', date: '2026-03-17', amount: 300 },
  { id: 9, description: 'Метро', category: 'транспорт', date: '2026-03-17', amount: 65 },
  { id: 10, description: 'Книги', category: 'образование', date: '2026-03-17', amount: 1200 },
  { id: 11, description: 'Комуналка', category: 'жилье', date: '2026-03-17', amount: 4500 },
  { id: 12, description: 'Пицца', category: 'Еда', date: '2026-03-18', amount: 800 },
  { id: 13, description: 'Такси', category: 'транспорт', date: '2026-03-18', amount: 350 },
  { id: 14, description: 'Кино', category: 'развлечение', date: '2026-03-18', amount: 600 },
];

// Категории с цветами
const categories = [
  { name: 'Еда', color: '#D9B6FF' },
  { name: 'транспорт', color: '#FFB53D' },
  { name: 'жилье', color: '#6EE4FE' },
  { name: 'развлечение', color: '#B0AEFF' },
  { name: 'образование', color: '#BCEC30' },
  { name: 'другое', color: '#FFB9B8' },
];

const Analysis = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Генерируем массив месяцев (24 месяца: 12 до текущего и 11 после)
  const baseDate = new Date();
  const currentYear = baseDate.getFullYear();
  const currentMonth = baseDate.getMonth();
  const months = Array.from({ length: 24 }, (_, i) => {
    return new Date(currentYear, currentMonth - 12 + i, 0);
  });

  const scrollContainerRef = useRef(null);

  // При монтировании прокручиваем к текущему месяцу
  useEffect(() => {
    
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const currentMonthStr = baseDate.toISOString().slice(0, 7); // "2026-03"
        // Ищем элемент с соответствующим data-атрибутом
        const targetElement = scrollContainerRef.current.querySelector(
          `[data-month="${currentMonthStr}"]`
        );
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'auto',
            block: 'start',
          });
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []); // Пустой массив зависимостей — выполняется только при монтировании

  // Получить расходы за выбранный период
  const getExpensesForPeriod = () => {
    if (!startDate) return [];
    const start = startDate;
    const end = endDate || startDate;
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    return mockExpenses.filter(exp => exp.date >= startStr && exp.date <= endStr);
  };

  const periodExpenses = getExpensesForPeriod();
  const totalAmount = periodExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = categories.map(cat => {
    const total = periodExpenses
      .filter(exp => exp.category === cat.name)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { ...cat, total };
  });

  const maxCategoryTotal = Math.max(...categoryTotals.map(c => c.total), 1);

  const formatPeriod = () => {
    if (!startDate) return '';
    const start = startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!endDate || startDate.toDateString() === endDate.toDateString()) {
      return `Расходы за ${start}`;
    } else {
      const end = endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
      return `Расходы за ${start} — ${end}`;
    }
  };

  // Генерация дней для конкретного месяца
  const generateMonthDays = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Пн = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  };

  // Обработчик клика по дню
  const handleDayClick = (day) => {
    if (!day) return;

    if (startDate === null) {
      // Первый выбор
      setStartDate(day);
      setEndDate(day);
    } else if (endDate && startDate.toDateString() === endDate.toDateString()) {
      // Уже выбран один день — теперь выбираем конец периода
      if (day < startDate) {
        setStartDate(day);
        setEndDate(startDate);
      } else {
        setEndDate(day);
      }
    } else {
      // Уже выбран период — начинаем новый выбор с этого дня
      setStartDate(day);
      setEndDate(day);
    }
  };

  // Проверка, входит ли день в выбранный период
  const isInRange = (day) => {
    if (!day || !startDate) return false;
    const end = endDate || startDate;
    const dayTime = day.getTime();
    const startTime = startDate.getTime();
    const endTime = end.getTime();
    return dayTime >= Math.min(startTime, endTime) && dayTime <= Math.max(startTime, endTime);
  };

  const getBarHeight = (total) => {
    if (total === 0) return 4;
    const calculated = (total / maxCategoryTotal) * 328;
    return Math.max(4, Math.min(328, calculated));
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Анализ расходов</h1>
      <div className={styles.container}>
        {/* Левая колонка — календарь */}
        
          <div className={styles.calendarContainer}>
          <div className={styles.calendarContainerHeader}>
            <div><h3 className={styles.calendarTitle}>Период</h3></div>
                    <div className={styles.weekDays}>
            <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
          </div>
          </div>
          <hr className={styles.divider}
           />
          {/* Прокручиваемая область с месяцами */}
          <div className={styles.monthsContainer} ref={scrollContainerRef}>
            {months.map((month, idx) => {
              const days = generateMonthDays(month);
              const monthStr = month.toISOString().slice(0, 7);
              return (
                <div
                  key={idx}
                  className={styles.monthBlock}
                  data-month={monthStr}
                >
                  <div className={styles.monthTitle}>
                    {month.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className={styles.daysGrid}>
                    {days.map((day, i) => (
                      <button
                        key={i}
                        className={`${styles.dayBtn} ${day ? '' : styles.empty} ${
                          day && isInRange(day) ? styles.inRange : ''
                        } ${
                          day && startDate && day.toDateString() === startDate.toDateString() ? styles.rangeStart : ''
                        } ${
                          day && endDate && day.toDateString() === endDate.toDateString() && startDate?.toDateString() !== endDate?.toDateString() ? styles.rangeEnd : ''
                        }`}
                        onClick={() => handleDayClick(day)}
                        disabled={!day}
                      >
                        {day ? day.getDate() : ''}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        

        {/* Правая колонка — статистика */}
        <div className={styles.statsContainer}>
          <div className={styles.totalAmount}>{totalAmount} ₽</div>
          <div className={styles.periodLabel}>{formatPeriod()}</div>
          <div className={styles.categoriesChart}>
            {categoryTotals.map((cat) => (
              <div key={cat.name} className={styles.categoryColumn}>
                <div className={styles.categoryTotal}>{cat.total} ₽</div>
                <div
                  className={styles.bar}
                  style={{
                    height: `${getBarHeight(cat.total)}px`,
                    backgroundColor: cat.color,
                  }}
                />
                <div className={styles.categoryName}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;