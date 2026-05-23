"use client";

import { useState, useRef, useEffect } from "react";
import "./styles.css";

export default function Page() {
  const PROJECT_RATE = 0.75;
  const PROJECT_COEFFICIENT = 0.7;
  const REGULAR_RATE = 0.5;
  const AFTER_TAX_RATE = 0.86;

  const [activeTab, setActiveTab] = useState("income");

  const [baseSalary, setBaseSalary] = useState(4500);
  const [employmentRate, setEmploymentRate] = useState(1);
  const [workingHoursPrevMonth, setWorkingHoursPrevMonth] =
    useState(168);

  const [projectHours, setProjectHours] = useState(32);
  const [regularHours, setRegularHours] = useState(96);

  const [actualSalaryIncome, setActualSalaryIncome] =
    useState(0);

  const [actualAdvanceIncome, setActualAdvanceIncome] =
    useState(0);

  // MODAL
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [modalValue, setModalValue] =
    useState("");

  const [modalField, setModalField] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  // AUTO SELECT
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isModalOpen]);

  // CALCULATIONS
  const projectIncome =
    (baseSalary / workingHoursPrevMonth) *
    projectHours *
    PROJECT_RATE *
    PROJECT_COEFFICIENT *
    AFTER_TAX_RATE;

  const regularIncome =
    (baseSalary / workingHoursPrevMonth) *
    regularHours *
    REGULAR_RATE *
    AFTER_TAX_RATE;

  const advanceIncome = baseSalary / 2;

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
    actualSalaryIncome + actualAdvanceIncome;

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

  // OPEN MODAL
  const openEditModal = (
    field: string,
    value: number
  ) => {
    setModalField(field);
    setModalValue(String(value));
    setIsModalOpen(true);
  };

  // SAVE VALUE
  const saveModalValue = () => {
    let result = 0;

    try {
      result = Function(
        `"use strict"; return (${modalValue})`
      )();
    } catch {
      result = Number(modalValue);
    }

    if (isNaN(result)) {
      result = 0;
    }

    switch (modalField) {
      case "baseSalary":
        setBaseSalary(result);
        break;

      case "employmentRate":
        setEmploymentRate(result);
        break;

      case "workingHoursPrevMonth":
        setWorkingHoursPrevMonth(result);
        break;

      case "projectHours":
        setProjectHours(result);
        break;

      case "regularHours":
        setRegularHours(result);
        break;
    }

    setIsModalOpen(false);
  };

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

              <div style={{ marginBottom: "16px" }}>

                <h2 className="section-title">
                  Доходы
                </h2>

                <p className="section-subtitle">
                  Планируемые и фактические поступления
                </p>

              </div>

              {/* CARD */}
              <div className="card">

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "flex-start",
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
                        {totalKompoIncome.toFixed(0)}
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
                        {totalActualIncome.toFixed(0)}
                      </p>

                    </div>

                  </div>

                </div>

                {/* INPUTS */}
                <div className="inputs-column">

                  {/* ОКЛАД */}
                  <div>

                    <p className="card-label">
                      Оклад
                    </p>

                    <div className="input-row">

                      <input
                        type="text"
                        value={baseSalary}
                        readOnly
                        className="input"
                      />

                      <button
                        className="edit-button"
                        onClick={() =>
                          openEditModal(
                            "baseSalary",
                            baseSalary
                          )
                        }
                      >
                        ✎
                      </button>

                    </div>

                  </div>

                  {/* СТАВКА */}
                  <div>

                    <p className="card-label">
                      Ставка
                    </p>

                    <div className="input-row">

                      <input
                        type="text"
                        value={employmentRate}
                        readOnly
                        className="input"
                      />

                      <button
                        className="edit-button"
                        onClick={() =>
                          openEditModal(
                            "employmentRate",
                            employmentRate
                          )
                        }
                      >
                        ✎
                      </button>

                    </div>

                  </div>

                  {/* ЧАСЫ */}
                  <div>

                    <p className="card-label">
                      Рабочих часов
                    </p>

                    <div className="input-row">

                      <input
                        type="text"
                        value={
                          workingHoursPrevMonth
                        }
                        readOnly
                        className="input"
                      />

                      <button
                        className="edit-button"
                        onClick={() =>
                          openEditModal(
                            "workingHoursPrevMonth",
                            workingHoursPrevMonth
                          )
                        }
                      >
                        ✎
                      </button>

                    </div>

                  </div>

                  {/* ПРОЕКТНЫЕ */}
                  <div>

                    <p className="card-label">
                      ПРОЕКТНЫЕ
                    </p>

                    <div className="input-row">

                      <input
                        type="text"
                        value={projectHours}
                        readOnly
                        className="input"
                      />

                      <button
                        className="edit-button"
                        onClick={() =>
                          openEditModal(
                            "projectHours",
                            projectHours
                          )
                        }
                      >
                        ✎
                      </button>

                    </div>

                  </div>

                  {/* РЕГУЛЯРНЫЕ */}
                  <div>

                    <p className="card-label">
                      РЕГУЛЯРНЫЕ
                    </p>

                    <div className="input-row">

                      <input
                        type="text"
                        value={regularHours}
                        readOnly
                        className="input"
                      />

                      <button
                        className="edit-button"
                        onClick={() =>
                          openEditModal(
                            "regularHours",
                            regularHours
                          )
                        }
                      >
                        ✎
                      </button>

                    </div>

                  </div>

                </div>

                {/* FACT */}
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >

                  <div>

                    <p className="card-label">
                      Фактическая зарплата
                    </p>

                    <input
                      type="number"
                      value={
                        actualSalaryIncome
                      }
                      onChange={(e) =>
                        setActualSalaryIncome(
                          Number(
                            e.target.value
                          )
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
                      type="number"
                      value={
                        actualAdvanceIncome
                      }
                      onChange={(e) =>
                        setActualAdvanceIncome(
                          Number(
                            e.target.value
                          )
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
                      {projectIncome.toFixed(0)}
                    </span>

                  </div>

                  <div className="result-row">

                    <span className="result-label">
                      Регулярные
                    </span>

                    <span className="result-value">
                      {regularIncome.toFixed(0)}
                    </span>

                  </div>

                  <div className="result-row">

                    <span className="result-label">
                      Зарплата
                    </span>

                    <span className="result-value">
                      {salaryIncome.toFixed(0)}
                    </span>

                  </div>

                  <div className="result-row">

                    <span className="result-label">
                      Аванс
                    </span>

                    <span className="result-value">
                      {advanceIncome.toFixed(0)}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* ПЛАН */}
          {activeTab === "planning" && (
            <div className="empty-tab">
              План
            </div>
          )}

          {/* РАСХОДЫ */}
          {activeTab === "expenses" && (
            <div className="empty-tab">
              Расходы
            </div>
          )}

          {/* СТАТИСТИКА */}
          {activeTab === "stats" && (
            <div className="empty-tab">
              Статистика
            </div>
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

        {/* MODAL */}
        {isModalOpen && (

          <div className="modal-overlay">

            <div className="modal-window">

              <h3 className="modal-title">
                Редактирование
              </h3>

              <input
                ref={inputRef}
                type="text"
                value={modalValue}
                onChange={(e) =>
                  setModalValue(
                    e.target.value
                  )
                }
                className="modal-input"
              />

              <div className="modal-buttons">

                <button
                  className="cancel-button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                >
                  Отмена
                </button>

                <button
                  className="ok-button"
                  onClick={saveModalValue}
                >
                  OK
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}