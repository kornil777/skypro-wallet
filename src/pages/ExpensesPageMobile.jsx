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
import { getExpenses, deleteExpense } from "../api/expensesApi";
import { useAuth } from "../context/AuthContext";
import iconNE from "../assets/iconNewExpenses.svg"
import { Link } from "react-router-dom";
import { usePageName } from "../context/MenuNavMobileContext";

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
  @media screen and (max-width: 495px) {
    width: 100%;
    padding: 0 0;
    box-shadow: none;
    display: block;
    height: auto;
  }
`;

const TableTitle = styled.h3`
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  color: #333;
  margin-bottom: 16px;
  flex-shrink: 0;
  @media screen and (max-width: 495px) {
    padding-left: 16px;
  }
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
  font-family: "Montserrat", sans-serif;
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
  @media screen and (max-width: 495px) {
    font-size: 10px;
    font-weight: 400;
    ${props => props.right && `
      text-align: right;
    `}
    ${props => props.none && `
      display: none;
    `}
  }
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
  @media screen and (max-width: 495px) {
    font-size: 10px;
    font-weight: 400;
    ${props => props.right && `
      text-align: right;
    `}
    ${props => props.none && `
      display: none;
    `}
  }
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

const LogoImg = styled.img`
  @media screen and (max-width: 495px) {
  position: absolute;
  right:16px;
  top: 88px;
  width:112px;
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

const ExpensesPageMobile = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isSubmitFailed, setIsSubmitFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setPageNameInNav } = usePageName();
  const {
    values,
    errors,
    isFormValid,
  } = useFormValidation(
    { description: "", category: "", date: "", amount: "" },
    validationRules
  );

  useEffect(() => {
    setPageNameInNav("Мои расходы")
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

  const handleDelete = async (id) => {
    if (window.confirm("Удалить расход?")) {
      await deleteExpense(id);
      setExpenses(expenses.filter((exp) => exp.id !== id));
    }
  };

  if (loading) {
    return <Page>Загрузка...</Page>;
  }

  return (
    <Page>
      <Container>
        <TableContainer>
          <TableTitle>Мои расходы</TableTitle>
          <Link to="/newExpenses"><LogoImg src={iconNE} alt="SkyproWallet" /></Link>
          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <TableHeader>Описание</TableHeader>
                  <TableHeader>Категория</TableHeader>
                  <TableHeader right>Дата</TableHeader>
                  <TableHeader right>Сумма</TableHeader>
                  <TableHeader none></TableHeader>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell>{exp.description}</TableCell>
                    <TableCell>{exp.category}</TableCell>
                    <TableCell right>{exp.date}</TableCell>
                    <TableCell right>{exp.amount} ₽</TableCell>
                    <TableCell none>
                      <DeleteIcon onClick={() => handleDelete(exp.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StyledTable>
          </TableWrapper>
        </TableContainer>
      </Container>
    </Page>
  );
};

export default ExpensesPageMobile;
//