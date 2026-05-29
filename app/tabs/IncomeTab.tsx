"use client";

import { useEffect, useState } from "react";

type IncomeTabProps = {
  onTotalsChange: (planned: number, actual: number) => void;
  onCombinedIncomeChange: (value: number) => void;
};

export default function IncomeTab({
  onTotalsChange,
  onCombinedIncomeChange,
}: IncomeTabProps) {
  const PROJECT_RATE = 0.75;
  const PROJECT_COEFFICIENT = 0.7;
  const REGULAR_RATE = 0.5;
  const AFTER_TAX_RATE = 0.86;

  // COLLAPSE
  const [kompoCollapsed, setKompoCollapsed] = useState(true);
  const [altagammaCollapsed, setAltagammaCollapsed] = useState(true);
  const [bonusCollapsed, setBonusCollapsed] = useState(true);

  // КОМПО
  const [baseSalary, setBaseSalary] = useState(2900);
  const [employmentRate, setEmploymentRate] = useState(1);
  const [workingHoursPrevMonth, setWorkingHoursPrevMonth] = useState(168);
  const [projectHours, setProjectHours] = useState(0);
  const [regularHours, setRegularHours] = useState(0);
  const [actualSalaryIncome, setActualSalaryIncome] = useState(0);
  const [actualAdvanceIncome, setActualAdvanceIncome] = useState(0);

  // АЛЬТАГАММА
  const [altagammaPlanned, setAltagammaPlanned] = useState(0);
  const [altagammaActual, setAltagammaActual] = useState(0);

  // ПРЕМИЯ
  const [bonusPlanned, setBonusPlanned] = useState(0);
  const [bonusActual, setBonusActual] = useState(0);

  // БЕЗОПАСНЫЙ ПАРСИНГ ЧИСЕЛ
  const calculateValue = (value: string): number => {
    const cleaned = value.trim().replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // КОМПО РАСЧЁТЫ
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
    baseSalary * employmentRate * AFTER_TAX_RATE -
    advanceIncome +
    projectIncome +
    regularIncome;

  const totalKompoIncome = salaryIncome + advanceIncome;
  const totalActualIncome = actualSalaryIncome + actualAdvanceIncome;

  // КОМБИНИРОВАННЫЕ ДОХОДЫ
  const kompoCombinedIncome =
    (actualSalaryIncome > 0 ? actualSalaryIncome : salaryIncome) +
    (actualAdvanceIncome > 0 ? actualAdvanceIncome : advanceIncome);

  const altagammaCombinedIncome = altagammaActual > 0 ? altagammaActual : altagammaPlanned;
  const bonusCombinedIncome = bonusActual > 0 ? bonusActual : bonusPlanned;

  // ИТОГО
  const totalPlannedIncome = totalKompoIncome + altagammaPlanned + bonusPlanned;
  const totalActualCombinedIncome = totalActualIncome + altagammaActual + bonusActual;
  const combinedIncome = kompoCombinedIncome + altagammaCombinedIncome + bonusCombinedIncome;

  // ПЕРЕДАЧА ДАННЫХ В РОДИТЕЛЬСКИЙ КОМПОНЕНТ
  useEffect(() => {
    onCombinedIncomeChange(combinedIncome);
    onTotalsChange(totalPlannedIncome, totalActualCombinedIncome);
  }, [combinedIncome, totalPlannedIncome, totalActualCombinedIncome, onCombinedIncomeChange, onTotalsChange]);

  // РЕНДЕР ПОЛЯ ВВОДА
  const renderInput = (label: string, value: number, setter: (value: number) => void) => {
    return (
      <div>
        <p className="card-label">{label}</p>
        <input
          type="text"
          defaultValue={value}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setter(calculateValue(e.target.value))}
          className="input"
        />
      </div>
    );
  };

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2 className="section-title">Доходы</h2>
          <p className="section-subtitle">Планируемые и фактические поступления</p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ marginBottom: "10px" }}>
            <p className="card-label">План</p>
            <p style={{ fontSize: "22px", fontWeight: 700 }}>{totalPlannedIncome.toFixed(0)}</p>
          </div>
          <div>
            <p className="card-label">Факт</p>
            <p style={{ fontSize: "22px", fontWeight: 700 }}>{totalActualCombinedIncome.toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* КОМПО */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="card-title">КОМПО</h3>
            <button
              onClick={() => setKompoCollapsed(!kompoCollapsed)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "16px",
                color: "#6b7280",
              }}
            >
              {kompoCollapsed ? "▼" : "▲"}
            </button>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "10px" }}>
              <p className="card-label">План</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{totalKompoIncome.toFixed(0)}</p>
            </div>
            <div>
              <p className="card-label">Факт</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{totalActualIncome.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {!kompoCollapsed && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {renderInput("Оклад", baseSalary, setBaseSalary)}
              {renderInput("Ставка", employmentRate, setEmploymentRate)}
              {renderInput("Рабочих часов в прошлом месяце", workingHoursPrevMonth, setWorkingHoursPrevMonth)}
              {renderInput("ПРОЕКТНЫЕ (часы)", projectHours, setProjectHours)}
              {renderInput("РЕГУЛЯРНЫЕ (часы)", regularHours, setRegularHours)}
              {renderInput("Фактическая зарплата", actualSalaryIncome, setActualSalaryIncome)}
              {renderInput("Фактический аванс", actualAdvanceIncome, setActualAdvanceIncome)}
            </div>

            <div className="results">
              <div className="result-row">
                <span className="result-label">Проектные</span>
                <span className="result-value">{projectIncome.toFixed(0)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Регулярные</span>
                <span className="result-value">{regularIncome.toFixed(0)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Зарплата</span>
                <span className="result-value">{salaryIncome.toFixed(0)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Аванс</span>
                <span className="result-value">{advanceIncome.toFixed(0)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* АЛЬТАГАММА */}
      <div className="card" style={{ marginTop: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="card-title">Альтагамма</h3>
            <button
              onClick={() => setAltagammaCollapsed(!altagammaCollapsed)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "16px",
                color: "#6b7280",
              }}
            >
              {altagammaCollapsed ? "▼" : "▲"}
            </button>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "10px" }}>
              <p className="card-label">План</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{altagammaPlanned}</p>
            </div>
            <div>
              <p className="card-label">Факт</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{altagammaActual}</p>
            </div>
          </div>
        </div>

        {!altagammaCollapsed && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {renderInput("Планируемый доход", altagammaPlanned, setAltagammaPlanned)}
            {renderInput("Фактический доход", altagammaActual, setAltagammaActual)}
          </div>
        )}
      </div>

      {/* ПРЕМИЯ */}
      <div className="card" style={{ marginTop: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="card-title">Премия</h3>
            <button
              onClick={() => setBonusCollapsed(!bonusCollapsed)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "16px",
                color: "#6b7280",
              }}
            >
              {bonusCollapsed ? "▼" : "▲"}
            </button>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "10px" }}>
              <p className="card-label">План</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{bonusPlanned}</p>
            </div>
            <div>
              <p className="card-label">Факт</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{bonusActual}</p>
            </div>
          </div>
        </div>

        {!bonusCollapsed && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {renderInput("Планируемый доход", bonusPlanned, setBonusPlanned)}
            {renderInput("Фактический доход", bonusActual, setBonusActual)}
          </div>
        )}
      </div>
    </div>
  );
}