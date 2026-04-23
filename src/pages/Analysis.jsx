import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { getExpenses } from "../api/expensesApi";
import { useAuth } from "../context/AuthContext";

const Page = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f4f5f6;
  min-height: calc(100vh - 64px);
  @media screen and (max-width: 495px) {
  background-color: white;
  padding: 0 0 0 0;
 }
`;

const PageTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 100%;
  color: #333;
  margin-bottom: 24px;
  @media screen and (max-width: 495px) {
  display: none;
  padding: 24px 0 0 16px;
  font-weight: 700;
  font-size: 24px;
 }
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
  @media screen and (max-width: 495px) {
  box-shadow: none;
  display: block;
 }
`;

const CalendarHeader = styled.div`
  padding: 32px 32px 0 32px;
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  @media screen and (max-width: 495px) {
  box-shadow: none;
  padding: 16px 0;
 }
`;

const CalendarTitle = styled.h3`
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  color: #333;
  @media screen and (max-width: 495px) {
  display: none;
 }
`;
const CalendarTitleNone = styled.h3`
  display: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  color: #333;
  @media screen and (max-width: 495px) {
  display: block;
  padding-left: 16px;
 }
`
const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 40px);
  gap: 4px;
  width: 313px;
  text-align: center;
  font-family: "Montserrat", sans-serif;
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
  font-family: "Montserrat", sans-serif;
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
  font-family: "Montserrat", sans-serif;
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

  &.range-start,
  &.range-end {
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
  @media screen and (max-width: 495px) {
  display: none;
  width: 375px;
  padding: 0;
  box-shadow: none;
 }
`;

const TotalAmount = styled.div`
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  color: #333;
  margin-bottom: 12px;
  @media screen and (max-width: 495px) {
    font-size: 20px;
    padding-left: 16px; 
 }
`;

const PeriodLabel = styled.div`
  font-family: "Montserrat", sans-serif;
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
  @media screen and (max-width: 495px) {
  gap: 6px;
  padding: 0 16px;
 }
`;

const CategoryColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 94px;
  @media screen and (max-width: 495px) {
  max-width: 52px;
 }
`;

const CategoryTotal = styled.div`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
  white-space: nowrap;
  @media screen and (max-width: 495px) {
  font-size: 10px;
 }
`;

const Bar = styled.div`
  width: 100%;
  border-radius: 12px;
  transition: height 0.2s;
  margin-bottom: 8px;
`;

const CategoryName = styled.div`
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: #666;
  text-align: center;
  text-transform: capitalize;
  @media screen and (max-width: 495px) {
    width: 52px;
    overflow: hidden;
    font-size: 10px;
 }
`;

const categories = [
  { name: "Еда", color: "#D9B6FF" },
  { name: "транспорт", color: "#FFB53D" },
  { name: "жилье", color: "#6EE4FE" },
  { name: "развлечение", color: "#B0AEFF" },
  { name: "образование", color: "#BCEC30" },
  { name: "другое", color: "#FFB9B8" },
];
const ChangePeriodContainer = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  display: block;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 24px 16px;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.1);
`
const ChangePeriodButton = styled.div`
  width: 100%;
  background-color: #7334EA;
  display: flex;
  justify-content: center;
  font-size:12px;
  font-weight:600;
  color: #ffffff;
  padding: 16px;
  border-radius: 6px;
`
const Analysis = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseDate = new Date();
  const currentYear = baseDate.getFullYear();
  const currentMonth = baseDate.getMonth();
  const months = Array.from({ length: 24 }, (_, i) => {
    return new Date(currentYear, currentMonth - 12 + i, 0);
  });

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const loadExpenses = async () => {
      if (!user) return;
      const data = await getExpenses();
      setExpenses(data);
      setLoading(false);
    };
    loadExpenses();
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const currentMonthStr = baseDate.toISOString().slice(0, 7);
        const targetElement = scrollContainerRef.current.querySelector(
          `[data-month="${currentMonthStr}"]`
        );
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "auto",
            block: "start",
          });
        }
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [baseDate]);

  const getExpensesForPeriod = () => {
    if (!startDate) return [];
    const start = startDate;
    const end = endDate || startDate;
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    return expenses.filter((exp) => exp.date >= startStr && exp.date <= endStr);
  };

  const periodExpenses = getExpensesForPeriod();
  const totalAmount = periodExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = categories.map((cat) => {
    const total = periodExpenses
      .filter((exp) => exp.category === cat.name)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { ...cat, total };
  });

  const maxCategoryTotal = Math.max(...categoryTotals.map((c) => c.total), 1);

  const formatPeriod = () => {
    if (!startDate) return "";
    const start = startDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!endDate || startDate.toDateString() === endDate.toDateString()) {
      return `Расходы за ${start}`;
    } else {
      const end = endDate.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
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
    return (
      dayTime >= Math.min(startTime, endTime) &&
      dayTime <= Math.max(startTime, endTime)
    );
  };

  const getBarHeight = (total) => {
    if (total === 0) return 4;
    const calculated = (total / maxCategoryTotal) * 328;
    return Math.max(4, Math.min(328, calculated));
  };

  if (loading) {
    return <Page>Загрузка...</Page>;
  }

  return (
    <Page>
      <PageTitle>Анализ расходов</PageTitle>
      <Container>
        <CalendarContainer>
          <CalendarHeader>
            <CalendarTitle>Период</CalendarTitle>
            <CalendarTitleNone>Выбор периода</CalendarTitleNone>
            <WeekDays>
              <span>Пн</span>
              <span>Вт</span>
              <span>Ср</span>
              <span>Чт</span>
              <span>Пт</span>
              <span>Сб</span>
              <span>Вс</span>
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
                    {month.toLocaleDateString("ru-RU", {
                      month: "long",
                      year: "numeric",
                    })}
                  </MonthTitle>
                  <DaysGrid>
                    {days.map((day, i) => (
                      <DayButton
                        key={i}
                        disabled={!day}
                        className={`${
                          day && isInRange(day) ? "in-range" : ""
                        } ${
                          day &&
                          startDate &&
                          day.toDateString() === startDate.toDateString()
                            ? "range-start"
                            : ""
                        } ${
                          day &&
                          endDate &&
                          day.toDateString() === endDate.toDateString() &&
                          startDate?.toDateString() !== endDate?.toDateString()
                            ? "range-end"
                            : ""
                        }`}
                        onClick={() => handleDayClick(day)}
                      >
                        {day ? day.getDate() : ""}
                      </DayButton>
                    ))}
                  </DaysGrid>
                </MonthBlock>
              );
            })}
          </MonthsContainer>
          <ChangePeriodContainer>
            <ChangePeriodButton>Выбрать период</ChangePeriodButton>
          </ChangePeriodContainer>
        </CalendarContainer>
        <StatsContainer>
          <TotalAmount>{totalAmount} ₽</TotalAmount>
          <PeriodLabel>{formatPeriod()}</PeriodLabel>
          <CategoriesChart>
            {categoryTotals.map((cat) => (
              <CategoryColumn key={cat.name}>
                <CategoryTotal>{cat.total} ₽</CategoryTotal>
                <Bar
                  style={{
                    height: `${getBarHeight(cat.total)}px`,
                    backgroundColor: cat.color,
                  }}
                />
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
