const TOKEN_KEY = "token";
const SHOP_PURCHASES_BY_LEVEL_KEY = "shopPurchasesByLevel";
const SHOP_SELECTED_BY_LEVEL_KEY = "shopSelectedItemsByLevel";

// Save token after login
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};
// Read token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
// Remove token (logout)
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

const parseJSONFromStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const getShopPurchasesByLevel = () => {
  return parseJSONFromStorage(SHOP_PURCHASES_BY_LEVEL_KEY);
};

export const addPurchasedShopItem = (levelNumber, itemKey, count = 1) => {
  const levelKey = String(levelNumber);
  const purchases = getShopPurchasesByLevel();
  const levelBucket = purchases[levelKey] || {};
  levelBucket[itemKey] = Number(levelBucket[itemKey] || 0) + Number(count || 0);
  purchases[levelKey] = levelBucket;
  localStorage.setItem(SHOP_PURCHASES_BY_LEVEL_KEY, JSON.stringify(purchases));
};

export const consumePurchasedShopItems = (
  levelNumber,
  selectedItemKeys = [],
) => {
  const levelKey = String(levelNumber);
  const purchases = getShopPurchasesByLevel();
  const levelBucket = { ...(purchases[levelKey] || {}) };

  selectedItemKeys.forEach((itemKey) => {
    const current = Number(levelBucket[itemKey] || 0);
    if (current > 0) {
      levelBucket[itemKey] = current - 1;
      if (levelBucket[itemKey] <= 0) delete levelBucket[itemKey];
    }
  });

  purchases[levelKey] = levelBucket;
  localStorage.setItem(SHOP_PURCHASES_BY_LEVEL_KEY, JSON.stringify(purchases));
};

export const setSelectedShopItemsForLevel = (
  levelNumber,
  selectedItemKeys = [],
) => {
  const levelKey = String(levelNumber);
  const selectedMap = parseJSONFromStorage(SHOP_SELECTED_BY_LEVEL_KEY);
  selectedMap[levelKey] = Array.isArray(selectedItemKeys)
    ? selectedItemKeys
    : [];
  localStorage.setItem(SHOP_SELECTED_BY_LEVEL_KEY, JSON.stringify(selectedMap));
};

export const getSelectedShopItemsForLevel = (levelNumber) => {
  const levelKey = String(levelNumber);
  const selectedMap = parseJSONFromStorage(SHOP_SELECTED_BY_LEVEL_KEY);
  return Array.isArray(selectedMap[levelKey]) ? selectedMap[levelKey] : [];
};
