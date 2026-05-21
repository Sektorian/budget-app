export default function HomeBudgetApp() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-sm h-screen bg-white flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Текущий период</p>
            <h1 className="text-2xl font-bold">Май 2026</h1>
          </div>

          <button className="w-10 h-10 rounded-xl bg-gray-100">
            📅
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              Вкладка Расходы
            </h2>

            <p className="text-gray-500 mt-2">
              Здесь позже появится список расходов
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t p-2 grid grid-cols-4 gap-2">

          <button className="p-2 rounded-xl text-gray-500">
            Доходы
          </button>

          <button className="p-2 rounded-xl text-gray-500">
            Планирование
          </button>

          <button className="p-2 rounded-xl bg-black text-white">
            Расходы
          </button>

          <button className="p-2 rounded-xl text-gray-500">
            Статистика
          </button>

        </div>
      </div>
    </div>
  );
}