"use client";

import { useState } from "react";

import "./styles.css";

import IncomeTab from "./components/IncomeTab";
import PlanningTab from "./components/PlanningTab";
import ExpensesTab from "./components/ExpensesTab";
import StatsTab from "./components/StatsTab";

export default function Page() {
  const [activeTab, setActiveTab] =
    useState("income");

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

          {activeTab === "income" && (
            <IncomeTab />
          )}

          {activeTab === "planning" && (
            <PlanningTab />
          )}

          {activeTab === "expenses" && (
            <ExpensesTab />
          )}

          {activeTab === "stats" && (
            <StatsTab />
          )}

        </div>

        {/* NAVIGATION */}
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