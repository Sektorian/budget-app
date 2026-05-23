"use client";

import { useState } from "react";

export default function Page() {
  const PROJECT_RATE = 0.75;
  const PROJECT_COEFFICIENT = 0.7;
  const REGULAR_RATE = 0.5;
  const AFTER_TAX_RATE = 0.86;

  const [activeTab, setActiveTab] = useState("income");

  const [baseSalary, setBaseSalary] = useState(4500);
  const [employmentRate, setEmploymentRate] = useState(1);
  const [workingHoursPrevMonth, setWorkingHoursPrevMonth] = useState(168);

  const [projectHours, setProjectHours] = useState(32);
  const [regularHours, setRegularHours] = useState(96);

  const [actualSalaryIncome, setActualSalaryIncome] = useState(0);
  const [actualAdvanceIncome, setActualAdvanceIncome] = useState(0);

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
    { id: "income", label: "Доходы" },
    { id: "planning", label: "Планирование" },
    { id: "expenses", label: "Расходы" },
    { id: "stats", label: "Статистика" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-sm h-screen bg-white flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between bg-white">
          <div>
            <p className="text-sm text-gray-500">
              Текущий период
            </p>

            <h1 className="text-2xl font-bold">
              Май 2026
            </h1>
          </div>

          <button className="w-10 h-10 rounded-xl bg-gray-100 text-sm font-medium">
            М
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">

          {/* ДОХОДЫ */}
          {activeTab === "income" && (
            <div>

              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  Доходы
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Планируемые и фактические поступления
                </p>
              </div>

              {/* КОМПО */}
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4">

                <div className="flex items-center justify-between mb-4">

                  <h3 className="text-lg font-semibold">
                    КОМПО
                  </h3>

                  <div className="text-right">

                    <div className="mb-2">
                      <p className="text-xs text-gray-500">
                        Планируемый доход
                      </p>

                      <p className="text-lg font-bold">
                        {totalKompoIncome.toFixed(0)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Фактический доход
                      </p>

                      <p className="text-lg font-bold">
                        {totalActualIncome.toFixed(0)}
                      </p>
                    </div>

                  </div>

                </div>

                {/* INPUTS */}
                <div className="space-y-3">

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Оклад
                    </p>

                    <input
                      type="number"
                      value={baseSalary}
                      onChange={(e) =>
                        setBaseSalary(Number(e.target.value))
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Ставка
                    </p>

                    <input
                      type="number"
                      step="0.1"
                      value={employmentRate}
                      onChange={(e) =>
                        setEmploymentRate(Number(e.target.value))
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Рабочих часов в прошлом месяце
                    </p>

                    <input
                      type="number"
                      value={workingHoursPrevMonth}
                      onChange={(e) =>
                        setWorkingHoursPrevMonth(
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      ПРОЕКТНЫЕ (часы)
                    </p>

                    <input
                      type="number"
                      value={projectHours}
                      onChange={(e) =>
                        setProjectHours(Number(e.target.value))
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      РЕГУЛЯРНЫЕ (часы)
                    </p>

                    <input
                      type="number"
                      value={regularHours}
                      onChange={(e) =>
                        setRegularHours(Number(e.target.value))
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </div>

                </div>

                {/* FACT */}
                <div className="mt-5 space-y-3">

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Фактическая зарплата
                    </p>

                    <input
                      type="number"
                      value={actualSalaryIncome}
                      onChange={(e) =>
                        setActualSalaryIncome(
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Фактический аванс
                    </p>

                    <input
                      type="number"
                      value={actualAdvanceIncome}
                      onChange={(e) =>
                        setActualAdvanceIncome(
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </div>

                </div>

                {/* RESULTS */}
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-sm">

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Проектные
                    </span>

                    <span className="font-medium">
                      {projectIncome.toFixed(0)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Регулярные
                    </span>

                    <span className="font-medium">
                      {regularIncome.toFixed(0)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Зарплата
                    </span>

                    <span className="font-medium">
                      {salaryIncome.toFixed(0)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Аванс
                    </span>

                    <span className="font-medium">
                      {advanceIncome.toFixed(0)}
                    </span>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ПЛАНИРОВАНИЕ */}
          {activeTab === "planning" && (
            <div className="h-full flex items-center justify-center text-gray-500">
              Планирование
            </div>
          )}

          {/* РАСХОДЫ */}
          {activeTab === "expenses" && (
            <div className="h-full flex items-center justify-center text-gray-500">
              Расходы
            </div>
          )}

          {/* СТАТИСТИКА */}
          {activeTab === "stats" && (
            <div className="h-full flex items-center justify-center text-gray-500">
              Статистика
            </div>
          )}

        </div>

        {/* Bottom Navigation */}
        <div className="border-t p-2 grid grid-cols-4 gap-2 bg-white">

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2 rounded-xl text-sm transition ${
                activeTab === tab.id
                  ? "bg-black text-white"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}

        </div>
      </div>
    </div>
  );
}