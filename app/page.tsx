"use client";

import { useState } from "react";
import "./styles.css";

export default function Page() {
  const PROJECT_RATE = 0.75;
  const PROJECT_COEFFICIENT = 0.7;
  const REGULAR_RATE = 0.5;
  const AFTER_TAX_RATE = 0.86;

  const [activeTab, setActiveTab] =
    useState("income");

  // NUMBER VALUES
  const [baseSalary, setBaseSalary] =
    useState(2900);

  const [
    employmentRate,
    setEmploymentRate,
  ] = useState(1);

  const [
    workingHoursPrevMonth,
    setWorkingHoursPrevMonth,
  ] = useState(168);

  const [projectHours, setProjectHours] =
    useState(0);

  const [regularHours, setRegularHours] =
    useState(0);

  const [
    actualSalaryIncome,
    setActualSalaryIncome,
  ] = useState(0);

  const [
    actualAdvanceIncome,
    setActualAdvanceIncome,
  ] = useState(0);

  // INPUT VALUES
  const [
    baseSalaryInput,
    setBaseSalaryInput,
  ] = useState("4500");

  const [
    employmentRateInput,
    setEmploymentRateInput,
  ] = useState("1");

  const [
    workingHoursPrevMonthInput,
    setWorkingHoursPrevMonthInput,
  ] = useState("168");

  const [
    projectHoursInput,
    setProjectHoursInput,
  ] = useState("32");

  const [
    regularHoursInput,
    setRegularHoursInput,
  ] = useState("96");

  const [
    actualSalaryIncomeInput,
    setActualSalaryIncomeInput,
  ] = useState("0");

  const [
    actualAdvanceIncomeInput,
    setActualAdvanceIncomeInput,
  ] = useState("0");

  // INPUT HANDLER
  const handleInput = (
    value: string,
    setInput: (value: string) => void,
    setNumber: (value: number) => void
  ) => {
    const formatted =
      value.replace(",", ".");

    setInput(formatted);

    try {
      const result = Function(
        `"use strict"; return (${formatted})`
      )();

      if (!isNaN(result)) {
        setNumber(Number(result));
      }
    } catch {
      // Не делаем ничего,
      // пока формула не завершена
    }
  };

  // CALCULATIONS
  const projectIncome =
    (baseSalary /
      workingHoursPrevMonth) *
    projectHours *
    PROJECT_RATE *
    PROJECT_COEFFICIENT *
    AFTER_TAX_RATE;

  const regularIncome =
    (baseSalary /
      workingHoursPrevMonth) *
    regularHours *
    REGULAR_RATE *
    AFTER_TAX_RATE;

  const advanceIncome =
    baseSalary / 2;

  const salaryIncome =
    baseSalary *
      employmentRate *
      AFTER_TAX_RATE -
    advanceIncome +
    projectIncome +
    regularIncome;

  const totalKompoIncome =
    salaryIncome + advanceIncome;

  const totalActualIncome =
    actualSalaryIncome +
    actualAdvanceIncome;

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

            <div>

              <div className="mb-4">

                <h2 className="section-title">
                  Доходы
                </h2>

                <p className="section-subtitle">
                  Планируемые и фактические поступления
                </p>

              </div>

              {/* КОМПО */}
              <div className="card">

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    marginBottom: "16px",
                  }}
                >

                  <h3 className="card-title">
                    КОМПО
                  </h3>

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >

                    <div
                      style={{
                        marginBottom: "12px",
                      }}
                    >

                      <p className="card-label">
                        Планируемый доход
                      </p>

                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: 700,
                        }}
                      >
                        {totalKompoIncome.toFixed(
                          0
                        )}
                      </p>

                    </div>

                    <div>

                      <p className="card-label">
                        Фактический доход
                      </p>

                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: 700,
                        }}
                      >
                        {totalActualIncome.toFixed(
                          0
                        )}
                      </p>

                    </div>

                  </div>

                </div>

                {/* INPUTS */}
                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "12px",
                  }}
                >

                  {/* ОКЛАД */}
                  <div>

                    <p className="card-label">
                      Оклад
                    </p>

                    <input
                      type="text"
                      value={
                        baseSalaryInput
                      }
                      onFocus={(e) =>
                        e.target.select()
                      }
                      onChange={(e) =>
                        handleInput(
                          e.target.value,
                          setBaseSalaryInput,
                          setBaseSalary
                        )
                      }
                      className="input"
                    />

                  </div>

                  {/* СТАВКА */}
                  <div>

                    <p className="card-label">
                      Ставка
                    </p>

                    <input
                      type="text"
                      value={
                        employmentRateInput
                      }
                      onFocus={(e) =>
                        e.target.select()
                      }
                      onChange={(e) =>
                        handleInput(
                          e.target.value,
                          setEmploymentRateInput,
                          setEmploymentRate
                        )
                      }
                      className="input"
                    />

                  </div>

                  {/* ЧАСЫ */}
                  <div>

                    <p className="card-label">
                      Рабочих часов в прошлом месяце
                    </p>

                    <input
                      type="text"
                      value={
                        workingHoursPrevMonthInput
                      }
                      onFocus={(e) =>
                        e.target.select()
                      }
                      onChange={(e) =>
                        handleInput(
                          e.target.value,
                          setWorkingHoursPrevMonthInput,
                          setWorkingHoursPrevMonth
                        )
                      }
                      className="input"
                    />

                  </div>

                  {/* ПРОЕКТНЫЕ */}
                  <div>

                    <p className="card-label">
                      ПРОЕКТНЫЕ (часы)
                    </p>

                    <input
                      type="text"
                      value={
                        projectHoursInput
                      }
                      onFocus={(e) =>
                        e.target.select()
                      }
                      onChange={(e) =>
                        handleInput(
                          e.target.value,
                          setProjectHoursInput,
                          setProjectHours
                        )
                      }
                      className="input"
                    />

                  </div>

                  {/* РЕГУЛЯРНЫЕ */}
                  <div>

                    <p className="card-label">
                      РЕГУЛЯРНЫЕ (часы)
                    </p>

                    <input
                      type="text"
                      value={
                        regularHoursInput
                      }
                      onFocus={(e) =>
                        e.target.select()
                      }
                      onChange={(e) =>
                        handleInput(
                          e.target.value,
                          setRegularHoursInput,
                          setRegularHours
                        )
                      }
                      className="input"
                    />

                  </div>

                </div>

                {/* FACT */}
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "12px",
                  }}
                >

                  <div>

                    <p className="card-label">
                      Фактическая зарплата
                    </p>

                    <input
                      type="text"
                      value={
                        actualSalaryIncomeInput
                      }
                      onFocus={(e) =>
                        e.target.select()
                      }
                      onChange={(e) =>
                        handleInput(
                          e.target.value,
                          setActualSalaryIncomeInput,
                          setActualSalaryIncome
                        )
                      }
                      className="input"
                    />

                  </div>

                  <div>

                    <p className="card-label">
                      Фактический аванс
                    </p>

                    <input
                      type="text"
                      value={
                        actualAdvanceIncomeInput
                      }
                      onFocus={(e) =>
                        e.target.select()
                      }
                      onChange={(e) =>
                        handleInput(
                          e.target.value,
                          setActualAdvanceIncomeInput,
                          setActualAdvanceIncome
                        )
                      }
                      className="input"
                    />

                  </div>

                </div>

                {/* RESULTS */}
                <div className="results">

                  <div className="result-row">

                    <span className="result-label">
                      Проектные
                    </span>

                    <span className="result-value">
                      {projectIncome.toFixed(
                        0
                      )}
                    </span>

                  </div>

                  <div className="result-row">

                    <span className="result-label">
                      Регулярные
                    </span>

                    <span className="result-value">
                      {regularIncome.toFixed(
                        0
                      )}
                    </span>

                  </div>

                  <div className="result-row">

                    <span className="result-label">
                      Зарплата
                    </span>

                    <span className="result-value">
                      {salaryIncome.toFixed(
                        0
                      )}
                    </span>

                  </div>

                  <div className="result-row">

                    <span className="result-label">
                      Аванс
                    </span>

                    <span className="result-value">
                      {advanceIncome.toFixed(
                        0
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* ПЛАН */}
          {activeTab === "planning" && (

            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
                color: "#6b7280",
              }}
            >
              Планирование
            </div>

          )}

          {/* РАСХОДЫ */}
          {activeTab === "expenses" && (

            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
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
                alignItems: "center",
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