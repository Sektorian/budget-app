"use client";

import { useState } from "react";

import type { Expense } from "../page";

type ExpensesTabProps = {
  totalPlannedIncome: number;

  totalActualIncome: number;

  periodOneExpenses: Expense[];

  periodTwoExpenses: Expense[];
};

type ActualExpense = {
  id: number;
  actualAmount: number;
};

type ExtraExpense = {
  id: number;
  name: string;
  amount: number;
  required: boolean;
};

export default function ExpensesTab({
  totalPlannedIncome,

  totalActualIncome,

  periodOneExpenses,

  periodTwoExpenses,
}: ExpensesTabProps) {
  // COLLAPSE
  const [
    periodOneCollapsed,
    setPeriodOneCollapsed,
  ] = useState(true);

  const [
    periodTwoCollapsed,
    setPeriodTwoCollapsed,
  ] = useState(true);

  const [
    extraCollapsed,
    setExtraCollapsed,
  ] = useState(true);

  // ACTUAL EXPENSES
  const [
    actualExpenses,
    setActualExpenses,
  ] = useState<ActualExpense[]>([]);

  // EXTRA EXPENSES
  const [
    extraExpenses,
    setExtraExpenses,
  ] = useState<ExtraExpense[]>([]);

  // EDITING
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editName, setEditName] =
    useState("");

  const [editAmount, setEditAmount] =
    useState("");

  const [editRequired, setEditRequired] =
    useState(false);

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

  // ACTUAL VALUE
  const getActualValue = (
    id: number
  ) => {
    const item =
      actualExpenses.find(
        (expense) =>
          expense.id === id
      );

    return item
      ? item.actualAmount
      : 0;
  };

  // UPDATE ACTUAL
  const updateActualValue = (
    id: number,
    value: string
  ) => {
    const amount =
      calculateValue(value);

    const exists =
      actualExpenses.find(
        (expense) =>
          expense.id === id
      );

    if (exists) {
      setActualExpenses(
        actualExpenses.map(
          (expense) =>
            expense.id === id
              ? {
                  ...expense,
                  actualAmount:
                    amount,
                }
              : expense
        )
      );
    } else {
      setActualExpenses([
        ...actualExpenses,
        {
          id,
          actualAmount: amount,
        },
      ]);
    }
  };

  // TOTALS
  const extraTotal =
    extraExpenses.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const plannedFactTotal =
    actualExpenses.reduce(
      (sum, item) =>
        sum + item.actualAmount,
      0
    );

  const totalFact =
    plannedFactTotal +
    extraTotal;

  // ПЛАНИРУЕМЫЕ РАСХОДЫ
  const totalPlannedExpenses =
    [
      ...periodOneExpenses,
      ...periodTwoExpenses,
    ].reduce(
      (sum, expense) =>
        sum + expense.amount,
      0
    );

  // ОСТАТОК НА КАРТЕ
  const balance =
    totalActualIncome -
    (
      plannedFactTotal +
      extraTotal
    );

  // ПЛАНИРУЕМЫЙ ОСТАТОК
  const plannedBalance =
    totalPlannedIncome -
    totalPlannedExpenses -
    extraTotal;

  // EXTRA EXPENSES
  const addExtraExpense = () => {
    const newExpense: ExtraExpense =
      {
        id: Date.now(),
        name:
          "Новый расход",
        amount: 0,
        required: false,
      };

    setExtraExpenses([
      ...extraExpenses,
      newExpense,
    ]);

    setEditingId(newExpense.id);

    setEditName(
      newExpense.name
    );

    setEditAmount(
      newExpense.amount.toString()
    );

    setEditRequired(
      newExpense.required
    );
  };

  const deleteExtraExpense = (
    id: number
  ) => {
    setExtraExpenses(
      extraExpenses.filter(
        (item) => item.id !== id
      )
    );
  };

  const startEdit = (
    expense: ExtraExpense
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

  const saveEdit = () => {
    setExtraExpenses(
      extraExpenses.map(
        (item) =>
          item.id === editingId
            ? {
                ...item,
                name: editName,
                amount:
                  calculateValue(
                    editAmount
                  ),
                required:
                  editRequired,
              }
            : item
      )
    );

    setEditingId(null);
  };

  // PLANNED EXPENSE CARD
  const renderPlannedExpense = (
    expense: Expense
  ) => {
    return (
      <div
        key={expense.id}
        style={{
          padding: "14px 0",
          borderBottom:
            "1px solid #e5e7eb",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
          }}
        >

          {/* LEFT */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >

            <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "4px",
                wordBreak:
                  "break-word",
              }}
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

          {/* PLAN */}
          <div
            style={{
              width: "70px",
              textAlign: "center",
              flexShrink: 0,
            }}
          >

            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginBottom: "6px",
              }}
            >
              План
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {expense.amount}
            </div>

          </div>

          {/* FACT */}
          <div
            style={{
              width: "88px",
              textAlign: "center",
              flexShrink: 0,
            }}
          >

            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginBottom: "6px",
              }}
            >
              Факт
            </div>

            <input
              type="text"
              defaultValue={
                getActualValue(
                  expense.id
                ) || "0"
              }
              onFocus={(e) =>
                e.target.select()
              }
              onChange={(e) =>
                updateActualValue(
                  expense.id,
                  e.target.value
                )
              }
              className="input"
              style={{
                textAlign: "center",
                padding:
                  "8px 6px",
                fontSize: "14px",
              }}
            />

          </div>

        </div>

      </div>
    );
  };

  // EXTRA CARD
  const renderExtraExpense = (
    expense: ExtraExpense
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
                    deleteExtraExpense(
                      expense.id
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
                onClick={saveEdit}
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
          gap: "12px",
        }}
      >

        <div>

          <h2 className="section-title">
            Расходы
          </h2>

          <p className="section-subtitle">
            Фактические расходы
          </p>

        </div>

        <div
          style={{
            textAlign: "right",
            flexShrink: 0,
          }}
        >

          <div
            style={{
              marginBottom: "10px",
            }}
          >

            <p className="card-label">
              Потрачено
            </p>

            <p
              style={{
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              {totalFact}
            </p>

          </div>

          <div
            style={{
              marginBottom: "10px",
            }}
          >

            <p className="card-label">
              Остаток на карте
            </p>

            <p
              style={{
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              {balance}
            </p>

          </div>

          <div>

            <p className="card-label">
              Планируемый остаток
            </p>

            <p
              style={{
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              {plannedBalance}
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
              "center",
            marginBottom: "8px",
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

        </div>

        {!periodOneCollapsed && (

          <div>

            {periodOneExpenses.map(
              renderPlannedExpense
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
              "center",
            marginBottom: "8px",
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

        </div>

        {!periodTwoCollapsed && (

          <div>

            {periodTwoExpenses.map(
              renderPlannedExpense
            )}

          </div>

        )}

      </div>

      {/* EXTRA */}
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
              "center",
            marginBottom: "8px",
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
              Внеплановые расходы
            </h3>

            <button
              onClick={() =>
                setExtraCollapsed(
                  !extraCollapsed
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
              {extraCollapsed
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
              {extraTotal}
            </p>

          </div>

        </div>

        {!extraCollapsed && (

          <>
            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "12px",
              }}
            >

              {extraExpenses.length ===
              0 ? (

                <div
                  style={{
                    textAlign:
                      "center",
                    color: "#6b7280",
                    padding:
                      "20px 0",
                  }}
                >
                  Здесь пока нет
                  расходов
                </div>

              ) : (

                extraExpenses.map(
                  renderExtraExpense
                )

              )}

            </div>

            <button
              onClick={
                addExtraExpense
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