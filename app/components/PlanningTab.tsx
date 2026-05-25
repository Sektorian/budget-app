"use client";

import { useState } from "react";

export default function PlanningTab() {
  const [
    periodOneCollapsed,
    setPeriodOneCollapsed,
  ] = useState(true);

  const [
    periodTwoCollapsed,
    setPeriodTwoCollapsed,
  ] = useState(true);

  const [
    periodOneExpenses,
    setPeriodOneExpenses,
  ] = useState([
    {
      name: "Аренда",
      amount: 850,
      required: true,
    },
    {
      name: "Интернет",
      amount: 25,
      required: true,
    },
  ]);

  const [
    periodTwoExpenses,
    setPeriodTwoExpenses,
  ] = useState([
    {
      name: "Бензин",
      amount: 100,
      required: false,
    },
  ]);

  const periodOneTotal =
    periodOneExpenses.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const periodTwoTotal =
    periodTwoExpenses.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const totalExpenses =
    periodOneTotal +
    periodTwoTotal;

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
            План
          </h2>

          <p className="section-subtitle">
            Планирование расходов
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
              Расходы
            </p>

            <p
              style={{
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              {totalExpenses}
            </p>

          </div>

        </div>

      </div>

      {/* PERIOD 1 */}
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
              alignItems:
                "center",
              gap: "8px",
            }}
          >

            <h3 className="card-title">
              7 → 19
            </h3>

            <button
              onClick={() =>
                setPeriodOneCollapsed(
                  !periodOneCollapsed
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
              {periodOneCollapsed
                ? "▼"
                : "▲"}
            </button>

          </div>

          <div>

            <p className="card-label">
              Сумма
            </p>

            <p
              style={{
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              {periodOneTotal}
            </p>

          </div>

        </div>

        {!periodOneCollapsed && (

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "12px",
            }}
          >

            {periodOneExpenses.map(
              (expense, index) => (

                <div
                  key={index}
                  className="result-row"
                >

                  <div>

                    <div
                      className="result-label"
                    >
                      {expense.name}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      {expense.required
                        ? "Обязательный"
                        : "Дополнительный"}
                    </div>

                  </div>

                  <div
                    className="result-value"
                  >
                    {expense.amount}
                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* PERIOD 2 */}
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
              alignItems:
                "center",
              gap: "8px",
            }}
          >

            <h3 className="card-title">
              19 → 7
            </h3>

            <button
              onClick={() =>
                setPeriodTwoCollapsed(
                  !periodTwoCollapsed
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
              {periodTwoCollapsed
                ? "▼"
                : "▲"}
            </button>

          </div>

          <div>

            <p className="card-label">
              Сумма
            </p>

            <p
              style={{
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              {periodTwoTotal}
            </p>

          </div>

        </div>

        {!periodTwoCollapsed && (

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "12px",
            }}
          >

            {periodTwoExpenses.map(
              (expense, index) => (

                <div
                  key={index}
                  className="result-row"
                >

                  <div>

                    <div
                      className="result-label"
                    >
                      {expense.name}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      {expense.required
                        ? "Обязательный"
                        : "Дополнительный"}
                    </div>

                  </div>

                  <div
                    className="result-value"
                  >
                    {expense.amount}
                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}