"use client";

import { useState, useEffect } from "react";  // ← ДОБАВИТЬ useEffect в импорт

import IncomeTab from "./tabs/IncomeTab";
import PlanningTab from "./tabs/PlanningTab";
import ExpensesTab from "./tabs/ExpensesTab";
import StatsTab from "./tabs/StatsTab";

import "./styles.css";

export type Expense = {
  id: number;
  name: string;
  amount: number;
  required: boolean;
};

export default function Page() {
  const [activeTab, setActiveTab] = useState("income");

  // ДОХОДЫ
  const [totalPlannedIncome, setTotalPlannedIncome] = useState(0);
  const [totalActualCombinedIncome, setTotalActualCombinedIncome] = useState(0);
  const [combinedIncome, setCombinedIncome] = useState(0);

  // ПЛАН
  const [periodOneExpenses, setPeriodOneExpenses] = useState<Expense[]>([]);
  const [periodTwoExpenses, setPeriodTwoExpenses] = useState<Expense[]>([]);

  
  // 1. ЗАГРУЗКА ДАННЫХ ПРИ СТАРТЕ
  useEffect(() => {
    const saved = localStorage.getItem("householdBudget");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPeriodOneExpenses(data.periodOneExpenses || []);
        setPeriodTwoExpenses(data.periodTwoExpenses || []);
        setTotalPlannedIncome(data.totalPlannedIncome || 0);
        setTotalActualCombinedIncome(data.totalActualCombinedIncome || 0);
        setCombinedIncome(data.combinedIncome || 0);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    }
  }, []); // Пустой массив = выполняется только один раз при загрузке

  // 2. СОХРАНЕНИЕ ДАННЫХ ПРИ ИЗМЕНЕНИИ
  useEffect(() => {
    const data = {
      periodOneExpenses,
      periodTwoExpenses,
      totalPlannedIncome,
      totalActualCombinedIncome,
      combinedIncome,
    };
    localStorage.setItem("householdBudget", JSON.stringify(data));
  }, [
    periodOneExpenses, 
    periodTwoExpenses, 
    totalPlannedIncome, 
    totalActualCombinedIncome, 
    combinedIncome
  ]); // Срабатывает при изменении любой из этих переменных



  const tabs = [
    { id: "income", label: "Доходы" },
    { id: "planning", label: "План" },
    { id: "expenses", label: "Расходы" },
    { id: "stats", label: "Статистика" },
  ];

  return (
    <div className="app-container">
      <div className="phone-frame">
        {/* HEADER */}
        <div className="header">
          <div>
            <p className="header-subtitle">Текущий период</p>
            <h1 className="header-title">Май 2026</h1>
          </div>
          <button className="month-button">М</button>
        </div>

        {/* CONTENT */}
        <div className="content">
          {activeTab === "income" && (
            <IncomeTab
              onTotalsChange={(planned, actual) => {
                setTotalPlannedIncome(planned);
                setTotalActualCombinedIncome(actual);
              }}
              onCombinedIncomeChange={(value) => setCombinedIncome(value)}
            />
          )}

          {activeTab === "planning" && (
            <PlanningTab
              totalPlannedIncome={totalPlannedIncome}
              periodOneExpenses={periodOneExpenses}
              setPeriodOneExpenses={setPeriodOneExpenses}
              periodTwoExpenses={periodTwoExpenses}
              setPeriodTwoExpenses={setPeriodTwoExpenses}
            />
          )}

          {activeTab === "expenses" && (
            <ExpensesTab
              totalPlannedIncome={combinedIncome}
              totalActualIncome={totalActualCombinedIncome}
              periodOneExpenses={periodOneExpenses}
              periodTwoExpenses={periodTwoExpenses}
            />
          )}

          {activeTab === "stats" && <StatsTab />}
        </div>

        {/* BOTTOM NAV */}
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