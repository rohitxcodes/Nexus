export default function ShopSidebar({
  sidebarOpen,
  shopItems,
  shopItemCounts,
  onToggleSidebar,
  onUsePower,
  usingPower,
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggleSidebar}
        className="fixed right-4 top-4 -mt-2.5 z-40 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500"
      >
        {sidebarOpen ? "Hide Powers" : "Show Powers"}
      </button>

      <aside
        className={`fixed right-0 top-0 z-30 flex h-full w-80 flex-col border-l border-white/20 bg-[#0a1535]/95 p-4 text-white shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h3 className="mt-16 text-xl font-bold tracking-wide">Shop Powers</h3>
        <p className="mt-1 text-xs leading-relaxed text-blue-100/80">
          View owned items and use powers for this level.
        </p>

        <div className="powers-scroll mt-4 flex-1 space-y-3 overflow-y-auto pr-1 pb-3">
          {shopItems.map((item) => {
            const ownedCount = Number(shopItemCounts[item.key] || 0);
            const isUsing = usingPower === item.key;
            const canUse = ownedCount > 0;

            return (
              <div
                key={item.key}
                className="rounded-lg border border-white/20 bg-white/5 p-3"
              >
                <p className="font-semibold">{item.label}</p>
                <p className="text-xs text-blue-100/75">{item.description}</p>
                <p className="mt-1 text-sm">Owned: {ownedCount}</p>

                <button
                  type="button"
                  onClick={() => onUsePower(item.key)}
                  disabled={!canUse || isUsing}
                  className={`mt-2 w-full rounded-md px-3 py-2 text-sm font-semibold ${
                    !canUse || isUsing
                      ? "cursor-not-allowed bg-gray-500/40 text-gray-300"
                      : "bg-emerald-600 hover:bg-emerald-500"
                  }`}
                >
                  {!canUse ? "Not Owned" : isUsing ? "Using..." : "Use"}
                </button>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
