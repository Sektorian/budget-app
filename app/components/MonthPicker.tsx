"use client";

import { useState } from "react";

type MonthPickerProps = {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
};

export default function MonthPicker({ year, month, onMonthChange }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = [
    "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
    "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
  ];

  const handleYearChange = (newYear: number) => {
    onMonthChange(newYear, month);
  };

  const handleMonthChange = (newMonth: number) => {
    onMonthChange(year, newMonth);
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        className="month-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        📅 {month}
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
          />
          
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "8px",
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 1000,
              minWidth: "240px",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <p className="card-label" style={{ marginBottom: "8px" }}>Год</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => handleYearChange(y)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      background: y === year ? "black" : "white",
                      color: y === year ? "white" : "#111827",
                      cursor: "pointer",
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="card-label" style={{ marginBottom: "8px" }}>Месяц</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                {months.map((m, index) => {
                  const monthNum = index + 1;
                  return (
                    <button
                      key={monthNum}
                      onClick={() => handleMonthChange(monthNum)}
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        background: monthNum === month ? "black" : "white",
                        color: monthNum === month ? "white" : "#111827",
                        cursor: "pointer",
                      }}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}