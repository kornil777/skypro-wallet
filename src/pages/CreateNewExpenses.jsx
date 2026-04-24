/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiTrash2 } from "react-icons/fi";
import {
  FaUtensils,
  FaHome,
  FaGraduationCap,
  FaCar,
  FaFilm,
  FaEllipsisH,
} from "react-icons/fa";
import { useFormValidation } from "../hooks/useFormValidation";
import { Input, SubmitButton } from "../styles/FormStyles";
import { getExpenses, addExpense } from "../api/expensesApi";
import { useAuth } from "../context/AuthContext";
import iconME from "../assets/iconMyExpenses.svg"
import { Link } from "react-router-dom";
import { usePageName } from '/src/context/MenuNavMobileContext';
const categories = [
  { name: "Еда", icon: <FaUtensils /> },
  { name: "транспорт", icon: <FaCar /> },
  { name: "жилье", icon: <FaHome /> },
  { name: "развлечение", icon: <FaFilm /> },
  { name: "образование", icon: <FaGraduationCap /> },
  { name: "другое", icon: <FaEllipsisH /> },
];

const Page = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f4f5f6;
  min-height: calc(100vh - 64px);
  @media screen and (max-width: 495px) {
    background-color: white;
    padding: 24px 0;
    width: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  gap: 34px;
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
  @media screen and (max-width: 495px) {
    display: block;
    padding: 0 16px;
    box-shadow: none;
    height: auto;
  }
`;

const FormTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
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
  font-family: "Montserrat", sans-serif;
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
  @media screen and (max-width: 495px) {
    width: 100%;
  }
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
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: #666;
  @media screen and (max-width: 495px) {
    font-size: 14px;
  }
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

const LogoImg = styled.img`
  @media screen and (max-width: 495px) {
  width:106px;
  height:18px;
  margin-bottom: 8px;
}
`;

const validationRules = {
  description: {
    required: true,
    message: "Введите описание",
  },
  category: {
    required: true,
    message: "Выберите категорию",
  },
  date: {
    required: true,
    message: "Введите дату",
  },
  amount: {
    required: true,
    pattern: /^\d+(\.\d{1,2})?$/,
    message: "Введите корректную сумму (только цифры)",
  },
};

const NewExpensePageMobile = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isSubmitFailed, setIsSubmitFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setPageNameInNav } = usePageName();
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
    { description: "", category: "", date: "", amount: "" },
    validationRules
  );

  useEffect(() => {
    setPageNameInNav("Новый расход")
    const loadExpenses = async () => {
      if (!user) return;
      const data = await getExpenses();
      setExpenses(data);
      setLoading(false);
    };
    loadExpenses();
  }, [user]);

  useEffect(() => {
    if (isSubmitFailed && isFormValid()) {
      setIsSubmitFailed(false);
    }
  }, [values, errors, isSubmitFailed, isFormValid]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setAllTouched();
    const isValid = validateAll();
    if (!isValid) {
      setIsSubmitFailed(true);
      return;
    }

    const newExpense = {
      description: values.description,
      category: values.category,
      date: values.date,
      amount: parseFloat(values.amount),
    };

    const added = await addExpense(newExpense);
    setExpenses([added, ...expenses]);
    resetForm();
    setIsSubmitFailed(false);
  };

  const isButtonDisabled = isSubmitFailed;

  if (loading) {
    return <Page>Загрузка...</Page>;
  }

  return (
    <Page>
      <Container>
        <FormContainer>
          <Link to="/myExpenses"><LogoImg src={iconME} alt="SkyproWallet" /></Link>
          <FormTitle>Новый расход</FormTitle>
          <Form onSubmit={handleAddExpense}>
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
                $isValid={
                  touched.description &&
                  !errors.description &&
                  values.description
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label $hasError={touched.category && errors.category}>
                Категория
              </Label>
              <CategoriesGrid>
                {categories.map((cat) => (
                  <CategoryButton
                    key={cat.name}
                    type="button"
                    className={values.category === cat.name ? "active" : ""}
                    onClick={() => {
                      const syntheticEvent = {
                        target: { name: "category", value: cat.name },
                      };
                      handleChange(syntheticEvent);
                      handleBlur(syntheticEvent);
                    }}
                  >
                    {cat.icon}
                    {cat.name}
                  </CategoryButton>
                ))}
              </CategoriesGrid>
            </FieldGroup>

            <FieldGroup>
              <Label $hasError={touched.date && errors.date}>Дата</Label>
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

            <FieldGroup>
              <Label $hasError={touched.amount && errors.amount}>Сумма</Label>
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

export default NewExpensePageMobile;
