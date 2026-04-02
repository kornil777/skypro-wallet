import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiTrash2 } from 'react-icons/fi';
import { FaUtensils, FaHome, FaGraduationCap, FaCar, FaFilm, FaEllipsisH } from 'react-icons/fa';
import { useFormValidation } from '../hooks/useFormValidation';
import {
  Input,
  SubmitButton,
} from '../styles/FormStyles';

// Моковые данные расходов
const mockExpenses = [
  { id: 1, description: 'Продукты', category: 'Еда', date: '2026-03-15', amount: 500 },
  { id: 2, description: 'Такси', category: 'транспорт', date: '2026-03-16', amount: 200 },
  { id: 3, description: 'Кино', category: 'развлечение', date: '2026-03-14', amount: 1500 },
  { id: 4, description: 'Аренда', category: 'жилье', date: '2026-03-01', amount: 30000 },
  { id: 5, description: 'Курсы', category: 'образование', date: '2026-03-10', amount: 5000 },
  { id: 6, description: 'Бензин', category: 'транспорт', date: '2026-03-12', amount: 1000 },
  { id: 7, description: 'Ресторан', category: 'Еда', date: '2026-03-13', amount: 2500 },
];

const categories = [
  { name: 'Еда', icon: <FaUtensils /> },
  { name: 'транспорт', icon: <FaCar /> },
  { name: 'жилье', icon: <FaHome /> },
  { name: 'развлечение', icon: <FaFilm /> },
  { name: 'образование', icon: <FaGraduationCap /> },
  { name: 'другое', icon: <FaEllipsisH /> },
];

// Стилизованные компоненты
const Page = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f4f5f6;
  min-height: calc(100vh - 64px);
`;

const PageTitle = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  color: #333;
  margin-bottom: 24px;
`;

const Container = styled.div`
  display: flex;
  gap: 34px;
`;

const TableContainer = styled.div`
  width: 789px;
  height: 618px;
  background: white;
  border-radius: 30px;
  padding: 20px;
  box-shadow: 0px 20px 67px -12px rgba(0, 0, 0, 0.21);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-right: 0;
`;

const TableTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  color: #333;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  border-radius: 8px;
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

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Montserrat', sans-serif;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  font-weight: 600;
  font-size: 12px;
  color: #999999;
  border-bottom: 1px solid #eee;
  background: white;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
  color: #333;
`;

const DeleteIcon = styled(FiTrash2)`
  color: #999;
  cursor: pointer;
  font-size: 18px;
  transition: color 0.2s;

  &:hover {
    color: #7334ea;
  }
`;

const FormContainer = styled.div`
  width: 379px;
  height: 618px;
  background: white;
  border-radius: 30px;
  padding: 24px 33px;
  box-shadow: 0px 20px 67px -12px rgba(0, 0, 0, 0.21);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  margin-bottom: 24px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: #333;

  ${({ $hasError }) =>
    $hasError &&
    `
      &::after {
        content: '*';
        color: #f25050;
        margin-left: 4px;
      }
    `}
`;

const CategoriesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 313px;
  margin-top: 4px;
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 31px;
  background: #f4f5f6;
  border: none;
  border-radius: 30px;
  padding: 8px 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: #666;

  &:hover {
    background: #f1ebfd;
  }

  &.active {
    background: #f1ebfd;
    color: #7334ea;

    svg {
      color: #7334ea;
    }
  }

  svg {
    font-size: 14px;
  }
`;

// Валидация для формы нового расхода
const validationRules = {
  description: {
    required: true,
    message: 'Введите описание',
  },
  category: {
    required: true,
    message: 'Выберите категорию',
  },
  date: {
    required: true,
    message: 'Введите дату',
  },
  amount: {
    required: true,
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'Введите корректную сумму (только цифры)',
  },
};

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [isSubmitFailed, setIsSubmitFailed] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    isFormValid,
    setAllTouched,
  } = useFormValidation(
    { description: '', category: '', date: '', amount: '' },
    validationRules
  );

  // При изменении полей, если была неудачная попытка отправки и все поля валидны, снимаем блокировку
  useEffect(() => {
    if (isSubmitFailed && isFormValid()) {
      setIsSubmitFailed(false);
    }
  }, [values, errors, isSubmitFailed, isFormValid]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    // Помечаем все поля как тронутые, чтобы сразу показать ошибки
    setAllTouched();
    const isValid = validateAll();
    if (!isValid) {
      setIsSubmitFailed(true);
      return;
    }
    // Если всё ок, добавляем расход
    const expense = {
      id: Date.now(),
      ...values,
      amount: parseFloat(values.amount),
    };
    setExpenses([expense, ...expenses]);
    resetForm();
    setIsSubmitFailed(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить расход?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  // Кнопка активна, только если не было неудачной отправки
  const isButtonDisabled = isSubmitFailed;

  return (
    <Page>
      <PageTitle>Мои расходы</PageTitle>
      <Container>
        <TableContainer>
          <TableTitle>Таблица расходов</TableTitle>
          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <TableHeader>Описание</TableHeader>
                  <TableHeader>Категория</TableHeader>
                  <TableHeader>Дата</TableHeader>
                  <TableHeader>Сумма</TableHeader>
                  <TableHeader></TableHeader>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <TableRow key={exp.id}>
                    <TableCell>{exp.description}</TableCell>
                    <TableCell>{exp.category}</TableCell>
                    <TableCell>{exp.date}</TableCell>
                    <TableCell>{exp.amount} ₽</TableCell>
                    <TableCell>
                      <DeleteIcon onClick={() => handleDelete(exp.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StyledTable>
          </TableWrapper>
        </TableContainer>

        <FormContainer>
          <FormTitle>Новый расход</FormTitle>
          <Form onSubmit={handleAddExpense}>
            {/* Описание */}
            <FieldGroup>
              <Label $hasError={touched.description && errors.description}>
                Описание
              </Label>
              <Input
                type="text"
                name="description"
                placeholder="Введите описание"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                $hasError={touched.description && errors.description}
                $isValid={touched.description && !errors.description && values.description}
              />
            </FieldGroup>

            {/* Категория */}
            <FieldGroup>
              <Label $hasError={touched.category && errors.category}>
                Категория
              </Label>
              <CategoriesGrid>
                {categories.map(cat => (
                  <CategoryButton
                    key={cat.name}
                    type="button"
                    className={values.category === cat.name ? 'active' : ''}
                    onClick={() => {
                      // Создаём синтетическое событие для обновления значения и пометки touched
                      const syntheticEvent = { target: { name: 'category', value: cat.name } };
                      handleChange(syntheticEvent);
                      // Всегда вызываем blur, чтобы принудительно обновить touched и ошибку
                      handleBlur(syntheticEvent);
                    }}
                  >
                    {cat.icon}
                    {cat.name}
                  </CategoryButton>
                ))}
              </CategoriesGrid>
            </FieldGroup>

            {/* Дата */}
            <FieldGroup>
              <Label $hasError={touched.date && errors.date}>
                Дата
              </Label>
              <Input
                type="date"
                name="date"
                placeholder="Введите дату"
                value={values.date}
                onChange={handleChange}
                onBlur={handleBlur}
                $hasError={touched.date && errors.date}
                $isValid={touched.date && !errors.date && values.date}
              />
            </FieldGroup>

            {/* Сумма */}
            <FieldGroup>
              <Label $hasError={touched.amount && errors.amount}>
                Сумма
              </Label>
              <Input
                type="number"
                name="amount"
                placeholder="0 ₽"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                $hasError={touched.amount && errors.amount}
                $isValid={touched.amount && !errors.amount && values.amount}
              />
            </FieldGroup>

            <SubmitButton type="submit" $disabled={isButtonDisabled}>
              Добавить новый расход
            </SubmitButton>
          </Form>
        </FormContainer>
      </Container>
    </Page>
  );
};

export default ExpensesPage;