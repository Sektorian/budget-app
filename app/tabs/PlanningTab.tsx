"use client";

import { useState, useEffect } from "react";
import type { Expense } from "../page";

type PlanningTabProps = {
  totalPlannedIncome: number;
  periodOneExpenses: Expense[];
  periodTwoExpenses: Expense[];
  addExpenseToFirebase: (period: 'periodOneExpenses' | 'periodTwoExpenses', expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpenseInFirebase: (period: 'periodOneExpenses' | 'periodTwoExpenses', id: string, data: Partial<Expense>) => Promise<void>;
  deleteExpenseFromFirebase: (period: 'periodOneExpenses' | 'periodTwoExpenses', id: string) => Promise<void>;
  combinedIncome?: number;
};

export default function PlanningTab({
  totalPlannedIncome,
  periodOneExpenses,
  periodTwoExpenses,
  addExpenseToFirebase,
  updateExpenseInFirebase,
  deleteExpenseFromFirebase,
  combinedIncome = 0,
}: PlanningTabProps) {
  const [periodOneCollapsed, setPeriodOneCollapsed] = useState(true);
  const [periodTwoCollapsed, setPeriodTwoCollapsed] = useState(true);
  const [tenPercentCollapsed, setTenPercentCollapsed] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editRequired, setEditRequired] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<1 | 2 | null>(null);

  // Находим расход 10%
  const tenPercentExpense = [...periodOneExpenses, ...periodTwoExpenses].find(e => e.name === "10%");
  // Остальные расходы (без 10%)
  const otherPeriodOneExpenses = periodOneExpenses.filter(e => e.name !== "10%");
  const otherPeriodTwoExpenses = periodTwoExpenses.filter(e => e.name !== "10%");

  // Автоматическое обновление суммы 10% при изменении дохода
  useEffect(() => {
    if (tenPercentExpense) {
      const newAmount = Math.round(combinedIncome * 0.1);
      if (tenPercentExpense.amount !== newAmount) {
        const inPeriodOne = periodOneExpenses.some(e => e.id === tenPercentExpense.id);
        const period = inPeriodOne ? 'periodOneExpenses' : 'periodTwoExpenses';
        updateExpenseInFirebase(period, tenPercentExpense.id, { amount: newAmount });
      }
    }
  }, [combinedIncome, tenPercentExpense]);

  const periodOneTotal = otherPeriodOneExpenses.reduce((sum, item) => sum + item.amount, 0);
  const periodTwoTotal = otherPeriodTwoExpenses.reduce((sum, item) => sum + item.amount, 0);
  const tenPercentAmount = tenPercentExpense ? tenPercentExpense.amount : 0;
  const totalExpenses = periodOneTotal + periodTwoTotal + tenPercentAmount;
  const balance = totalPlannedIncome - totalExpenses;

  const calculateValue = (value: string): number => {
    const cleaned = value.trim().replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const addExpense = async (period: 1 | 2) => {
    const periodName = period === 1 ? 'periodOneExpenses' : 'periodTwoExpenses';
    await addExpenseToFirebase(periodName, {
      name: "Новый расход",
      amount: 0,
      required: false,
    });
  };

  const addTenPercentExpense = async () => {
    const existing = [...periodOneExpenses, ...periodTwoExpenses].some(e => e.name === "10%");
    if (existing) {
      alert("Расход '10%' уже существует!");
      return;
    }

    const newAmount = Math.round(combinedIncome * 0.1);
    await addExpenseToFirebase('periodOneExpenses', {
      name: "10%",
      amount: newAmount,
      required: true,
    });
  };

  const deleteExpense = async (id: string, period: 1 | 2) => {
    const expense = period === 1 
      ? periodOneExpenses.find(e => e.id === id)
      : periodTwoExpenses.find(e => e.id === id);
    
    if (expense?.name === "10%") {
      if (confirm("Удалить расход '10%'? Он перестанет автоматически рассчитываться.")) {
        const periodName = period === 1 ? 'periodOneExpenses' : 'periodTwoExpenses';
        await deleteExpenseFromFirebase(periodName, id);
      }
    } else {
      const periodName = period === 1 ? 'periodOneExpenses' : 'periodTwoExpenses';
      await deleteExpenseFromFirebase(periodName, id);
    }
  };

  const startEdit = (expense: Expense, period: 1 | 2) => {
    if (expense.name === "10%") {
      alert("Расход '10%' рассчитывается автоматически и не может быть отредактирован вручную.");
      return;
    }
    setEditingId(expense.id);
    setEditingPeriod(period);
    setEditName(expense.name);
    setEditAmount(expense.amount.toString());
    setEditRequired(expense.required);
  };

  const saveEdit = async () => {
    if (!editingId || !editingPeriod) return;
    const periodName = editingPeriod === 1 ? 'periodOneExpenses' : 'periodTwoExpenses';
    await updateExpenseInFirebase(periodName, editingId, {
      name: editName,
      amount: calculateValue(editAmount),
      required: editRequired,
    });
    setEditingId(null);
    setEditingPeriod(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingPeriod(null);
  };

  const renderExpenseCard = (expense: Expense, period: 1 | 2) => {
    const isEditing = editingId === expense.id;

    return (
      <div key={expense.id} className="result-row" style={{ alignItems: "flex-start", gap: "12px" }}>
        {!isEditing ? (
          <>
            <div style={{ flex: 1 }}>
              <div className="result-label">{expense.name}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {expense.required ? "Обязательный" : "Дополнительный"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="result-value">{expense.amount}</div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px", justifyContent: "flex-end" }}>
                <button 
                  onClick={() => startEdit(expense, period)} 
                  className="nav-button" 
                  style={{ width: "auto", padding: "4px 8px", fontSize: "16px" }}
                >
                  ✎
                </button>
                <button 
                  onClick={() => deleteExpense(expense.id, period)} 
                  className="nav-button" 
                  style={{ width: "auto", padding: "4px 8px", fontSize: "16px" }}
                >
                  ⌫
                </button>
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
              <button onClick={cancelEdit} className="nav-button" style={{ width: "auto", padding: "8px 14px" }}>Отмена</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Специальная карточка для 10%
  const renderTenPercentCard = () => {
    return (
      <div className="card" style={{ marginTop: "16px", border: "1px solid #f59e0b", background: "#fffbeb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="card-title" style={{ color: "#92400e" }}>💰 10%</h3>
            <button onClick={() => setTenPercentCollapsed(!tenPercentCollapsed)} className="nav-button" style={{ width: "auto", padding: "4px 8px" }}>
              {tenPercentCollapsed ? "▼" : "▲"}
            </button>
          </div>
          <div>
            <p className="card-label">Сумма</p>
            <p style={{ fontSize: "24px", fontWeight: 700, color: "#f59e0b" }}>{tenPercentAmount}</p>
          </div>
        </div>
        
        {!tenPercentCollapsed && (
          <>
            <div style={{ padding: "12px", background: "#fef3c7", borderRadius: "12px", marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", color: "#92400e" }}>
                📊 Этот расход автоматически рассчитывается как <strong>10% от комбинированного дохода</strong>.
                <br />
                Текущий доход: <strong>{combinedIncome} ₽</strong> → 10% = <strong>{tenPercentAmount} ₽</strong>
              </p>
            </div>
            
            {!tenPercentExpense ? (
              <button 
                onClick={addTenPercentExpense} 
                className="nav-button" 
                style={{ width: "100%", padding: "12px", background: "#f59e0b", color: "white", borderRadius: "12px" }}
              >
                + Добавить расход 10%
              </button>
            ) : (
              <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: "12px" }}>
                <p style={{ fontSize: "14px", color: "#166534" }}>
                  ✅ Расход "10%" уже добавлен в план и будет автоматически обновляться при изменении дохода.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <h2 className="section-title">План</h2>
          <p className="section-subtitle">Планирование расходов</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ marginBottom: "10px" }}>
            <p className="card-label">Расходы</p>
            <p style={{ fontSize: "22px", fontWeight: 700 }}>{totalExpenses}</p>
          </div>
          <div>
            <p className="card-label">Остаток</p>
            <p style={{ fontSize: "22px", fontWeight: 700 }}>{balance}</p>
          </div>
        </div>
      </div>

      {/* PERIOD 1 (без 10%) */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="card-title">7 → 19</h3>
            <button onClick={() => setPeriodOneCollapsed(!periodOneCollapsed)} className="nav-button" style={{ width: "auto", padding: "4px 8px" }}>
              {periodOneCollapsed ? "▼" : "▲"}
            </button>
          </div>
          <div>
            <p className="card-label">Сумма</p>
            <p style={{ fontSize: "24px", fontWeight: 700 }}>{periodOneTotal}</p>
          </div>
        </div>
        {!periodOneCollapsed && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {otherPeriodOneExpenses.map((expense) => renderExpenseCard(expense, 1))}
            </div>
            <button onClick={() => addExpense(1)} className="nav-button" style={{ width: "100%", marginTop: "16px", padding: "12px", border: "1px dashed #9ca3af", background: "transparent" }}>
              + Добавить расход
            </button>
          </>
        )}
      </div>

      {/* PERIOD 2 (без 10%) */}
      <div className="card" style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="card-title">19 → 7</h3>
            <button onClick={() => setPeriodTwoCollapsed(!periodTwoCollapsed)} className="nav-button" style={{ width: "auto", padding: "4px 8px" }}>
              {periodTwoCollapsed ? "▼" : "▲"}
            </button>
          </div>
          <div>
            <p className="card-label">Сумма</p>
            <p style={{ fontSize: "24px", fontWeight: 700 }}>{periodTwoTotal}</p>
          </div>
        </div>
        {!periodTwoCollapsed && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {otherPeriodTwoExpenses.map((expense) => renderExpenseCard(expense, 2))}
            </div>
            <button onClick={() => addExpense(2)} className="nav-button" style={{ width: "100%", marginTop: "16px", padding: "12px", border: "1px dashed #9ca3af", background: "transparent" }}>
              + Добавить расход
            </button>
          </>
        )}
      </div>

      {/* КАРТОЧКА 10% В САМОМ НИЗУ */}
      {renderTenPercentCard()}
    </div>
  );
}