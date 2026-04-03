import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Page = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f4f5f6;
  min-height: calc(100vh - 64px);
  padding-top: 36px;
`;

const PageTitle = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 100%;
  color: #333;
  margin-bottom: 24px;
`;

const Container = styled.div`
  display: flex;
  gap: 34px;
`;

const CalendarContainer = styled.div`
  width: 379px;
  height: 540px;
  background: white;
  border-radius: 30px;
  box-shadow: 0px 20px 67px -12px rgba(0, 0, 0, 0.21);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const CalendarHeader = styled.div`
  padding: 32px 32px 0 32px;
  display: flex;
  flex-direction: column;
  row-gap: 24px;
`;

const CalendarTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  color: #333;
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 40px);
  gap: 4px;
  width: 313px;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: #999;
  align-self: center;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background-color: #eee;
  border: none;
  margin: 0;
`;

const MonthsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 32px 24px 32px;
  scrollbar-width: thin;
  scrollbar-color: #ccc #f0f0f0;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`;

const MonthBlock = styled.div`
  width: 100%;
`;

const MonthTitle = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: #333;
  margin-bottom: 12px;
  text-transform: capitalize;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 40px);
  gap: 4px;
`;

const DayButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 60px;
  border: none;
  background-color: #f4f5f6;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #e0e0e0;
  }

  &:disabled {
    background: transparent;
    cursor: default;
    pointer-events: none;
  }

  &.in-range {
    background-color: #f1ebfd !important;
    color: #7334ea !important;
  }

  &.range-start, &.range-end {
    background-color: #7334ea !important;
    color: white !important;
  }
`;

const StatsContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 30px;
  padding: 24px;
  box-shadow: 0px 20px 67px -12px rgba(0, 0, 0, 0.21);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const TotalAmount = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  color: #333;
  margin-bottom: 12px;
`;

const PeriodLabel = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: 100%;
  color: #999;
  margin-bottom: 24px;
  text-transform: capitalize;
`;

const CategoriesChart = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-end;
  flex: 1;
  min-height: 400px;
`;

const CategoryColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 94px;
`;

const CategoryTotal = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
  white-space: nowrap;
`;

const Bar = styled.div`
  width: 100%;
  border-radius: 12px;
  transition: height 0.2s;
  margin-bottom: 8px;
`;

const CategoryName = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: #666;
  text-align: center;
  text-transform: capitalize;
`;

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

  const baseDate = new Date();
  const currentYear = baseDate.getFullYear();
  const currentMonth = baseDate.getMonth();
  const months = Array.from({ length: 24 }, (_, i) => {
    return new Date(currentYear, currentMonth - 12 + i, 0);
  });

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const currentMonthStr = baseDate.toISOString().slice(0, 7);
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
  }, []);

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

  const generateMonthDays = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  };

  const handleDayClick = (day) => {
    if (!day) return;

    if (startDate === null) {
      setStartDate(day);
      setEndDate(day);
    } else if (endDate && startDate.toDateString() === endDate.toDateString()) {
      if (day < startDate) {
        setStartDate(day);
        setEndDate(startDate);
      } else {
        setEndDate(day);
      }
    } else {
      setStartDate(day);
      setEndDate(day);
    }
  };

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
    <Page>
      <PageTitle>Анализ расходов</PageTitle>
      <Container>
        <CalendarContainer>
          <CalendarHeader>
            <CalendarTitle>Период</CalendarTitle>
            <WeekDays>
              <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
            </WeekDays>
          </CalendarHeader>
          <Divider />
          <MonthsContainer ref={scrollContainerRef}>
            {months.map((month, idx) => {
              const days = generateMonthDays(month);
              const monthStr = month.toISOString().slice(0, 7);
              return (
                <MonthBlock key={idx} data-month={monthStr}>
                  <MonthTitle>
                    {month.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                  </MonthTitle>
                  <DaysGrid>
                    {days.map((day, i) => (
                      <DayButton
                        key={i}
                        disabled={!day}
                        className={`${day && isInRange(day) ? 'in-range' : ''} ${
                          day && startDate && day.toDateString() === startDate.toDateString() ? 'range-start' : ''
                        } ${
                          day && endDate && day.toDateString() === endDate.toDateString() && startDate?.toDateString() !== endDate?.toDateString() ? 'range-end' : ''
                        }`}
                        onClick={() => handleDayClick(day)}
                      >
                        {day ? day.getDate() : ''}
                      </DayButton>
                    ))}
                  </DaysGrid>
                </MonthBlock>
              );
            })}
          </MonthsContainer>
        </CalendarContainer>

        <StatsContainer>
          <TotalAmount>{totalAmount} ₽</TotalAmount>
          <PeriodLabel>{formatPeriod()}</PeriodLabel>
          <CategoriesChart>
            {categoryTotals.map((cat) => (
              <CategoryColumn key={cat.name}>
                <CategoryTotal>{cat.total} ₽</CategoryTotal>
                <Bar style={{ height: `${getBarHeight(cat.total)}px`, backgroundColor: cat.color }} />
                <CategoryName>{cat.name}</CategoryName>
              </CategoryColumn>
            ))}
          </CategoriesChart>
        </StatsContainer>
      </Container>
    </Page>
  );
};

export default Analysis;