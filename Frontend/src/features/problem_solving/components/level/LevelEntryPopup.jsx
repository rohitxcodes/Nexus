export default function LevelEntryPopup({
  isOpen,
  levelNumber,
  shopItems,
  shopItemCounts,
  activeShopItems,
  onClose,
  onStart,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900">
          Level {levelNumber}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose which powers to activate for this game.
        </p>

        <div className="mt-4 space-y-3">
          {shopItems.map((item) => {
            const ownedCount = Number(shopItemCounts[item.key] || 0);
            const active = activeShopItems.some(
              (activeItem) => activeItem.key === item.key,
            );

            return (
              <div
                key={item.key}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-600">{item.description}</p>
                    <p className="mt-1 text-sm text-gray-700">
                      Owned: <span className="font-semibold">{ownedCount}</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      Selected for this level: {active ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            onClick={onStart}
          >
            Start Level
          </button>
        </div>
      </div>
    </div>
  );
}
