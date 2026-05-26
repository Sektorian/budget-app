"use client";

import { useState } from "react";

import type { Expense } from "../page";

type PlanningTabProps = {
  totalPlannedIncome: number;

  periodOneExpenses: Expense[];

  setPeriodOneExpenses: React.Dispatch<
    React.SetStateAction<Expense[]>
  >;

  periodTwoExpenses: Expense[];

  setPeriodTwoExpenses: React.Dispatch<
    React.SetStateAction<Expense[]>
  >;
};

export default function PlanningTab({
  totalPlannedIncome,

  periodOneExpenses,
  setPeriodOneExpenses,

  periodTwoExpenses,
  setPeriodTwoExpenses,
}: PlanningTabProps) {
  const [
    periodOneCollapsed,
    setPeriodOneCollapsed,
  ] = useState(true);

  const [
    periodTwoCollapsed,
    setPeriodTwoCollapsed,
  ] = useState(true);

  // EDITING
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editName, setEditName] =
    useState("");

  const [editAmount, setEditAmount] =
    useState("");

  const [editRequired, setEditRequired] =
    useState(false);

  // TOTALS
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

  const balance =
    totalPlannedIncome -
    totalExpenses;

  // HELPERS
  const calculateValue = (
    value: string
  ) => {
    const formatted =
      value.replace(",", ".");

    try {
      const result = Function(
        `"use strict"; return (${formatted})`
      )();

      if (!isNaN(result)) {
        return Number(result);
      }

      return 0;
    } catch {
      return 0;
    }
  };

  // ADD EXPENSE
  const addExpense = (
    period: 1 | 2
  ) => {
    const newExpense: Expense = {
      id: Date.now(),
      name: "Новый расход",
      amount: 0,
      required: false,
    };

    if (period === 1) {
      setPeriodOneExpenses([
        ...periodOneExpenses,
        newExpense,
      ]);
    } else {
      setPeriodTwoExpenses([
        ...periodTwoExpenses,
        newExpense,
      ]);
    }

    // Сразу открыть редактирование
    setEditingId(newExpense.id);

    setEditName(newExpense.name);

    setEditAmount(
      newExpense.amount.toString()
    );

    setEditRequired(
      newExpense.required
    );
  };

  // DELETE EXPENSE
  const deleteExpense = (
    id: number,
    period: 1 | 2
  ) => {
    if (period === 1) {
      setPeriodOneExpenses(
        periodOneExpenses.filter(
          (item) => item.id !== id
        )
      );
    } else {
      setPeriodTwoExpenses(
        periodTwoExpenses.filter(
          (item) => item.id !== id
        )
      );
    }
  };

  // START EDIT
  const startEdit = (
    expense: Expense
  ) => {
    setEditingId(expense.id);

    setEditName(expense.name);

    setEditAmount(
      expense.amount.toString()
    );

    setEditRequired(
      expense.required
    );
  };

  // SAVE EDIT
  const saveEdit = (
    period: 1 | 2
  ) => {
    const updatedExpense = {
      id: editingId!,
      name: editName,
      amount:
        calculateValue(editAmount),
      required: editRequired,
    };

    if (period === 1) {
      setPeriodOneExpenses(
        periodOneExpenses.map(
          (item) =>
            item.id === editingId
              ? updatedExpense
              : item
        )
      );
    } else {
      setPeriodTwoExpenses(
        periodTwoExpenses.map(
          (item) =>
            item.id === editingId
              ? updatedExpense
              : item
        )
      );
    }

    setEditingId(null);
  };

  // CARD
  const renderExpenseCard = (
    expense: Expense,
    period: 1 | 2
  ) => {
    const isEditing =
      editingId === expense.id;

    return (
      <div
        key={expense.id}
        className="result-row"
        style={{
          alignItems: "flex-start",
          gap: "12px",
        }}
      >

        {!isEditing ? (

          <>
            <div
              style={{
                flex: 1,
              }}
            >

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
              style={{
                textAlign: "right",
              }}
            >

              <div
                className="result-value"
              >
                {expense.amount}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "6px",
                  justifyContent:
                    "flex-end",
                }}
              >

                <button
                  onClick={() =>
                    startEdit(expense)
                  }
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    cursor: "pointer",
                    color: "#111827",
                    fontSize: "16px",
                  }}
                >
                  ✎
                </button>

                <button
                  onClick={() =>
                    deleteExpense(
                      expense.id,
                      period
                    )
                  }
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    cursor: "pointer",
                    color: "#111827",
                    fontSize: "16px",
                  }}
                >
                  ⌫
                </button>

              </div>

            </div>

          </>

        ) : (

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection:
                "column",
              gap: "10px",
            }}
          >

            <input
              type="text"
              value={editName}
              onFocus={(e) =>
                e.target.select()
              }
              onChange={(e) =>
                setEditName(
                  e.target.value
                )
              }
              className="input"
            />

            <input
              type="text"
              value={editAmount}
              onFocus={(e) =>
                e.target.select()
              }
              onChange={(e) =>
                setEditAmount(
                  e.target.value
                )
              }
              className="input"
            />

            <label
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                fontSize: "14px",
              }}
            >

              <input
                type="checkbox"
                checked={
                  editRequired
                }
                onChange={(e) =>
                  setEditRequired(
                    e.target.checked
                  )
                }
              />

              Обязательный

            </label>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >

              <button
                onClick={() =>
                  saveEdit(period)
                }
                style={{
                  padding:
                    "8px 14px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #d1d5db",
                  background:
                    "white",
                  cursor: "pointer",
                }}
              >
                OK
              </button>

              <button
                onClick={() =>
                  setEditingId(null)
                }
                style={{
                  padding:
                    "8px 14px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #d1d5db",
                  background:
                    "white",
                  cursor: "pointer",
                }}
              >
                Отмена
              </button>

            </div>

          </div>

        )}

      </div>
    );
  };

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

          <div>

            <p className="card-label">
              Остаток
            </p>

            <p
              style={{
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              {balance}
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

          <>
            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "12px",
              }}
            >

              {periodOneExpenses.map(
                (expense) =>
                  renderExpenseCard(
                    expense,
                    1
                  )
              )}

            </div>

            <button
              onClick={() =>
                addExpense(1)
              }
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border:
                  "1px dashed #9ca3af",
                background:
                  "transparent",
                cursor: "pointer",
              }}
            >
              + Добавить расход
            </button>

          </>

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

          <>
            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "12px",
              }}
            >

              {periodTwoExpenses.map(
                (expense) =>
                  renderExpenseCard(
                    expense,
                    2
                  )
              )}

            </div>

            <button
              onClick={() =>
                addExpense(2)
              }
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border:
                  "1px dashed #9ca3af",
                background:
                  "transparent",
                cursor: "pointer",
              }}
            >
              + Добавить расход
            </button>

          </>

        )}

      </div>

    </div>
  );
}