"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import IncomeTab from "./tabs/IncomeTab";
import PlanningTab from "./tabs/PlanningTab";
import ExpensesTab from "./tabs/ExpensesTab";
import StatsTab from "./tabs/StatsTab";
import MonthPicker from "./components/MonthPicker";

export type Expense = {
  id: string;
  name: string;
  amount: number;
  required: boolean;
};

export type ActualExpense = {
  id: string;
  expenseId: string;
  actualAmount: number;
};

export type ExtraExpense = {
  id: string;
  name: string;
  amount: number;
  required: boolean;
};

export type IncomeData = {
  id: string;
  baseSalary: number;
  employmentRate: number;
  workingHoursPrevMonth: number;
  projectHours: number;
  regularHours: number;
  actualSalaryIncome: number;
  actualAdvanceIncome: number;
  altagammaPlanned: number;
  altagammaActual: number;
  bonusPlanned: number;
  bonusActual: number;
};

const getCurrentYearMonth = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const formatYearMonth = (year: number, month: number): string => {
  return `${year}-${String(month).padStart(2, '0')}`;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("income");
  const [loading, setLoading] = useState(true);
  
  const [selectedYearMonth, setSelectedYearMonth] = useState(getCurrentYearMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [totalPlannedIncome, setTotalPlannedIncome] = useState(0);
  const [totalActualCombinedIncome, setTotalActualCombinedIncome] = useState(0);
  const [combinedIncome, setCombinedIncome] = useState(0);
  const [incomeData, setIncomeData] = useState<IncomeData | null>(null);

  const [periodOneExpenses, setPeriodOneExpenses] = useState<Expense[]>([]);
  const [periodTwoExpenses, setPeriodTwoExpenses] = useState<Expense[]>([]);
  const [actualExpenses, setActualExpenses] = useState<ActualExpense[]>([]);
  const [extraExpenses, setExtraExpenses] = useState<ExtraExpense[]>([]);

  const getCollectionName = (baseName: string): string => {
    return `${baseName}_${selectedYearMonth}`;
  };

  // Функция копирования обязательных расходов
  const copyMandatoryExpensesToMonth = async (targetYearMonth: string) => {
    try {
      const periodOneCollection = getCollectionName("periodOneExpenses");
      const periodOneSnapshot = await getDocs(collection(db, periodOneCollection));
      const mandatoryPeriodOne = periodOneSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Expense))
        .filter(expense => expense.required === true);
      
      const periodTwoCollection = getCollectionName("periodTwoExpenses");
      const periodTwoSnapshot = await getDocs(collection(db, periodTwoCollection));
      const mandatoryPeriodTwo = periodTwoSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Expense))
        .filter(expense => expense.required === true);
      
      const targetPeriodOneCollection = `periodOneExpenses_${targetYearMonth}`;
      const targetPeriodTwoCollection = `periodTwoExpenses_${targetYearMonth}`;
      
      for (const expense of mandatoryPeriodOne) {
        await addDoc(collection(db, targetPeriodOneCollection), {
          name: expense.name,
          amount: expense.amount,
          required: true,
        });
      }
      
      for (const expense of mandatoryPeriodTwo) {
        await addDoc(collection(db, targetPeriodTwoCollection), {
          name: expense.name,
          amount: expense.amount,
          required: true,
        });
      }
      
      console.log(`Скопировано ${mandatoryPeriodOne.length + mandatoryPeriodTwo.length} обязательных расходов`);
    } catch (error) {
      console.error("Ошибка при копировании:", error);
    }
  };

  // Подписки на Firebase
  useEffect(() => {
    setLoading(true);
    
    const periodOneCollection = getCollectionName("periodOneExpenses");
    const periodTwoCollection = getCollectionName("periodTwoExpenses");
    const actualCollection = getCollectionName("actualExpenses");
    const extraCollection = getCollectionName("extraExpenses");
    const incomeCollection = getCollectionName("incomeData");

    const unsubscribe1 = onSnapshot(collection(db, periodOneCollection), (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setPeriodOneExpenses(expenses);
    });

    const unsubscribe2 = onSnapshot(collection(db, periodTwoCollection), (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setPeriodTwoExpenses(expenses);
    });

    const unsubscribe3 = onSnapshot(collection(db, actualCollection), (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActualExpense));
      setActualExpenses(expenses);
    });

    const unsubscribe4 = onSnapshot(collection(db, extraCollection), (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExtraExpense));
      setExtraExpenses(expenses);
      setLoading(false);
    });

    const unsubscribe5 = onSnapshot(collection(db, incomeCollection), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IncomeData));
      if (data.length > 0) {
        setIncomeData(data[0]);
      } else {
        setIncomeData(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
      unsubscribe4();
      unsubscribe5();
    };
  }, [selectedYearMonth]);

  const handleMonthChange = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedYearMonth(formatYearMonth(year, month));
  };

  // Firebase операции
  const addPlannedExpense = async (period: 'periodOneExpenses' | 'periodTwoExpenses', expense: Omit<Expense, 'id'>) => {
    const collectionName = getCollectionName(period);
    await addDoc(collection(db, collectionName), expense);
  };

  const updatePlannedExpense = async (period: 'periodOneExpenses' | 'periodTwoExpenses', id: string, data: Partial<Expense>) => {
    const collectionName = getCollectionName(period);
    await updateDoc(doc(db, collectionName, id), data);
  };

  const deletePlannedExpense = async (period: 'periodOneExpenses' | 'periodTwoExpenses', id: string) => {
    const collectionName = getCollectionName(period);
    await deleteDoc(doc(db, collectionName, id));
  };

  const updateActualExpense = async (expenseId: string, actualAmount: number) => {
    const collectionName = getCollectionName("actualExpenses");
    
    try {
      // Ищем существующий документ с таким expenseId
      const q = query(collection(db, collectionName), where("expenseId", "==", expenseId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        // Обновляем существующий документ
        const docRef = doc(db, collectionName, snapshot.docs[0].id);
        await updateDoc(docRef, { actualAmount });
        console.log(`Обновлён расход ${expenseId}: ${actualAmount}`);
      } else {
        // Создаём новый документ
        await addDoc(collection(db, collectionName), {
          expenseId: expenseId,
          actualAmount: actualAmount,
        });
        console.log(`Создан новый расход ${expenseId}: ${actualAmount}`);
      }
    } catch (error) {
      console.error("Ошибка при обновлении фактического расхода:", error);
    }
  };

  const addExtraExpense = async (expense: Omit<ExtraExpense, 'id'>) => {
    const collectionName = getCollectionName("extraExpenses");
    await addDoc(collection(db, collectionName), expense);
  };

  const updateExtraExpense = async (id: string, data: Partial<ExtraExpense>) => {
    const collectionName = getCollectionName("extraExpenses");
    await updateDoc(doc(db, collectionName, id), data);
  };

  const deleteExtraExpense = async (id: string) => {
    const collectionName = getCollectionName("extraExpenses");
    await deleteDoc(doc(db, collectionName, id));
  };

  const updateIncomeData = async (data: Omit<IncomeData, 'id'>) => {
    const collectionName = getCollectionName("incomeData");
    if (incomeData?.id) {
      await updateDoc(doc(db, collectionName, incomeData.id), data);
    } else {
      await addDoc(collection(db, collectionName), data);
    }
  };

  const handleCopyToNextMonth = async () => {
    let nextYear = selectedYear;
    let nextMonth = selectedMonth + 1;
    if (nextMonth > 12) {
      nextYear = selectedYear + 1;
      nextMonth = 1;
    }
    const nextYearMonth = formatYearMonth(nextYear, nextMonth);
    
    await copyMandatoryExpensesToMonth(nextYearMonth);
    alert(`Обязательные расходы скопированы на ${nextMonth}.${nextYear}`);
  };

  const totalPlannedExpensesSum = [...periodOneExpenses, ...periodTwoExpenses].reduce((sum, e) => sum + e.amount, 0);
  const actualExpensesSum = actualExpenses.reduce((sum, item) => sum + item.actualAmount, 0);
  const extraExpensesSum = extraExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalFactExpenses = actualExpensesSum + extraExpensesSum;
  const balance = totalActualCombinedIncome - totalFactExpenses;

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const tabs = [
    { id: "income", label: "Доходы" },
    { id: "planning", label: "План" },
    { id: "expenses", label: "Расходы" },
    { id: "stats", label: "Статистика" },
  ];

  if (loading) {
    return (
      <div className="app-container">
        <div className="phone-frame">
          <div style={{ padding: "20px", textAlign: "center" }}>Загрузка данных...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="phone-frame">
        <div className="header">
          <div>
            <p className="header-subtitle">Текущий период</p>
            <h1 className="header-title">
              {monthNames[selectedMonth - 1]} {selectedYear}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleCopyToNextMonth}
              className="month-button"
              style={{ width: "auto", padding: "0 12px", fontSize: "12px" }}
              title="Скопировать обязательные расходы на следующий месяц"
            >
              📋 Копировать
            </button>
            <MonthPicker
              year={selectedYear}
              month={selectedMonth}
              onMonthChange={handleMonthChange}
            />
          </div>
        </div>

        <div className="content">
          {activeTab === "income" && (
            <IncomeTab
              incomeData={incomeData}
              onUpdateIncome={updateIncomeData}
              onTotalsChange={(planned, actual) => {
                setTotalPlannedIncome(planned);
                setTotalActualCombinedIncome(actual);
              }}
              onCombinedIncomeChange={setCombinedIncome}
            />
          )}

          {activeTab === "planning" && (
            <PlanningTab
              totalPlannedIncome={totalPlannedIncome}
              periodOneExpenses={periodOneExpenses}
              periodTwoExpenses={periodTwoExpenses}
              addExpenseToFirebase={addPlannedExpense}
              updateExpenseInFirebase={updatePlannedExpense}
              deleteExpenseFromFirebase={deletePlannedExpense}
              combinedIncome={combinedIncome}
            />
          )}

          {activeTab === "expenses" && (
            <ExpensesTab
              totalPlannedIncome={combinedIncome}
              totalActualIncome={totalActualCombinedIncome}
              periodOneExpenses={periodOneExpenses}
              periodTwoExpenses={periodTwoExpenses}
              actualExpenses={actualExpenses}
              extraExpenses={extraExpenses}
              onUpdateActualExpense={updateActualExpense}
              onAddExtraExpense={addExtraExpense}
              onUpdateExtraExpense={updateExtraExpense}
              onDeleteExtraExpense={deleteExtraExpense}
            />
          )}

          {activeTab === "stats" && (
            <StatsTab />
          )}
        </div>

        <div className="bottom-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? "nav-button active" : "nav-button"}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}