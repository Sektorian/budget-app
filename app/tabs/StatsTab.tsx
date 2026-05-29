"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

type MonthlyData = {
  yearMonth: string;
  income: number;
  expenses: number;
};

export default function StatsTab() {
  const [startYear, setStartYear] = useState(2025);
  const [startMonth, setStartMonth] = useState(5);
  const [endYear, setEndYear] = useState(2026);
  const [endMonth, setEndMonth] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [periodData, setPeriodData] = useState<MonthlyData[]>([]);
  const [totalPeriodIncome, setTotalPeriodIncome] = useState(0);
  const [totalPeriodExpenses, setTotalPeriodExpenses] = useState(0);

  const monthNames = [
    "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
    "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
  ];

  const years = [2024, 2025, 2026, 2027, 2028];

  const formatYearMonth = (year: number, month: number): string => {
    return `${year}-${String(month).padStart(2, '0')}`;
  };

  // Функция для получения всех месяцев между двумя датами
  const getMonthsInRange = (startY: number, startM: number, endY: number, endM: number): { year: number; month: number; yearMonth: string }[] => {
    const result = [];
    let currentYear = startY;
    let currentMonth = startM;
    
    while (currentYear < endY || (currentYear === endY && currentMonth <= endM)) {
      result.push({
        year: currentYear,
        month: currentMonth,
        yearMonth: formatYearMonth(currentYear, currentMonth),
      });
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }
    return result;
  };

  // Загрузка данных за выбранный период
  const loadPeriodData = async () => {
    setIsLoading(true);
    const months = getMonthsInRange(startYear, startMonth, endYear, endMonth);
    const data: MonthlyData[] = [];
    let totalInc = 0;
    let totalExp = 0;

    for (const month of months) {
      try {
        // Получаем доходы за месяц
        const incomeCollection = `incomeData_${month.yearMonth}`;
        const incomeSnapshot = await getDocs(collection(db, incomeCollection));
        let monthIncome = 0;
        if (!incomeSnapshot.empty) {
          const incomeDoc = incomeSnapshot.docs[0];
          const incomeData = incomeDoc.data();
          
          // Рассчитываем фактический доход
          const actualSalaryIncome = incomeData.actualSalaryIncome || 0;
          const actualAdvanceIncome = incomeData.actualAdvanceIncome || 0;
          const altagammaActual = incomeData.altagammaActual || 0;
          const bonusActual = incomeData.bonusActual || 0;
          monthIncome = actualSalaryIncome + actualAdvanceIncome + altagammaActual + bonusActual;
        }

        // Получаем расходы за месяц
        const periodOneCollection = `periodOneExpenses_${month.yearMonth}`;
        const periodTwoCollection = `periodTwoExpenses_${month.yearMonth}`;
        
        let monthExpenses = 0;
        
        const periodOneSnapshot = await getDocs(collection(db, periodOneCollection));
        periodOneSnapshot.docs.forEach(doc => {
          const expense = doc.data();
          monthExpenses += expense.amount || 0;
        });
        
        const periodTwoSnapshot = await getDocs(collection(db, periodTwoCollection));
        periodTwoSnapshot.docs.forEach(doc => {
          const expense = doc.data();
          monthExpenses += expense.amount || 0;
        });

        totalInc += monthIncome;
        totalExp += monthExpenses;
        
        data.push({
          yearMonth: month.yearMonth,
          income: monthIncome,
          expenses: monthExpenses,
        });
      } catch (error) {
        console.error(`Ошибка загрузки данных за ${month.yearMonth}:`, error);
        data.push({
          yearMonth: month.yearMonth,
          income: 0,
          expenses: 0,
        });
      }
    }
    
    setPeriodData(data);
    setTotalPeriodIncome(totalInc);
    setTotalPeriodExpenses(totalExp);
    setIsLoading(false);
  };

  // Загрузка при изменении периода
  useEffect(() => {
    loadPeriodData();
  }, [startYear, startMonth, endYear, endMonth]);

  const handleStartYearChange = (year: number) => {
    if (year > endYear || (year === endYear && startMonth > endMonth)) {
      setEndYear(year);
      setEndMonth(startMonth);
    }
    setStartYear(year);
  };

  const handleStartMonthChange = (month: number) => {
    if (startYear === endYear && month > endMonth) {
      setEndMonth(month);
    }
    setStartMonth(month);
  };

  const handleEndYearChange = (year: number) => {
    if (year < startYear || (year === startYear && endMonth < startMonth)) {
      setStartYear(year);
      setStartMonth(endMonth);
    }
    setEndYear(year);
  };

  const handleEndMonthChange = (month: number) => {
    if (endYear === startYear && month < startMonth) {
      setStartMonth(month);
    }
    setEndMonth(month);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <h2 className="section-title">Статистика</h2>
          <p className="section-subtitle">Анализ за период</p>
        </div>
      </div>

      {/* Выбор периода */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: "16px" }}>Выбор периода</h3>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <p className="card-label">С</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={startYear}
                onChange={(e) => handleStartYearChange(Number(e.target.value))}
                className="input"
                style={{ width: "80px" }}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={startMonth}
                onChange={(e) => handleStartMonthChange(Number(e.target.value))}
                className="input"
                style={{ width: "70px" }}
              >
                {monthNames.map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <p className="card-label">По</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={endYear}
                onChange={(e) => handleEndYearChange(Number(e.target.value))}
                className="input"
                style={{ width: "80px" }}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={endMonth}
                onChange={(e) => handleEndMonthChange(Number(e.target.value))}
                className="input"
                style={{ width: "70px" }}
              >
                {monthNames.map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={loadPeriodData}
            className="nav-button"
            style={{ marginTop: "20px", padding: "8px 16px", background: "black", color: "white" }}
          >
            Обновить
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="card">
          <div style={{ textAlign: "center", padding: "20px" }}>Загрузка данных...</div>
        </div>
      ) : (
        <>
          {/* Итоги за период */}
          <div className="card" style={{ marginTop: "16px" }}>
            <h3 className="card-title" style={{ marginBottom: "16px" }}>Итоги за период</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <p className="card-label">Фактические доходы</p>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#10b981" }}>
                  {totalPeriodIncome.toFixed(0)} Br
                </p>
              </div>
              <div>
                <p className="card-label">Фактические расходы</p>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#ef4444" }}>
                  {totalPeriodExpenses.toFixed(0)} Br
                </p>
              </div>
              <div>
                <p className="card-label">Количество месяцев</p>
                <p style={{ fontSize: "24px", fontWeight: 700 }}>{periodData.length}</p>
              </div>
            </div>
          </div>

          {/* Таблица по месяцам */}
          <div className="card" style={{ marginTop: "16px", overflowX: "auto" }}>
            <h3 className="card-title" style={{ marginBottom: "16px" }}>Детализация по месяцам</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ textAlign: "left", padding: "8px 4px" }}>Месяц</th>
                  <th style={{ textAlign: "right", padding: "8px 4px" }}>Доходы, Br</th>
                  <th style={{ textAlign: "right", padding: "8px 4px" }}>Расходы, Br</th>
                 </tr>
              </thead>
              <tbody>
                {periodData.map((month) => {
                  const [year, monthNum] = month.yearMonth.split("-");
                  return (
                    <tr key={month.yearMonth} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "8px 4px" }}>
                        {monthNames[parseInt(monthNum) - 1]} {year}
                       </td>
                      <td style={{ textAlign: "right", padding: "8px 4px", color: "#10b981" }}>
                        {month.income.toFixed(0)}
                       </td>
                      <td style={{ textAlign: "right", padding: "8px 4px", color: "#ef4444" }}>
                        {month.expenses.toFixed(0)}
                       </td>
                     </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}