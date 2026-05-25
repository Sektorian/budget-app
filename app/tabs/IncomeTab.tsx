"use client";

import {
  useState,
  useEffect,
} from "react";

type IncomeTabProps = {
  onPlannedIncomeChange: (
    value: number
  ) => void;
};

export default function IncomeTab({
  onPlannedIncomeChange,
}: IncomeTabProps) {
  const PROJECT_RATE = 0.75;

  const PROJECT_COEFFICIENT =
    0.7;

  const REGULAR_RATE = 0.5;

  const AFTER_TAX_RATE = 0.86;

  // COLLAPSE
  const [
    isKompoCollapsed,
    setIsKompoCollapsed,
  ] = useState(true);

  const [
    isAltagammaCollapsed,
    setIsAltagammaCollapsed,
  ] = useState(true);

  const [
    isBonusCollapsed,
    setIsBonusCollapsed,
  ] = useState(true);

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

  // ALTAGAMMA
  const [
    altagammaPlanned,
    setAltagammaPlanned,
  ] = useState(0);

  const [
    altagammaActual,
    setAltagammaActual,
  ] = useState(0);

  // BONUS
  const [bonusPlanned, setBonusPlanned] =
    useState(0);

  const [bonusActual, setBonusActual] =
    useState(0);

  // INPUT VALUES
  const [
    baseSalaryInput,
    setBaseSalaryInput,
  ] = useState("2900");

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
  ] = useState("0");

  const [
    regularHoursInput,
    setRegularHoursInput,
  ] = useState("0");

  const [
    actualSalaryIncomeInput,
    setActualSalaryIncomeInput,
  ] = useState("0");

  const [
    actualAdvanceIncomeInput,
    setActualAdvanceIncomeInput,
  ] = useState("0");

  // ALTAGAMMA INPUTS
  const [
    altagammaPlannedInput,
    setAltagammaPlannedInput,
  ] = useState("0");

  const [
    altagammaActualInput,
    setAltagammaActualInput,
  ] = useState("0");

  // BONUS INPUTS
  const [
    bonusPlannedInput,
    setBonusPlannedInput,
  ] = useState("0");

  const [
    bonusActualInput,
    setBonusActualInput,
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
      // Формула ещё не завершена
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

  // TOTALS
  const totalPlannedIncome =
    totalKompoIncome +
    altagammaPlanned +
    bonusPlanned;

  const totalFactIncome =
    totalActualIncome +
    altagammaActual +
    bonusActual;

  // SEND TO PARENT
  useEffect(() => {
    onPlannedIncomeChange(
      totalPlannedIncome
    );
  }, [totalPlannedIncome]);

  return (
    <div>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >

        <div>

          <h2 className="section-title">
            Доходы
          </h2>

          <p className="section-subtitle">
            Планируемые и фактические поступления
          </p>

        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >

          <div
            style={{
              marginBottom: "10px",
            }}
          >

            <p className="card-label">
              Планируемый
            </p>

            <p
              style={{
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              {totalPlannedIncome.toFixed(
                0
              )}
            </p>

          </div>

          <div>

            <p className="card-label">
              Фактический
            </p>

            <p
              style={{
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              {totalFactIncome.toFixed(
                0
              )}
            </p>

          </div>

        </div>

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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >

            <h3 className="card-title">
              КОМПО
            </h3>

            <button
              onClick={() =>
                setIsKompoCollapsed(
                  !isKompoCollapsed
                )
              }
              style={{
                border: "none",
                background:
                  "transparent",
                cursor: "pointer",
                fontSize: "16px",
                color: "#6b7280",
              }}
            >
              {isKompoCollapsed
                ? "▼"
                : "▲"}
            </button>

          </div>

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

        {!isKompoCollapsed && (

          <>
            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "12px",
              }}
            >

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

          </>

        )}

      </div>

      {/* АЛЬТАГАММА */}
      <div
        className="card"
        style={{
          marginTop: "16px",
        }}
      >

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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >

            <h3 className="card-title">
              АЛЬТАГАММА
            </h3>

            <button
              onClick={() =>
                setIsAltagammaCollapsed(
                  !isAltagammaCollapsed
                )
              }
              style={{
                border: "none",
                background:
                  "transparent",
                cursor: "pointer",
                fontSize: "16px",
                color: "#6b7280",
              }}
            >
              {isAltagammaCollapsed
                ? "▼"
                : "▲"}
            </button>

          </div>

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
                {altagammaPlanned}
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
                {altagammaActual}
              </p>

            </div>

          </div>

        </div>

        {!isAltagammaCollapsed && (

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "12px",
            }}
          >

            <div>
              <p className="card-label">
                Планируемый доход
              </p>

              <input
                type="text"
                value={
                  altagammaPlannedInput
                }
                onFocus={(e) =>
                  e.target.select()
                }
                onChange={(e) =>
                  handleInput(
                    e.target.value,
                    setAltagammaPlannedInput,
                    setAltagammaPlanned
                  )
                }
                className="input"
              />
            </div>

            <div>
              <p className="card-label">
                Фактический доход
              </p>

              <input
                type="text"
                value={
                  altagammaActualInput
                }
                onFocus={(e) =>
                  e.target.select()
                }
                onChange={(e) =>
                  handleInput(
                    e.target.value,
                    setAltagammaActualInput,
                    setAltagammaActual
                  )
                }
                className="input"
              />
            </div>

          </div>

        )}

      </div>

      {/* ПРЕМИЯ */}
      <div
        className="card"
        style={{
          marginTop: "16px",
        }}
      >

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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >

            <h3 className="card-title">
              ПРЕМИЯ
            </h3>

            <button
              onClick={() =>
                setIsBonusCollapsed(
                  !isBonusCollapsed
                )
              }
              style={{
                border: "none",
                background:
                  "transparent",
                cursor: "pointer",
                fontSize: "16px",
                color: "#6b7280",
              }}
            >
              {isBonusCollapsed
                ? "▼"
                : "▲"}
            </button>

          </div>

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
                {bonusPlanned}
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
                {bonusActual}
              </p>

            </div>

          </div>

        </div>

        {!isBonusCollapsed && (

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "12px",
            }}
          >

            <div>
              <p className="card-label">
                Планируемый доход
              </p>

              <input
                type="text"
                value={
                  bonusPlannedInput
                }
                onFocus={(e) =>
                  e.target.select()
                }
                onChange={(e) =>
                  handleInput(
                    e.target.value,
                    setBonusPlannedInput,
                    setBonusPlanned
                  )
                }
                className="input"
              />
            </div>

            <div>
              <p className="card-label">
                Фактический доход
              </p>

              <input
                type="text"
                value={
                  bonusActualInput
                }
                onFocus={(e) =>
                  e.target.select()
                }
                onChange={(e) =>
                  handleInput(
                    e.target.value,
                    setBonusActualInput,
                    setBonusActual
                  )
                }
                className="input"
              />
            </div>

          </div>

        )}

      </div>

    </div>
  );
}