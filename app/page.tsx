"use client";

import { useState } from "react";

import "./styles.css";

import IncomeTab from "./tabs/IncomeTab";
import PlanningTab from "./tabs/PlanningTab";
import ExpensesTab from "./tabs/ExpensesTab";

export type Expense = {
  id: number;

  name: string;

  amount: number;

  required: boolean;
};

export default function Page() {
  const [activeTab, setActiveTab] =
    useState("income");

  // ОБЩИЙ ДОХОД
  const [
    combinedIncome,
    setCombinedIncome,
  ] = useState(0);

  // ПЛАН 7 → 19
  const [
    periodOneExpenses,
    setPeriodOneExpenses,
  ] = useState<Expense[]>([]);

  // ПЛАН 19 → 7
  const [
    periodTwoExpenses,
    setPeriodTwoExpenses,
  ] = useState<Expense[]>([]);

  const tabs = [
    {
      id: "income",
      label: "Доходы",
    },

    {
      id: "planning",
      label: "План",
    },

    {
      id: "expenses",
      label: "Расходы",
    },

    {
      id: "stats",
      label: "Статистика",
    },
  ];

  return (
    <div className="app-container">

      <div className="phone-frame">

        {/* HEADER */}
        <div className="header">

          <div>

            <p className="header-subtitle">
              Текущий период
            </p>

            <h1 className="header-title">
              Май 2026
            </h1>

          </div>

          <button className="month-button">
            М
          </button>

        </div>

        {/* CONTENT */}
        <div className="content">

          {/* ДОХОДЫ */}
          {activeTab === "income" && (

            <IncomeTab
              onCombinedIncomeChange={
                setCombinedIncome
              }
            />

          )}

          {/* ПЛАН */}
          {activeTab === "planning" && (

            <PlanningTab
              totalPlannedIncome={
                combinedIncome
              }
              periodOneExpenses={
                periodOneExpenses
              }
              setPeriodOneExpenses={
                setPeriodOneExpenses
              }
              periodTwoExpenses={
                periodTwoExpenses
              }
              setPeriodTwoExpenses={
                setPeriodTwoExpenses
              }
            />

          )}

          {/* РАСХОДЫ */}
          {activeTab === "expenses" && (

            <ExpensesTab
              totalPlannedIncome={
                combinedIncome
              }
              periodOneExpenses={
                periodOneExpenses
              }
              periodTwoExpenses={
                periodTwoExpenses
              }
            />

          )}

          {/* СТАТИСТИКА */}
          {activeTab === "stats" && (

            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                color: "#6b7280",
              }}
            >
              Статистика
            </div>

          )}

        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="bottom-nav">

          {tabs.map((tab) => (

            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id)
              }
              className={
                activeTab === tab.id
                  ? "nav-button active"
                  : "nav-button"
              }
            >
              {tab.label}
            </button>

          ))}

        </div>

      </div>

    </div>
  );
}