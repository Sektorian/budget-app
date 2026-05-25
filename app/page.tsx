"use client";

import { useState } from "react";

import IncomeTab from "./tabs/IncomeTab";
import PlanningTab from "./tabs/PlanningTab";

import "./styles.css";

export default function Page() {
  const [activeTab, setActiveTab] =
    useState("income");

  const [
    totalPlannedIncome,
    setTotalPlannedIncome,
  ] = useState(0);

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
              onPlannedIncomeChange={
                setTotalPlannedIncome
              }
            />

          )}

          {/* ПЛАН */}
          {activeTab === "planning" && (

            <PlanningTab
              totalPlannedIncome={
                totalPlannedIncome
              }
            />

          )}

          {/* РАСХОДЫ */}
          {activeTab === "expenses" && (

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
              Расходы
            </div>

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