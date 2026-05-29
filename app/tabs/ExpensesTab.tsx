"use client";

import { useState } from "react";
import type { Expense, ActualExpense, ExtraExpense } from "../page";

type ExpensesTabProps = {
  totalPlannedIncome: number;
  totalActualIncome: number;
  periodOneExpenses: Expense[];
  periodTwoExpenses: Expense[];
  actualExpenses: ActualExpense[];
  extraExpenses: ExtraExpense[];
  onUpdateActualExpense: (id: string, actualAmount: number) => Promise<void>;
  onAddExtraExpense: (expense: Omit<ExtraExpense, 'id'>) => Promise<void>;
  onUpdateExtraExpense: (id: string, data: Partial<ExtraExpense>) => Promise<void>;
  onDeleteExtraExpense: (id: string) => Promise<void>;
};

export default function ExpensesTab({
  totalPlannedIncome,
  totalActualIncome,
  periodOneExpenses,
  periodTwoExpenses,
  actualExpenses,
  extraExpenses,
  onUpdateActualExpense,
  onAddExtraExpense,
  onUpdateExtraExpense,
  onDeleteExtraExpense,
}: ExpensesTabProps) {
  const [periodOneCollapsed, setPeriodOneCollapsed] = useState(true);
  const [periodTwoCollapsed, setPeriodTwoCollapsed] = useState(true);
  const [extraCollapsed, setExtraCollapsed] = useState(true);
  const [tenPercentCollapsed, setTenPercentCollapsed] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editRequired, setEditRequired] = useState(false);

  // Находим расход 10%
  const tenPercentExpense = [...periodOneExpenses, ...periodTwoExpenses].find(e => e.name === "10%");
  // Остальные расходы (без 10%)
  const otherPeriodOneExpenses = periodOneExpenses.filter(e => e.name !== "10%");
  const otherPeriodTwoExpenses = periodTwoExpenses.filter(e => e.name !== "10%");

  const calculateValue = (value: string): number => {
    const cleaned = value.trim().replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const getActualValue = (id: string) => {
    const item = actualExpenses.find(expense => expense.id === id);
    return item ? item.actualAmount : 0;
  };

  const updateActualValue = (id: string, value: string) => {
    const amount = calculateValue(value);
    onUpdateActualExpense(id, amount);
  };

  const addExtraExpense = () => {
    onAddExtraExpense({
      name: "Новый расход",
      amount: 0,
      required: false,
    });
  };

  const deleteExtraExpense = (id: string) => {
    onDeleteExtraExpense(id);
  };

  const startEdit = (expense: ExtraExpense) => {
    setEditingId(expense.id);
    setEditName(expense.name);
    setEditAmount(expense.amount.toString());
    setEditRequired(expense.required);
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateExtraExpense(editingId, {
        name: editName,
        amount: calculateValue(editAmount),
        required: editRequired,
      });
    }
    setEditingId(null);
  };

  // Вычисляем суммы для остатка на карте
  const extraTotal = extraExpenses.reduce((sum, item) => sum + item.amount, 0);
  const plannedFactTotal = actualExpenses.reduce((sum, item) => sum + item.actualAmount, 0);
  const totalFact = plannedFactTotal + extraTotal;
  // Остаток на карте = комбинированный доход минус все фактические траты
  const balance = totalActualIncome - totalFact;
  const totalPlannedExpenses = [...periodOneExpenses, ...periodTwoExpenses].reduce((sum, expense) => sum + expense.amount, 0);
  const plannedBalance = totalPlannedIncome - totalPlannedExpenses - extraTotal;

  const renderPlannedExpense = (expense: Expense) => {
    const currentActualValue = getActualValue(expense.id);
    
    return (
      <div key={expense.id} style={{ padding: "14px 0", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px", wordBreak: "break-word" }}>{expense.name}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>{expense.required ? "Обязательный" : "Дополнительный"}</div>
          </div>
          <div style={{ width: "70px", textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>План</div>
            <div style={{ fontSize: "18px", fontWeight: 700 }}>{expense.amount}</div>
          </div>
          <div style={{ width: "88px", textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>Факт</div>
            <input
              type="text"
              value={currentActualValue || ""}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onChange={(e) => updateActualValue(expense.id, e.target.value)}
              className="input"
              style={{ textAlign: "center", padding: "8px 6px", fontSize: "14px" }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderExtraExpense = (expense: ExtraExpense) => {
    const isEditing = editingId === expense.id;
    return (
      <div key={expense.id} className="result-row" style={{ alignItems: "flex-start", gap: "12px" }}>
        {!isEditing ? (
          <>
            <div style={{ flex: 1 }}>
              <div className="result-label">{expense.name}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>{expense.required ? "Обязательный" : "Дополнительный"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="result-value">{expense.amount}</div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px", justifyContent: "flex-end" }}>
                <button onClick={() => startEdit(expense)} className="nav-button" style={{ width: "auto", padding: "4px 8px", fontSize: "16px" }}>✎</button>
                <button onClick={() => deleteExtraExpense(expense.id)} className="nav-button" style={{ width: "auto", padding: "4px 8px", fontSize: "16px" }}>⌫</button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" value={editName} onFocus={(e) => e.target.select()} onChange={(e) => setEditName(e.target.value)} className="input" />
            <input type="text" value={editAmount} onFocus={(e) => e.target.select()} onChange={(e) => setEditAmount(e.target.value)} className="input" />
            <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
              <input type="checkbox" checked={editRequired} onChange={(e) => setEditRequired(e.target.checked)} />
              Обязательный
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={saveEdit} className="nav-button" style={{ width: "auto", padding: "8px 14px", background: "black", color: "white" }}>OK</button>
              <button onClick={() => setEditingId(null)} className="nav-button" style={{ width: "auto", padding: "8px 14px" }}>Отмена</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", gap: "12px" }}>
        <div>
          <h2 className="section-title">Расходы</h2>
          <p className="section-subtitle">Фактические расходы</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ marginBottom: "10px" }}>
            <p className="card-label">Потрачено</p>
            <p style={{ fontSize: "20px", fontWeight: 700 }}>{totalFact}</p>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <p className="card-label">Остаток на карте</p>
            <p style={{ fontSize: "20px", fontWeight: 700 }}>{balance.toFixed(1)}</p>
          </div>
          <div>
            <p className="card-label">Планируемый остаток</p>
            <p style={{ fontSize: "20px", fontWeight: 700 }}>{plannedBalance.toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* PERIOD 1 (без 10%) */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="card-title">7 → 19</h3>
            <button onClick={() => setPeriodOneCollapsed(!periodOneCollapsed)} className="nav-button" style={{ width: "auto", padding: "4px 8px" }}>
              {periodOneCollapsed ? "▼" : "▲"}
            </button>
          </div>
        </div>
        {!periodOneCollapsed && <div>{otherPeriodOneExpenses.map(renderPlannedExpense)}</div>}
      </div>

      {/* PERIOD 2 (без 10%) */}
      <div className="card" style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="card-title">19 → 7</h3>
            <button onClick={() => setPeriodTwoCollapsed(!periodTwoCollapsed)} className="nav-button" style={{ width: "auto", padding: "4px 8px" }}>
              {periodTwoCollapsed ? "▼" : "▲"}
            </button>
          </div>
        </div>
        {!periodTwoCollapsed && <div>{otherPeriodTwoExpenses.map(renderPlannedExpense)}</div>}
      </div>

      {/* ОТДЕЛЬНАЯ КАРТОЧКА 10% (перед внеплановыми расходами) */}
      {tenPercentExpense && (
        <div className="card" style={{ marginTop: "16px", border: "1px solid #f59e0b", background: "#fffbeb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 className="card-title" style={{ color: "#92400e" }}>💰 10%</h3>
              <button onClick={() => setTenPercentCollapsed(!tenPercentCollapsed)} className="nav-button" style={{ width: "auto", padding: "4px 8px" }}>
                {tenPercentCollapsed ? "▼" : "▲"}
              </button>
            </div>
            <div>
              <p className="card-label">Сумма</p>
              <p style={{ fontSize: "24px", fontWeight: 700, color: "#f59e0b" }}>{tenPercentExpense.amount}</p>
            </div>
          </div>
          {!tenPercentCollapsed && (
            <div>
              <div style={{ padding: "12px", background: "#fef3c7", borderRadius: "12px", marginBottom: "16px" }}>
                <p style={{ fontSize: "14px", color: "#92400e" }}>
                  📊 10% от комбинированного дохода
                </p>
              </div>
              {renderPlannedExpense(tenPercentExpense)}
            </div>
          )}
        </div>
      )}

      {/* Внеплановые расходы */}
      <div className="card" style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="card-title">Внеплановые расходы</h3>
            <button onClick={() => setExtraCollapsed(!extraCollapsed)} className="nav-button" style={{ width: "auto", padding: "4px 8px" }}>
              {extraCollapsed ? "▼" : "▲"}
            </button>
          </div>
          <div>
            <p className="card-label">Сумма</p>
            <p style={{ fontSize: "24px", fontWeight: 700 }}>{extraTotal}</p>
          </div>
        </div>
        {!extraCollapsed && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {extraExpenses.length === 0 ? (
                <div style={{ textAlign: "center", color: "#6b7280", padding: "20px 0" }}>Здесь пока нет расходов</div>
              ) : (
                extraExpenses.map(renderExtraExpense)
              )}
            </div>
            <button onClick={addExtraExpense} className="nav-button" style={{ width: "100%", marginTop: "16px", padding: "12px", border: "1px dashed #9ca3af", background: "transparent" }}>
              + Добавить расход
            </button>
          </>
        )}
      </div>
    </div>
  );
}